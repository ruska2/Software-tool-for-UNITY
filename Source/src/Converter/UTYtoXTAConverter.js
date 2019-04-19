import UTYtoXTAParser from "./Parsers/UTYtoXTAParser";


class UTYtoXTAConverter {

    constructor(code) {
        this.code = code;
    }


    convertToString= () => {
        let toWriteStr = "";
        const utyToXtaParser = new UTYtoXTAParser(this.code);
        utyToXtaParser.parse();

        let variables = utyToXtaParser.initializedVariables;
        if (variables === undefined) return;
        let sequentialAssignments = utyToXtaParser.sequentialAssignments;
        let paralellAssignments = utyToXtaParser.paralellAssignments;
        let numberOfAssignments = sequentialAssignments.length + paralellAssignments.length;

        if (numberOfAssignments === 0) return;

        toWriteStr += this.convertVariablesToString(variables);
        toWriteStr += "\n\n";
        toWriteStr += this.createBaseVariables();
        toWriteStr += this.createExecutionOrderList(numberOfAssignments);
        toWriteStr += "\n\n";
        toWriteStr += this.createAlwaysUpdateFunction(utyToXtaParser.alwaysSection);
        toWriteStr += "\n\n";
        toWriteStr += this.createSwapFunction();
        toWriteStr += "\n\n";
        toWriteStr += this.createResetExecutionOrder(numberOfAssignments);
        toWriteStr += "\n\n";
        toWriteStr += this.createMinimum();
        toWriteStr += "\n\n";
        toWriteStr += this.createMaximum();
        toWriteStr += "\n\n";
        toWriteStr += this.convertSequentialAssignments(sequentialAssignments, utyToXtaParser.alwaysSection.length);
        toWriteStr += this.convertParalelAssignments(paralellAssignments,sequentialAssignments.length, utyToXtaParser.alwaysSection.length);
        toWriteStr += this.createCoordinator(numberOfAssignments);
        toWriteStr += this.createRandomizer(numberOfAssignments);
        toWriteStr += this.createSystemDeclaration(sequentialAssignments,paralellAssignments);



        return toWriteStr;
    };

    convertVariablesToString = (variables) => {
        let toWriteStr = "";
        Object.keys(variables).forEach(function(key) {
            let value = variables[key];
            let type = value[0];
            let val = value[1];
            if (Array.isArray(val)){
                let helperString = type + " " + key + "[" + val.length + "] = {" ;
                for (let j = 0; j < val.length; j++) {
                    if (j + 1 < val.length) {
                        helperString += val[j] + ","
                    }
                    else {
                        helperString += val[j] + "};\n"
                    }
                }
                toWriteStr += helperString;
            }
            else{
                toWriteStr += type + " " + key + " = " + val +";\n"
            }
        });
        return toWriteStr;
    };

    createAlwaysUpdateFunction = (alwaysLines) =>{
        if (alwaysLines.length === 0) return "";
        let toWriteString = "void alwaysUpdate(){\n";
        for (let i = 0; i < alwaysLines.length; i++){
            toWriteString += "\t" + alwaysLines[i] + ";\n"
        }
        toWriteString += "}\n\n";
        return toWriteString;
    };

    createSwapFunction = () => {
        let toWriteString = "void swap(int &a, int &b){\n";
            toWriteString += "\t int c = a;\n";
            toWriteString += "\t a = b;\n\t b = c;\n}";
            toWriteString += "\n";
            toWriteString += "void swapB(bool &a, bool &b){\n";
            toWriteString += "\t bool c = a;\n";
            toWriteString += "\t a = b;\n\t b = c;\n}";
            return toWriteString
    };

    createBaseVariables = () => {
        let toWriteStr = "\/\/Base helper variables\n";
            toWriteStr += "int repeatCounter = 0;\n";
            toWriteStr += "int repeatNumber = 1;\n";
            toWriteStr += "int nextAssign = -1;\n";
            toWriteStr += "bool randomize = true;\n";
        return toWriteStr;
    };

    createExecutionOrderList = (length) => {
        let toWriteStr = "int executionOrder["+ (length) +"] = {";
        for(let i = 0; i < (length); i++){
            toWriteStr += (0) + ","
        }
        toWriteStr = toWriteStr.substring(0,toWriteStr.length-1);
        toWriteStr += "};\n";
        return toWriteStr;
    };

    createResetExecutionOrder = (length) => {
        let toWriteStr = "void resetExecutionOrder(){\n";
            toWriteStr += "\tfor (i : int[0,"+(length-1)+"]){\n";
            toWriteStr += "\t\texecutionOrder[i] = 0;\n";
            toWriteStr += "\t }\n}\n";
        return toWriteStr;
    };

    createMinimum = () => {
      let toWriteStr = "";
      toWriteStr += "int min(int &a, int &b){\n";
      toWriteStr += "\t return a < b ? a : b;\n";
      toWriteStr += "}\n";
      return toWriteStr;
    };

    createMaximum = () => {
        let toWriteStr = "";
        toWriteStr += "int max(int &a, int &b){\n";
        toWriteStr += "\t return a > b ? a : b;\n";
        toWriteStr += "}\n";
        return toWriteStr;
    };

    convertSequentialAssignments = (assignemnts, alwaysLength) => {
        let alwaysUpdate = alwaysLength === 0 ? "" : ", alwaysUpdate()";
        let toWriteStr = "";
        for (let i = 0; i < assignemnts.length; i++){
            toWriteStr += "process Assignment" + (i + 1) + "() {\n\n";
            toWriteStr += "state\n";
            toWriteStr += "\tS0,\n";
            toWriteStr += "\tS1;\n";
            toWriteStr += "commit\n";
            toWriteStr += "\tS0,\n";
            toWriteStr += "\tS1;\n";
            toWriteStr += "init S0;\n";
            toWriteStr += "trans\n";
            let guard = assignemnts[i][1];
            let expresion = assignemnts[i][0];

            toWriteStr += "\tS0 -> S1 { guard nextAssign == " + (i+1) +";},\n";

            if (guard === "") {
                toWriteStr += "\tS1 -> S1 { guard repeatNumber != repeatCounter; assign " + expresion+ ", repeatCounter += 1 " + alwaysUpdate + ";},\n";
            } else {
                toWriteStr += "\tS1 -> S1 { guard " + guard + " && repeatNumber != repeatCounter; assign " + expresion + ", repeatCounter += 1 " + alwaysUpdate + ";},\n";
                toWriteStr += "\tS1 -> S1 { guard !(" + guard + ") && repeatNumber != repeatCounter; assign repeatCounter += 1 " + alwaysUpdate + ";},\n";
            }

            toWriteStr += "\tS1 -> S0 { guard repeatNumber == repeatCounter; assign nextAssign = -1;};\n";

            toWriteStr += "}\n\n";
        }
        return toWriteStr;
    };

    convertParalelAssignments = (paralellAssignments, seqLength, alwaysLength) =>{
        let alwaysUpdate = alwaysLength === 0 ? "" : ", alwaysUpdate()";
        let toWriteStr = "";
        for (let i = 0; i < paralellAssignments.length; i++){
            toWriteStr += "process Assignment" + (i + 1 + seqLength) + "() {\n\n";
            toWriteStr += "state\n";
            for(let j = 0; j < paralellAssignments[i].length; j++){
                toWriteStr += "\tS"+ (j) +",\n";
            }
            toWriteStr += "\tS"+ (paralellAssignments[i].length ) +";\n";
            toWriteStr += "commit\n";
            for(let j = 0; j < paralellAssignments[i].length; j++){
                toWriteStr += "\tS"+ (j) +",\n";
            }
            toWriteStr += "\tS"+ (paralellAssignments[i].length ) +";\n";
            toWriteStr += "init S0;\n";
            toWriteStr += "trans\n";
            toWriteStr += "\tS0 -> S1 { guard nextAssign == " + (i + seqLength + 1) +";},\n";
            for(let j = 1; j < paralellAssignments[i].length+1; j++){
                let guard = paralellAssignments[i][j-1][1];
                let expression = paralellAssignments[i][j-1][0];
                if (guard !== "") {
                    if(j+1 === paralellAssignments[i].length+1){
                        toWriteStr += "\tS" + (j) +" -> S1 {guard " + guard + ";   assign " + expression + ", repeatCounter += 1" + alwaysUpdate +";},\n";
                        toWriteStr += "\tS" + (j) +" -> S1 {guard !(" + guard + "); assign  repeatCounter += 1;},\n";
                        toWriteStr += "\tS1 -> S0 { guard repeatNumber == repeatCounter; assign nextAssign = -1;};\n";
                    }
                    else{
                        if(j === 1){
                            toWriteStr += "\tS" + (j) +" -> S"+ (j+1) +"  {guard  " + guard + " && repeatNumber != repeatCounter;   assign " +  expression + "" + alwaysUpdate + ";},\n";
                            toWriteStr += "\tS" + (j) +" -> S"+ (j+1) +"  {guard !(" + guard + ") && repeatNumber != repeatCounter; },\n";
                        }else{
                            toWriteStr += "\tS" + (j) +" -> S"+ (j+1) +"  {guard " + guard + "; assign " + expression + "" + alwaysUpdate + + ";},\n";
                            toWriteStr += "\tS" + (j) +" -> S"+ (j+1) +"  {guard !(" + guard + ");},\n";
                        }
                    }

                } else {
                    if(j+1 === paralellAssignments[i].length+1){
                        toWriteStr += "\tS" + (j) + " -> S1{ assign " + expression + ", repeatCounter += 1 " + alwaysUpdate + ";},\n";
                        toWriteStr += "\tS1  -> S0 { guard repeatNumber == repeatCounter; assign nextAssign = -1;};\n";
                    }
                    else{
                        if(j === 1){
                            toWriteStr += "\tS" + (j) +" -> S" + (j+1) + "{guard  repeatNumber != repeatCounter;  assign " + expression + "" + alwaysUpdate +";},\n";
                        }else{
                            toWriteStr += "\tS" + (j) +" -> S" + (j+1) + "{ assign " + expression + "" + alwaysUpdate + ";},\n";
                        }

                    }
                }

            }
            toWriteStr += "}\n\n";

        }
        return toWriteStr;

    };

    createSystemDeclaration = (sequentialAssigmnets, paralellAssignment) => {
        let toWriteStr = "";
        let seqLength = sequentialAssigmnets.length;
        let parLength = paralellAssignment.length;
        for (let i = 0; i < seqLength; i++) {
            toWriteStr += "assignment" + (i + 1) + " = Assignment" + (i + 1) + "();\n";
        }

        for (let i = 0; i < parLength; i++) {
            toWriteStr += "assignment" + (i + 1 + seqLength) + " = Assignment" + (i + 1 + seqLength) + "();\n";
        }

        toWriteStr += "coordinator = Coordinator();\n";
        toWriteStr += "randomizer = Randomizer();\n";

        toWriteStr += "system coordinator, randomizer,";
        for (let i = 0; i < seqLength; i++) {
                toWriteStr += "assignment" + (i + 1) + ",";
        }

        for (let i = 0; i < parLength; i++) {
            toWriteStr += "assignment" + (i + 1 + seqLength) + ",";
        }

        toWriteStr = toWriteStr.substring(0,toWriteStr.length-1) + ";";
        return toWriteStr;
    };

    createCoordinator = (length) =>{
        let toWriteStr = "process Coordinator() {\n\n";
        toWriteStr += "state\n";
        for(let i = 0; i < (length + 2) ; i++){
            toWriteStr += "\tS" + i +",\n";
        }
        toWriteStr = toWriteStr.substring(0,toWriteStr.length-2) + ";\n";
        toWriteStr += "commit\n";
        for(let i = 0; i < (length + 2) ; i++){
            toWriteStr += "\tS" + i +",\n";
        }
        toWriteStr = toWriteStr.substring(0,toWriteStr.length-2) + ";\n";
        toWriteStr += "init S0;\n";
        toWriteStr += "trans\n";
        toWriteStr += "\tS0 -> S1{guard nextAssign == -1 && !randomize;},\n";
        for(let i = 1; i < (length + 2); i++){
            if(i+1 === (length + 2)){
                toWriteStr += "\tS"+ i +" -> S0{ guard nextAssign == -1; assign repeatCounter = 0, randomize = true;};\n";
            }else{
                toWriteStr += "\tS"+ i +" -> S"+ (i+1) +"{ select randomRepeatNumber : int[1,5]; guard nextAssign == -1;  assign repeatNumber = randomRepeatNumber, nextAssign = executionOrder["+ (i-1)+"], repeatCounter = 0; },\n";
            }
        }

        toWriteStr += "}\n\n";
        return toWriteStr;
    };

    createRandomizer = (length) =>{
        let toWriteStr = "process Randomizer() {\n\n";
        toWriteStr += "int globalIndex= 1;\n";
        toWriteStr += "bool added = false;\n";
        toWriteStr += "state\n";
        for(let i = 0; i <(length + 1) ; i++){
            toWriteStr += "\tS" + i +",\n";
        }
        toWriteStr = toWriteStr.substring(0,toWriteStr.length-2) + ";\n";
        toWriteStr += "commit\n";
        for(let i = 0; i <(length + 1) ; i++){
            toWriteStr += "\tS" + i +",\n";
        }
        toWriteStr = toWriteStr.substring(0,toWriteStr.length-2) + ";\n";
        toWriteStr += "init S0;\n";
        toWriteStr += "trans\n";
        toWriteStr += "\tS0 -> S1{ select index : int[0, " + (length+1) +"]; guard randomize == true; assign resetExecutionOrder(), globalIndex = index;},\n";

        let c = 1;
        for(let i = 1; i < length+1; i+= 1){
            if(i+1 === (length)+1){
                toWriteStr += "\tS"+ i +" -> S0{guard added; assign randomize = false, added = false;},\n";
                toWriteStr += "\tS"+ i +" -> S"+ (i) +"{guard globalIndex < "+ length +" && executionOrder[globalIndex] == 0 && !added; assign executionOrder[globalIndex] = " + c +", added = true;},\n";
                toWriteStr += "\tS"+ i +" -> S"+ (i) +"{guard globalIndex < "+ length +" && executionOrder[globalIndex] != 0 && !added; assign globalIndex += 1;},\n";
                toWriteStr += "\tS"+ i +" -> S"+ (i) +"{guard globalIndex >= "+ length +" && !added; assign globalIndex = 0;};\n";
            }else{
                toWriteStr += "\tS"+ i +" -> S"+ (i+1) +"{select index: int[0, " + length + "]; guard added; assign added = false, globalIndex = index;},\n";
                toWriteStr += "\tS"+ (i) +" -> S"+ (i) +"{guard globalIndex < "+ length +" && executionOrder[globalIndex] == 0 && !added; assign executionOrder[globalIndex] = " + c +", added = true;},\n";
                toWriteStr += "\tS"+ (i) +" -> S"+ (i) +"{guard globalIndex < "+ length +" && executionOrder[globalIndex] != 0 && !added; assign globalIndex += 1;},\n";
                toWriteStr += "\tS"+ (i) +" -> S"+ (i) +"{guard globalIndex >= "+ length +" && !added; assign globalIndex = 0;},\n";
            }
            c++;
        }


        toWriteStr += "}\n\n";
        return toWriteStr;
    }
}

export default UTYtoXTAConverter;

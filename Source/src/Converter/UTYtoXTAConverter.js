import UTYtoXTAParser from "./UTYtoXTAParser";


class UTYtoXTAConverter {

    constructor(code) {
        this.code = code;
    }


    convertToString= () => {
        let toWriteStr = "";
        const utyToXtaParser = new UTYtoXTAParser(this.code);
        utyToXtaParser.parse();
        let variables = utyToXtaParser.getVariables();
        let assignments = utyToXtaParser.getSequential();
        let cycles = utyToXtaParser.getQuantified();
        let paralell = utyToXtaParser.getQuantifiedParalell();
        let always = utyToXtaParser.getAlways();
        console.log("paralell");
        console.log(paralell);

        let keys = [];
        Object.keys(variables).forEach(function (key) {
            keys.push(key);
        });


        let counter = assignments.length;
        let cyclecount = cycles.length;
        let cyclecount2 = 0;

        for (let i = 0; i < cyclecount; i++) {

            for (let j = 0; j < cycles[i].length; j++) {
                cyclecount2++;
            }
        }




        let paracyclecount = paralell.length;

        toWriteStr += "int executionOrder["+ (paracyclecount + counter + cyclecount2) +"] = {";
        for(let i = 0; i < (paracyclecount + counter + cyclecount2); i++){
            toWriteStr += (0) + ","
        }
        toWriteStr = toWriteStr.substring(0,toWriteStr.length-1);
        toWriteStr += "};\n";


        console.log(keys);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if ((variables[key].includes("true") || variables[key].includes("false")) && !(variables[key] instanceof Array)) {
                toWriteStr += "bool " + key + " = " + variables[key] + ";\n";
            }
            else if (!isNaN(Number(variables[key]))) {
                toWriteStr += "int " + key + " = " + variables[key] + ";\n";
            } else {
                let arry = variables[key];
                let helperString = "{";
                console.log("arry", arry);
                for (let j = 0; j < arry.length; j++) {
                    if (j + 1 < arry.length) {
                        helperString += arry[j] + ","
                    }
                    else {
                        helperString += arry[j] + "};\n"
                    }
                }
                if ((variables[key][0].includes("true") || variables[key][0].includes("false"))) {
                    toWriteStr += "bool " + key + "[" + variables[key].length + "] := " + helperString;
                }
                else if (!isNaN(Number(variables[key][0]))) {
                    toWriteStr += "int " + key + "[" + variables[key].length + "] := " + helperString;
                }
            }
        }




        toWriteStr += "\n";
        toWriteStr += "\n";

        toWriteStr += "int intvarhelper = 0;\n";
        toWriteStr += "bool boolvarhelper = false;\n";
        toWriteStr += "bool updateAlways = false;\n";
        toWriteStr += "int repeatCounter = 0;\n";
        toWriteStr += "int repeatNumber = 1;\n";
        toWriteStr += "int nextAssign = -1;\n";
        toWriteStr += "bool randomize = true;\n";
        toWriteStr += "int globalIndex= 1;\n";
        toWriteStr += "bool added = false;\n";


        toWriteStr += "\n";


        toWriteStr += "\n\n";


        for (let i = 0; i < assignments.length; i++) {
            toWriteStr += "process Line" + (i + 1) + "() {\n\n";
            toWriteStr += "state\n";
            toWriteStr += "\tS0,\n";
            toWriteStr += "\tS1;\n";
            toWriteStr += "commit\n";
            toWriteStr += "\tS0,\n";
            toWriteStr += "\tS1;\n";
            toWriteStr += "init S0;\n";
            toWriteStr += "trans\n";
            let guard = assignments[i][2];
            let first = assignments[i][0] + " := " + assignments[i][1];

            toWriteStr += "\tS0 -> S1 { guard nextAssign == " + (i+1) +";},\n";

            if (guard === "") {
                toWriteStr += "\tS1 -> S1 { guard repeatNumber != repeatCounter; assign " + first + ", repeatCounter += 1;},\n";
            } else {
                toWriteStr += "\tS1 -> S1 { guard " + guard + " && repeatNumber != repeatCounter; assign " + first + ", repeatCounter += 1;},\n";
                toWriteStr += "\tS1 -> S1 { guard !(" + guard + ") && repeatNumber != repeatCounter; assign repeatCounter += 1;},\n";
            }

            toWriteStr += "\tS1 -> S0 { guard repeatNumber == repeatCounter; assign nextAssign = -1, updateAlways = true;};\n";

            toWriteStr += "}\n\n";
        }

        let xs = counter;
        for (let i = 0; i < cyclecount; i++) {

            for (let j = 0; j < cycles[i].length; j++) {

                toWriteStr += "\n";

                toWriteStr += "process Cycle" + (i + 1) + (j + 1) + "() {\n\n";
                toWriteStr += "state\n";
                toWriteStr += "\tS0,\n";
                toWriteStr += "\tS1;\n";
                toWriteStr += "commit\n";
                toWriteStr += "\tS0,\n";
                toWriteStr += "\tS1;\n";
                toWriteStr += "init S0;\n";
                toWriteStr += "trans\n";


                let line = cycles[i][j].split("if");
                let guard = "";
                console.log(line);
                if (line.length > 1) {
                    guard = line[1].trim();
                }
                let con = line[0].trim();
                con = con.split(":=");
                if(con.length > 1){
                    let left = con[0].split(",");
                    let right = con[1].split(",");
                    //alert(left.length + "  " +right.length);
                    //alert(left + "  " +right);
                    if(left.length !== right.length){
                        alert("SYNTAX ERROR!");
                        return;
                    }
                    if(left.length === 1){
                        con = line[0].trim();
                    }else{
                        con = "";
                        for(let k = 0; k < left.length; k+= 1){
                            let leftv = left[k].trim();
                            let rightv = right[k].trim();
                            //alert(k + " " + left.length);
                            if(k === left.length-1){

                                con += left[k].trim() + " :=" + right[k].trim();
                                continue;
                            }
                            let leftv1 = left[k+1].trim();
                            let rightv1 = right[k+1].trim();
                            if(k+1 < left.length && leftv === rightv1 && leftv1 === rightv){
                                if(k+2 < left.length){
                                    con += "intvarhelper := " + leftv + ",\n";
                                    con += leftv + " := " + rightv + ",\n";
                                    con += rightv + " := intvarhelper,"
                                }else{
                                    con += "intvarhelper := " + leftv + ",\n";
                                    con += leftv + " := " + rightv + ",\n";
                                    con += rightv + " := intvarhelper"
                                }
                                k++;
                            }else{
                                if(k+1 < left.length){
                                    con += left[k].trim() + " :=" + right[k].trim()+",\n";
                                }else{
                                    con += left[k].trim() + " :=" + right[k].trim();
                                }
                            }
                        }
                    }

                }else{
                    con = line[0].trim();
                }

                toWriteStr += "\tS0 -> S1 { guard nextAssign == " + (j+1 + counter) +";},\n";
                xs++;

                if (guard !== "") {
                    toWriteStr += "\tS1 -> S1  {guard  " + guard + " && repeatNumber != repeatCounter;  assign " + con +  ", repeatCounter += 1;},\n";
                    toWriteStr += "\tS1 -> S1  {guard !(" + guard + ") && repeatNumber != repeatCounter; assign  repeatCounter += 1;},\n";
                } else {
                    toWriteStr += "\tS1 -> S1 {guard  repeatNumber != repeatCounter;  assign " + con + " , repeatCounter += 1;},\n";
                }

                toWriteStr += "\tS1 -> S0 { guard repeatNumber == repeatCounter; assign nextAssign = -1, updateAlways = true;};\n";

                toWriteStr += "}\n\n";
            }

        }


        toWriteStr += "\n";
        toWriteStr += "\n";




        //paralell
        for(let i = 0; i < paracyclecount; i++){
            toWriteStr += "process ParalellCycle" + (i + 1) + "() {\n\n";
            toWriteStr += "state\n";
            for(let j = 0; j < paralell[i].length; j++){
                toWriteStr += "\tS"+ (j) +",\n";
            }
            toWriteStr += "\tS"+ (paralell[i].length ) +";\n";
            toWriteStr += "commit\n";
            for(let j = 0; j < paralell[i].length; j++){
                toWriteStr += "\tS"+ (j) +",\n";
            }
            toWriteStr += "\tS"+ (paralell[i].length ) +";\n";
            toWriteStr += "init S0;\n";
            toWriteStr += "trans\n";
            toWriteStr += "\tS0 -> S1 { guard nextAssign == " + (i + cyclecount2 + counter + 1) +";},\n";
            for(let j = 1; j < (paralell[i].length)+1; j++){
                j--;
                let line = paralell[i][j].split("if");
                j++;
                let guard = "";
                console.log(line);
                if (line.length > 1) {
                    guard = line[1].trim();
                }
                let con = line[0].trim();
                con = con.split(":=");
                if(con.length > 1){
                    let left = con[0].split(",");
                    let right = con[1].split(",");
                    //alert(left.length + "  " +right.length);
                    //alert(left + "  " +right);
                    if(left.length !== right.length){
                        alert("SYNTAX ERROR!");
                        return;
                    }
                    if(left.length === 1){
                        con = line[0].trim();
                    }else{
                        con = "";
                        for(let k = 0; k < left.length; k+= 1){
                            let leftv = left[k].trim();
                            let rightv = right[k].trim();
                            //alert(k + " " + left.length);
                            if(k === left.length-1){

                                con += left[k].trim() + " :=" + right[k].trim();
                                continue;
                            }
                            let leftv1 = left[k+1].trim();
                            let rightv1 = right[k+1].trim();
                            if(k+1 < left.length && leftv === rightv1 && leftv1 === rightv){
                                if(k+2 < left.length){
                                    con += "intvarhelper := " + leftv + ",\n";
                                    con += leftv + " := " + rightv + ",\n";
                                    con += rightv + " := intvarhelper,"
                                }else{
                                    con += "intvarhelper := " + leftv + ",\n";
                                    con += leftv + " := " + rightv + ",\n";
                                    con += rightv + " := intvarhelper"
                                }
                                k++;
                            }else{
                                if(k+1 < left.length){
                                    con += left[k].trim() + " :=" + right[k].trim()+",\n";
                                }else{
                                    con += left[k].trim() + " :=" + right[k].trim();
                                }
                            }
                        }
                    }

                }else{
                    con = line[0].trim();
                }
                let con2 = con;



                if (guard !== "") {
                    if(j+1 === paralell[i].length+1){
                        con = con.substring(0,con.length) ;
                        toWriteStr += "\tS" + (j) +" -> S1 {guard " + guard + ";   assign " + con + ", repeatCounter += 1;},\n";
                        toWriteStr += "\tS" + (j) +" -> S1 {guard !(" + guard + "); assign  repeatCounter += 1;},\n";
                        toWriteStr += "\tS1 -> S0 { guard repeatNumber == repeatCounter; assign nextAssign = -1, updateAlways = true;};\n";
                    }
                    else{
                        if(j === 1){
                            con = con.substring(0,con.length)  ;
                            toWriteStr += "\tS" + (j) +" -> S"+ (j+1) +"  {guard  " + guard + " && repeatNumber != repeatCounter;   assign " + con + ";},\n";
                            toWriteStr += "\tS" + (j) +" -> S"+ (j+1) +"  {guard !(" + guard + ") && repeatNumber != repeatCounter; },\n";
                        }else{
                            toWriteStr += "\tS" + (j) +" -> S"+ (j+1) +"  {guard " + guard + "; assign " + con + ";},\n";
                            toWriteStr += "\tS" + (j) +" -> S"+ (j+1) +"  {guard !(" + guard + ");},\n";
                        }
                    }

                } else {
                    if(j+1 === paralell[i].length+1){
                        con = con.substring(0,con.length);
                        toWriteStr += "\tS" + (j) + " -> S1{ assign " + con + ", repeatCounter += 1;},\n";
                        toWriteStr += "\tS1  -> S0 { guard repeatNumber == repeatCounter; assign nextAssign = -1, updateAlways = true;};\n";
                    }
                    else{
                        if(j === 1){
                            con = con.substring(0,con.length);
                            toWriteStr += "\tS" + (j) +" -> S" + (j+1) + "{guard  repeatNumber != repeatCounter;  assign " + con + ";},\n";
                        }else{
                            toWriteStr += "\tS" + (j) +" -> S" + (j+1) + "{ assign " + con2 + ";},\n";
                        }

                    }
                }

            }
            toWriteStr += "}\n\n";
        }



        toWriteStr += "process Cordinator() {\n\n";
        toWriteStr += "int randomRepeatNumber = 1;\n";
        toWriteStr += "state\n";
        for(let i = 0; i < (counter + cyclecount2 + paracyclecount + 3) ; i++){
            toWriteStr += "\tS" + i +",\n";
        }
        toWriteStr = toWriteStr.substring(0,toWriteStr.length-2) + ";\n";
        toWriteStr += "commit\n";
        for(let i = 0; i < (counter + cyclecount2 + paracyclecount + 3) ; i++){
            toWriteStr += "\tS" + i +",\n";
        }
        toWriteStr = toWriteStr.substring(0,toWriteStr.length-2) + ";\n";
        toWriteStr += "init S0;\n";
        toWriteStr += "trans\n";
        toWriteStr += "\tS0 -> S1{guard nextAssign == -1 && !randomize;},\n";
        toWriteStr += "\tS1 -> S2{ select randomRepeatNumber : int[1,5];},\n";
        for(let i = 2; i < (counter + cyclecount2+ paracyclecount)+3; i++){
            if(i+1 === (counter + cyclecount2 +paracyclecount + 3)){
                toWriteStr += "\tS"+ i +" -> S0{ guard nextAssign == -1 && updateAlways == false; assign repeatCounter = 0, randomize = true;};\n";
            }else{
                toWriteStr += "\tS"+ i +" -> S"+ (i+1) +"{ select randomRepeatNumber : int[1,5]; guard nextAssign == -1 && updateAlways == false;  assign repeatNumber = randomRepeatNumber, nextAssign = executionOrder["+ (i-2)+"], repeatCounter = 0; },\n";
            }
        }

        toWriteStr += "}\n\n";

        let alwaysstr = "";
        if(always.length > 0 ){
            alwaysstr += ",";
        }
        for(let i = 0; i < always.length; i++){
            if(i+1 < always.length){
                alwaysstr += always[i] + ", ";
            }else{
                alwaysstr += always[i] + ";";
            }
        }
        toWriteStr += "process AlwaysUpdater() {\n\n";
        toWriteStr += "state\n";
        toWriteStr += "\tS0;\n";
        toWriteStr += "commit\n";
        toWriteStr += "\tS0;\n";
        toWriteStr += "init S0;\n";
        toWriteStr += "trans\n";
        toWriteStr += "\tS0 -> S0{guard updateAlways == true; assign updateAlways = false " + alwaysstr+ ";};\n";


        toWriteStr += "}\n\n";

        let all = counter + cyclecount2 + paracyclecount;
        toWriteStr += "process Randomizer() {\n\n";
        toWriteStr += "int index = 0;\n";
        toWriteStr += "state\n";
        for(let i = 0; i <((counter + cyclecount2 + paracyclecount )) + 1 ; i++){
            toWriteStr += "\tS" + i +",\n";
        }
        toWriteStr = toWriteStr.substring(0,toWriteStr.length-2) + ";\n";
        toWriteStr += "commit\n";
        for(let i = 0; i <((counter + cyclecount2 + paracyclecount )) + 1 ; i++){
            toWriteStr += "\tS" + i +",\n";
        }
        toWriteStr = toWriteStr.substring(0,toWriteStr.length-2) + ";\n";
        toWriteStr += "init S0;\n";
        toWriteStr += "trans\n";
        toWriteStr += "\tS0 -> S1{ select index : int[0, " + (all+1) +"]; guard randomize == true; assign ";
            for(let i = 0; i < all; i++){
                toWriteStr += "executionOrder[" + i +"] = 0,"
            }
            toWriteStr = toWriteStr.substring(0,toWriteStr.length -1);
            toWriteStr += ", globalIndex = index;},\n";

        let c = 1;
        for(let i = 1; i < all+1; i+= 1){
            if(i+1 === (all)+1){
                toWriteStr += "\tS"+ i +" -> S0{guard added; assign randomize = false, added = false;},\n";
                toWriteStr += "\tS"+ i +" -> S"+ (i) +"{guard globalIndex < "+ all +" && executionOrder[globalIndex] == 0 && !added; assign executionOrder[globalIndex] = " + c +", added = true;},\n";
                toWriteStr += "\tS"+ i +" -> S"+ (i) +"{guard globalIndex < "+ all +" && executionOrder[globalIndex] != 0 && !added; assign globalIndex += 1;},\n";
                toWriteStr += "\tS"+ i +" -> S"+ (i) +"{guard globalIndex >= "+ all +" && !added; assign globalIndex = 0;};\n";
            }else{
                toWriteStr += "\tS"+ i +" -> S"+ (i+1) +"{select index: int[0, " + all + "]; guard added; assign added = false, globalIndex = index;},\n";
                toWriteStr += "\tS"+ (i) +" -> S"+ (i) +"{guard globalIndex < "+ all +" && executionOrder[globalIndex] == 0 && !added; assign executionOrder[globalIndex] = " + c +", added = true;},\n";
                toWriteStr += "\tS"+ (i) +" -> S"+ (i) +"{guard globalIndex < "+ all +" && executionOrder[globalIndex] != 0 && !added; assign globalIndex += 1;},\n";
                toWriteStr += "\tS"+ (i) +" -> S"+ (i) +"{guard globalIndex >= "+ all +" && !added; assign globalIndex = 0;},\n";
            }
            c++;
        }


        toWriteStr += "}\n\n";

        toWriteStr += "cordinator = Cordinator();\n";
        toWriteStr += "randomizer = Randomizer();\n";
        toWriteStr += "alwaysUpdater = AlwaysUpdater();\n";

        for (let i = 0; i < counter; i++) {
            toWriteStr += "line" + (i + 1) + " = Line" + (i + 1) + "();\n";
        }

        for (let i = 0; i < cyclecount; i++) {
            for (let j = 0; j < cycles[i].length; j++) {
                toWriteStr += "cycle" + (i + 1) + (j + 1) + " = Cycle" + (i + 1) + (j + 1) + "();\n";
            }
        }

        for (let i = 0; i < paracyclecount; i++) {
                toWriteStr += "paralellCycle" + (i + 1) + " = ParalellCycle" + (i + 1) + "();\n";
        }


        toWriteStr += "system cordinator, randomizer, alwaysUpdater,";
        for (let i = 0; i < counter; i++) {
            if (i + 1 === counter) {
                toWriteStr += "line" + (i + 1) + ",";
            } else {
                toWriteStr += "line" + (i + 1) + ",";
            }
        }

        for (let i = 0; i < cyclecount; i++) {
            for (let j = 0; j < cycles[i].length; j++) {
                toWriteStr += "cycle" + (i + 1) + (j + 1) + ",";
            }
        }

        for (let i = 0; i < paracyclecount; i++) {
                toWriteStr += "paralellCycle" + (i + 1) + ",";
        }

        toWriteStr = toWriteStr.substring(0,toWriteStr.length-1) + ";";

        return toWriteStr;
    };



}

export default UTYtoXTAConverter;

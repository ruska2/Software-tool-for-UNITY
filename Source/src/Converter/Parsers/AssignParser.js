import ErrorHandler from "./ErrorHandler";
import CommonFunctions from "./CommonFunctions";

class AssignParser{

    constructor(assign, initializedVariables) {
        this.assign = assign;
        this.initializedVariables = initializedVariables;
        this.errorHandler = new ErrorHandler();
        this.commonFunctions = new CommonFunctions();
        this.paralellAssignments = [];
        this.sequentialAssignments = [];
        this.box = '\u25A1';
    }

    parseAssign = () => {
        let initalizedVars = this.initializedVariables;
        for (let i = 0; i < this.assign.length; i++) {
            let line = this.assign[i];
            if (line.startsWith(this.box)){
                line = line.substring(1,line.length);
            }
            if (line.startsWith("<")){
                // <|| i : 0 <= i < 5 :: k[i],k[i+1] := k[i+1],k[i] if k[i] > k[i+1]>
                let parsedLine = line.substring(1,line.length-1);
                let paralel = false;

                if (parsedLine.startsWith("||")){
                    paralel = true;
                    parsedLine = parsedLine.substring(2,parsedLine.length);
                }
                else if (parsedLine.startsWith(this.box)){
                    parsedLine = parsedLine.substring(1,parsedLine.length);
                }
                let iteratorVariable = this.commonFunctions.getIteratorVariable(parsedLine);
                let startNumber = this.commonFunctions.getStartNumberOfIterator(parsedLine.split(":")[1]);
                let endLine = this.commonFunctions.getStringBetween(parsedLine, startNumber, "::")
                let endNumber = this.commonFunctions.getEndNumberOfIterator(endLine);
                let expression = parsedLine.split("::")[1];
                let quantifiedParts = [];
                console.log(expression);

                expression = this.commonFunctions.replaceAll(expression, "if", "##");
                for (let i = startNumber; i <= endNumber; i++){
                    //alert(this.replaceAll(splitedif[0],variable, i));
                    let oneIter = this.commonFunctions.replaceAll(expression,iteratorVariable, i + "");
                    //let secondpart  = this.replaceAll(splitedif[1],variable, i + "");
                    oneIter = this.commonFunctions.replaceAll(oneIter, "##", "if");
                    quantifiedParts.push(oneIter);
                }
                if(paralel){
                    let paralelList= [];
                    for (let x = 0; x < quantifiedParts.length; x++){
                        let res = this.parseOneAssignLine(quantifiedParts[x],initalizedVars);
                        if (!res) return false;
                        paralelList.push(res);
                    }
                    this.paralellAssignments.push(paralelList);
                }else{
                    for (let x = 0; x < quantifiedParts.length; x++){
                        let res = this.parseOneAssignLine(quantifiedParts[x],initalizedVars);
                        if (!res) return false;
                        this.sequentialAssignments.push(res);
                    }
                }

            }
            else if (line.includes("||")){
                //Random order when || operator used
                let initials = this.commonFunctions.shuffle(line.split("||"));
                let paralelList= [];
                for (let l = 0; l < initials.length; l++){
                    let res = this.parseOneAssignLine(initials[l],initalizedVars);
                    if (!res) return false;
                    paralelList.push(res);
                }
                this.paralellAssignments.push(paralelList);
            }
            else{
                let res = this.parseOneAssignLine(line, initalizedVars);
                if (!res) return false;
                this.sequentialAssignments.push(res);
            }
        }

        console.log("assigned");
        console.log(this.sequentialAssignments);
        console.log(this.paralellAssignments);
        return true;
    };


    parseOneAssignLine(line, initalizedVars){
        let splitOnIf = line.split("if");
        line = splitOnIf[0];
        let guard = splitOnIf.length === 2 ? splitOnIf[1] : "";
        let splitedLine = line.split(":=");
        if (!this.errorHandler.checkInitialyEqualsLength(splitedLine.length)){
            return false;
        }
        let variables = splitedLine[0].split(",");
        let values = splitedLine[1].split(",");

        if (!this.errorHandler.checkInitNumberInRow(variables,values)){
            return false;
        }
        let oneLineString = "";
        for (let n = 0; n < variables.length; n++) {
            let key = variables[n];
            let value = values[n];
            let keynext = null;
            let valuenext = null;
            if (n + 1 < variables.length){
                keynext = variables[n+1];
                valuenext = values[n+1];
            }
            let actualValue = "";
            if (key.includes("[") && key.includes("]")){
                let startIndex = key.indexOf("[");
                let endIndex = key.indexOf("]");
                let variable = key.substring(0, startIndex);
                let indexInList = key.substring(startIndex+ 1, endIndex);
                let startIndex2 = null;
                let endIndex2 = null;
                let variable2 = null;
                let indexInList2 = null;
                let valueType2 = null;
                actualValue = this.initializedVariables[variable];
                if(actualValue === undefined){
                    this.errorHandler.callVariableNotInitializedError(variable);
                }
                if (keynext !== null && keynext.includes("[") && keynext.includes("]")){
                    startIndex2 = keynext.indexOf("[");
                    endIndex2 = keynext.indexOf("]");
                    variable2 = keynext.substring(0, startIndex2);
                    indexInList2 = keynext.substring(startIndex2+ 1, endIndex2);
                    let actualValue2 = this.initializedVariables[variable2];
                    if(actualValue2 === undefined){
                        this.errorHandler.callVariableNotInitializedError(variable2);
                    }
                    if (!this.errorHandler.checkIfArrayInVariables(variable2,this.initializedVariables)){
                        return false;
                    }
                    valueType2 = this.commonFunctions.getExpressionValues(variable2, this.initializedVariables);
                    if (!this.errorHandler.checkTypesEq(valueType2, initalizedVars[variable2][0])){
                        return false;
                    }
                    if (!this.errorHandler.checkArraySize(indexInList2,variable2, initalizedVars)){
                        return false;
                    }
                }
                if (!this.errorHandler.checkIfArrayInVariables(variable,this.initializedVariables)){
                    return false;
                }
                let valueType = this.commonFunctions.getExpressionValues(variable, this.initializedVariables);
                if (!this.errorHandler.checkTypesEq(valueType, initalizedVars[variable][0])){
                    return false;
                }
                if (!this.errorHandler.checkArraySize(indexInList,variable, initalizedVars)){
                    return false;
                }

                if(valueType2 != null && valueType !== valueType2){
                   this.errorHandler.callDifferentTypes(key,keynext);
                }

                if(valueType2 === null || (key !== valuenext && keynext !== value)){
                    oneLineString += key + " := " + value +", ";
                }
                else{
                    n++;
                    if (this.initializedVariables[variable][0] === "bool"){
                        oneLineString += "swapB("+key +", "+ keynext+ "), ";
                    }
                    else{
                        oneLineString += "swap("+key +", "+ keynext+ "), ";
                    }
                }
            }


            else{
                if (valuenext === null || (key !== valuenext && keynext !== value)) {
                    oneLineString += key + " := " + value +", ";
                }else{
                    if (this.initializedVariables[key][0] === "bool"){
                        oneLineString += "swapB(" + key + ", " + keynext + "), ";

                    }
                    else {
                        oneLineString += "swap(" + key + ", " + keynext + "), ";

                    }
                    n++;
                }
            }
        }
       return [oneLineString.substring(0,oneLineString.length-2),guard];

    }
}

export default AssignParser;

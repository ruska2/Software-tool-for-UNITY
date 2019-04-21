import ErrorHandler from "./ErrorHandler";
import CommonFunctions from "./CommonFunctions";

class InitParser{

    constructor(init, declaredVariables) {
        this.init = init;
        this.declaredVariables = declaredVariables;
        this.errorHandler = new ErrorHandler();
        this.commonFunctions = new CommonFunctions();
        this.box = '\u25A1';
    }

    parseInit = () => {
        let initalizedVars = this.declaredVariables;
        for (let i = 0; i < this.init.length; i++) {
            let line = this.init[i];
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
                let endLine = this.commonFunctions.getStringBetween(parsedLine, ":", "::");
                endLine = endLine.split(iteratorVariable)[1];
                let endNumber = this.commonFunctions.getEndNumberOfIterator(endLine);
                let expression = parsedLine.split("::")[1];
                let quantifiedParts = [];
                for (let i = startNumber; i <= endNumber; i++){
                    //alert(this.replaceAll(splitedif[0],variable, i));
                    let oneIter = this.commonFunctions.replaceAll(expression,iteratorVariable, i + "");
                    //let secondpart  = this.replaceAll(splitedif[1],variable, i + "");
                    quantifiedParts.push(oneIter);
                }
                if(paralel){
                    quantifiedParts = this.commonFunctions.shuffle(quantifiedParts);
                }
                for (let x = 0; x < quantifiedParts.length; x++){
                    let res = this.parseOneInitLine(quantifiedParts[x],initalizedVars);
                    if (!res) return;
                }

            }
            else if (line.includes("||")){
                //Random order when || operator used
                let initials = this.commonFunctions.shuffle(line.split("||"));
                for (let l = 0; l < initials.length; l++){
                    let res = this.parseOneInitLine(initials[l],initalizedVars);
                    if (!res) return;
                }
            }
            else{
                let res = this.parseOneInitLine(line, initalizedVars);
                if (!res) return;
            }

        }

        console.log("initialized:");
        console.log(initalizedVars);
        return true;
    };


    parseOneInitLine(line, initalizedVars){
        let splitedLine = line.split("=");
        if (!this.errorHandler.checkInitialyEqualsLength(splitedLine.length)){
            return false;
        }
        let variables = splitedLine[0].split(",");
        let values = splitedLine[1].split(",");

        if (!this.errorHandler.checkInitNumberInRow(variables,values)){
            return false;
        }
        for (let n = 0; n < variables.length; n++) {
            let key = variables[n];
            let value = values[n];
            let actualValue = this.declaredVariables[key];
            if (key.includes("[") && key.includes("]")){
                let startIndex = key.indexOf("[");
                let endIndex = key.indexOf("]");
                let variable = key.substring(0, startIndex);
                let indexInList = key.substring(startIndex+ 1, endIndex);
                /*let remainingString = key.substring(endIndex,key.length);
                if (remainingString.startsWith("[") && remainingString.endsWith("]")){
                    indexInList2 = this.getStringBetween(remainingString, "[", "]");
                }*/
                if (!this.errorHandler.checkIfArrayInVariables(variable,this.declaredVariables)){
                    return false;
                }
                let valueType = this.commonFunctions.getExpressionValues(variable, this.declaredVariables);
                if (!this.errorHandler.checkTypesEq(valueType, initalizedVars[variable][0])){
                    return false;
                }
                if (!this.errorHandler.checkArraySize(indexInList,variable, initalizedVars)){
                    return false;
                }
                if ((value = this.commonFunctions.getVariableValue(value,initalizedVars)) !== undefined){
                    initalizedVars[variable][1][indexInList] = value;
                }
                else{
                    this.errorHandler.callVariablePresenceError();
                    return false;
                }
            }else{
                let valueType = this.commonFunctions.getExpressionValues(value, this.declaredVariables);
                if(actualValue !== undefined){
                    if (!this.errorHandler.checkTypesEq(valueType,actualValue[0])){
                        return false;
                    }
                    initalizedVars[key] = [valueType,value];
                }
                else {
                    if (value === "true" || value === "false") {
                        initalizedVars[key] = ["bool", value];
                    } else if (!isNaN(Number(value))) {
                        initalizedVars[key] = ["int", value];
                    }
                    else{
                        let vl = this.commonFunctions.getVariableValue(value,initalizedVars);
                        if (vl === undefined){
                            return this.errorHandler.wrongValueDefinition(key);
                        }
                        initalizedVars[key] = [valueType, vl];
                    }
                }
            }
        }

        return true;
    }
}

export default InitParser;

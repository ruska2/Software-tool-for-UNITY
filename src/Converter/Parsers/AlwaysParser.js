import ErrorHandler from "./ErrorHandler";

class AlwaysParser{

    constructor(always, initalizedVariables) {
        this.always = always;
        this.errorHandler = new ErrorHandler();
        this.initializedVariables = initalizedVariables;
        this.alwaysSectionLines = [];
    }

    parseAlways = () => {
        for (let i = 0; i < this.always.length; i++) {
            let line = this.always[i];
            let res = this.parseOneInitLine(line);
            if (!res) return false;

        }
        console.log("always:");
        console.log(this.initializedVariables);
        console.log(this.alwaysSectionLines);
        return true;
    };

    parseOneInitLine(line){
        let splitOnIf = line.split("if");
        line = splitOnIf[0];
        let guard = splitOnIf.length === 2 ? splitOnIf[1] : "";
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
            let valueType = this.getExpressionValues(value, this.initializedVariables);
            let actualValue = this.initializedVariables[key];
                if(actualValue !== undefined){
                    if (!this.errorHandler.checkTypesEq(valueType,actualValue[0])){
                        return false;
                    }
                }
                else {
                    if (value === "true" || value === "false") {
                        this.initializedVariables[key] = ["bool", value];
                    } else if (!isNaN(Number(value))) {
                        this.initializedVariables[key] = ["int", value];
                    }
                    else{
                        this.initializedVariables[key] = [valueType, valueType === "int" ? 0 : "false"];
                    }
                    this.alwaysSectionLines.push(key +" = " + value);
                }
                if (guard !== ""){
                    this.alwaysSectionLines.push("if (" + guard +"){\n\t\t" + key +" = " + value + ";\n\t}");
                }
                else{
                    this.alwaysSectionLines.push(key +" = " + value);
                }

        }

        return true;
    }

    getExpressionValues = (exp,variables) =>{
        let booleanSigns = ["!","&&", "||", "<", "<=", "!=", ">", ">=", "=="];
        let integerSigns = ["+", "-", "*", "/", "%", "^"];

        for (let i = 0; i < booleanSigns.length; i++){
            if (exp.includes(booleanSigns[i])){
                return "bool"
            }
        }
        if(exp === "false" || exp === "true") return "bool";
        for (let i = 0; i < integerSigns.length; i++){
            if (exp.includes(integerSigns[i])){
                return "int"
            }
        }
        return variables[exp] === undefined ? "int" : variables[exp][0];
    };

    isArrayInDeclare = (str) =>{
        if (str.startsWith("array[") && (str.endsWith("]ofboolean") || str.endsWith("]ofinteger"))){
            return true;
        }
        return false;
    };

    isSimpleArray = (str) => {
        return !str.includes(",");
    };

    replaceAll = (string,str1, str2) => {
        let d = string;
        for(let i = 0; i < string.length; i++){
            d = d.replace(str1,str2);
        }
        return d;
    };

    getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    getTrueOrFalse = () =>{
        return this.getRandomInt(0,2);
    };

    getStringBetween = (string, str1, str2) => {
        let part2 = string.split(str1)[1];
        let part1 = part2.split(str2)[0].trim();
        return part1;
    };
}

export default AlwaysParser;

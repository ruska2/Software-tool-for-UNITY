
class CommonFunctions {

    constructor(code) {

    }

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

    getEndNumberOfIterator = (str) =>{
        str = str.split("<");
        str = str[str.length-1];
        if(str.includes("=")){
            str = str.replace("=", "");
            str = Number(str);
        }else {
            str = Number(str) - 1;
        }
        return str;
    };

    getStartNumberOfIterator =(str) =>{
        let start = 0;
        if(str.includes("<=")){
            start = Number(str.split("<=")[0]);
        }else {
            start = Number(str.split("<")[0]);
        }
        return start;
    };

    getIteratorVariable = (str) => {
        let vardown = str.split(":")[0];
        return vardown;
    };

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
            if (exp.includes(booleanSigns[i])){
                return "int"
            }
        }
        return variables[exp] === undefined ? "int" : variables[exp][0];
    };

    getVariableValue (variable,variables){
        let res = variable;
        if (res === "true" || res === "false" || !isNaN(Number(res))) {
            return res;
        }
        if (variables[variable] === undefined) return undefined;
        res = variables[variable][1];
        if (res === "true" || res === "false" || !isNaN(Number(res))){
            return res;
        }else{
            return this.getVariableValue(res,variables);
        }
    }

    shuffle = (a) => {
        let j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

}

export default CommonFunctions;


class ErrorHandler {

    constructor(code) {

    }

    checkWrongDefinitionInDeclareSectionNearColon(varAndType){
        if (varAndType.length !== 2) {
            alert("Syntax Error: Wrong definition of declare section near ':' !");
            return false;
        }
        return true;
    }

    checkDeclareArraySizeNearDots(length){
        if (isNaN(Number(length))) {
            alert("Syntax Error: Wrong definition of arraysize near '..'");
            return false;
        }
        if(Number(length) < 0){
            alert("Syntax Error: Negative arraysize near '..'");
            return false;
        }
        return true;
    }

    checkCorrectArrayType(type){
        if (type !== "integer" && type !== "boolean") {
            alert("Syntax Error: Wrong definition of arrayType near 'of' and " + type);
            return false;
        }
        return true;
    }

    checkCorrectType(type){
        if (type !== "integer" && type !== "boolean") {
            alert("Syntax Error: Wrong definition of Type near ':' and " + type);
            return false;
        }
        return true;
    }

    checkMaxArray(length){
        if (length > 2) {
            alert("Syntax Error: Only 2 arrays are allowed inside themself");
            return false;
        }
        return true;
    }

    checkInitNumberInRow(variables,values){
        if (variables.length !== values.length) {
            alert("Syntax Error: Different number of variables and values near '=' section!");
            return false;
        }
        return true;
    }

    checkTypesEq(type1,type2){
        if (type1 !== type2){
            alert("Syntax Error: Not matching types in initially section!");
            return false;
        }
        return true;
    }

    checkInitialyEqualsLength(length){
        if(length < 2){
            alert("Syntax Error: Near '=' in initially section!");
            return false;
        }
        return true;
    }

    checkIfArrayInVariables(variable, variables){
        if (variables[variable] === undefined){
            alert("SyntaxError: Array " + variable + " not declared!");
            return false;
        }
        return true;
    }

    callVariablePresenceError(){
        alert("SyntaxError: not declared variable used in initally section!");
    }

    checkArraySize(index,variable, variables){
        if (index < 0){
            alert("Syntax Error!\n Index: " + index + " out of bound in array " + variable);
            return false;
        }
        if (index >= variables[variable][1].length){
            alert("Syntax Error!\n Index: " + index + " out of bound in array " + variable);
            return false;
        }
        return true;

    }

    checkInnerArraySize(index, variable, array){
        if (index < 0){
            alert("Syntax Error!\n Index: " + index + " out of bound in array " + variable);
            return false;
        }
        if (index >= array.length){
            alert("Syntax Error!\n Index: " + index + " out of bound in array " + variable);
            return false;
        }
        return true;
    }

    callVariableNotInitializedError(key){
        alert("Syntax Error!\n : Variable" + key + " is not initialized ");
        return false;
    }

    callDifferentTypes(key1,key2){
        alert("Syntax Error!\n : Variable" + key1 + " and "+ key2 +" are different types");
        return false;
    }
}

export default ErrorHandler;

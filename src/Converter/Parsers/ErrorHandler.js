
class ErrorHandler {

    constructor(code) {

    }

    checkWrongDefinitionInDeclareSectionNearColon(varAndType){
        if (varAndType.length !== 2) {
            localStorage.setItem("errorMsg", "Syntax Error : Wrong definition of declare section near ':' !");
            return false;
        }
        return true;
    }

    checkDeclareArraySizeNearDots(length){
        if (isNaN(Number(length))) {
            localStorage.setItem("errorMsg", "Syntax Error : Wrong definition of array size near '..' !");
            return false;
        }
        if(Number(length) < 0){
            localStorage.setItem("errorMsg", "Syntax Error : Wrong definition of array size near '..' !");
            return false;
        }
        return true;
    }

    checkCorrectArrayType(type){
        if (type !== "integer" && type !== "boolean") {
            localStorage.setItem("errorMsg", "Syntax Error : Wrong definition of array type near 'of' and " + type);
            return false;
        }
        return true;
    }

    checkCorrectType(type){
        if (type !== "integer" && type !== "boolean") {
            localStorage.setItem("errorMsg", "Syntax Error : Wrong definition of Type near ':' and " + type);
            return false;
        }
        return true;
    }

    checkMaxArray(length){
        if (length > 1) {
            localStorage.setItem("errorMsg", "Syntax Error : Only simple arrays are allowed !");
            return false;
        }
        return true;
    }

    checkInitNumberInRow(variables,values){
        if (variables.length !== values.length) {
            localStorage.setItem("errorMsg", "Syntax Error : Different number of variables and values near '=' section!");
            return false;
        }
        return true;
    }

    checkTypesEq(type1,type2){
        if (type1 !== type2){
            localStorage.setItem("errorMsg", "Syntax Error : Not matching types in initially section!");
            return false;
        }
        return true;
    }

    checkInitialyEqualsLength(length){
        if(length < 2){
            localStorage.setItem("errorMsg", "Syntax Error : Near '=' in initially section!");
            return false;
        }
        return true;
    }

    checkIfArrayInVariables(variable, variables){
        if (variables[variable] === undefined){
            localStorage.setItem("errorMsg", "Syntax Error : Array " + variable + " not declared!");
            return false;
        }
        return true;
    }

    callVariablePresenceError(){
        localStorage.setItem("errorMsg", "Syntax Error : not declared variable used in initally section!");
        return false;
    }

    checkArraySize(index,variable, variables){
        if (index < 0){
            localStorage.setItem("errorMsg", "Syntax Error : Index: " + index + " out of bound in array " + variable);
            return false;
        }
        if (index >= variables[variable][1].length){
            localStorage.setItem("errorMsg", "Syntax Error : Index: " + index + " out of bound in array " + variable);
            return false;
        }
        return true;

    }

    checkInnerArraySize(index, variable, array){
        if (index < 0){
            localStorage.setItem("errorMsg", "Syntax Error : Index: " + index + " out of bound in array " + variable);
            return false;
        }
        if (index >= array.length){
            localStorage.setItem("errorMsg", "Syntax Error : Index: " + index + " out of bound in array " + variable);
            return false;
        }
        return true;
    }

    callVariableNotInitializedError(key){
        localStorage.setItem("errorMsg", "Syntax Error : Variable" + key + " is not initialized ");
        return false;
    }

    callDifferentTypes(key1,key2){
        localStorage.setItem("errorMsg", "Syntax Error : Variable" + key1 + " and "+ key2 +" are different types");
        return false;
    }

    wrongValueDefinition(variable){
        localStorage.setItem("errorMsg", "Syntax Error : Wrog definition of value near: " + variable + " !");
        return false;
    }
}

export default ErrorHandler;

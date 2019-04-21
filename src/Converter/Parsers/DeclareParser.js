import ErrorHandler from "./ErrorHandler";
import CommonFunctions from "./CommonFunctions";

class DeclareParser{

    constructor(declare) {
        this.declare = declare;
        this.declaredVaribles = {};
        this.errorHandler = new ErrorHandler();
        this.commonFunctions = new CommonFunctions();
    }

    parseDeclare = () => {
        let declaredVariables = {};
        for (let i = 0; i < this.declare.length; i++) {
            let variablesAndType = this.declare[i].split(":");
            if (!this.errorHandler.checkWrongDefinitionInDeclareSectionNearColon(variablesAndType)){
                return false;
            }
            let variables = variablesAndType[0];
            let type = variablesAndType[1];

            let splitedVariables = variables.split(",");
            for (let n = 0; n < splitedVariables.length; n++) {
                let key = splitedVariables[n];
                if (type === "integer") {
                    declaredVariables[key] = ["int", this.commonFunctions.getRandomInt(0,101) + ""];
                }
                else if (type === "boolean") {
                    declaredVariables[key] = ["bool","false"];
                    if (this.commonFunctions.getTrueOrFalse() === 1) {
                        declaredVariables[key] = ["bool","true"];
                    }
                }
                else if (this.isArrayInDeclare(type)) {
                    let sizeAndArrayType = type.split( "of");
                    let size = sizeAndArrayType[0];
                    let arrayType = sizeAndArrayType[1];
                    let sizeString = this.commonFunctions.getStringBetween(size,"[", "]");
                    if (!this.isSimpleArray(sizeString)){
                        let splitedSize = size.split(",");
                        if (!this.errorHandler.checkMaxArray(splitedSize.length)){
                            return false;
                        }
                        let size1 = splitedSize[0] + "]";
                        let size2 = "[" + splitedSize[1];
                        let start1 = Number(this.commonFunctions.getStringBetween(size1,"[",".."));
                        let end1 = Number(this.commonFunctions.getStringBetween(size1,"..","]"));
                        let start2 = Number(this.commonFunctions.getStringBetween(size2,"[",".."));
                        let end2 = Number(this.commonFunctions.getStringBetween(size2,"..","]"));
                        let length1 = end1 - start1;
                        let length2 = end2 - start2;
                        if (!this.errorHandler.checkDeclareArraySizeNearDots(length1)){
                            return false;
                        }
                        if (!this.errorHandler.checkDeclareArraySizeNearDots(length2)){
                            return false;
                        }
                        if (!this.errorHandler.checkCorrectArrayType(arrayType)){
                            return false;
                        }

                        let v = [];
                        for (let x = 0; x < length1; x++) {
                            let w = [];
                            for (let y = 0; y < length2; y++){
                                if(arrayType === "integer") {
                                    w.push(this.commonFunctions.getRandomInt(0,101) + "");
                                }
                                else{
                                    w.push(this.commonFunctions.getTrueOrFalse() === 0 ? "false" : "true");
                                }
                            }
                            v.push(w);

                        }
                        if (arrayType === "integer"){
                            declaredVariables[key] = ["int",v];
                        }
                        else{
                            declaredVariables[key] = ["bool",v];
                        }
                    }else if (this.isSimpleArray(sizeString)){
                        let start = Number(this.commonFunctions.getStringBetween(size,"[",".."));
                        let end = Number(this.commonFunctions.getStringBetween(size,"..","]"));
                        let length = end - start;
                        if (!this.errorHandler.checkDeclareArraySizeNearDots(length)){
                            return false;
                        }
                        if (!this.errorHandler.checkCorrectArrayType(arrayType)){
                            return false;
                        }
                        let v = [];
                        for (let x = 0; x < length; x++) {
                            if(arrayType === "integer") {
                                v.push(this.commonFunctions.getRandomInt(0,101) + "");
                            }
                            else{
                                v.push(this.commonFunctions.getTrueOrFalse() === 0 ? "false" : "true");
                            }
                        }
                        if (arrayType === "integer"){
                            declaredVariables[key] = ["int", v];
                        }
                        else{
                            declaredVariables[key] = ["bool", v];
                        }
                    }

                }
                else if (!this.errorHandler.checkCorrectType(type)){
                    return false;
                }
            }
        }
        console.log("declaredVariables");
        console.log(declaredVariables);
        this.declaredVaribles = declaredVariables;
        return true;
    };

    isArrayInDeclare = (str) =>{
        return str.startsWith("array[") && (str.endsWith("]ofboolean") || str.endsWith("]ofinteger"));
    };

    isSimpleArray = (str) => {
        return !str.includes(",");
    };


}

export default DeclareParser;

import CommonFunctions from "../Parsers/CommonFunctions";

class QueryParser {

    constructor(code) {
        this.code = code;
        this.commonFunctions = new CommonFunctions();
    }

    parse = () => {
        let str = "";
        this.code = this.commonFunctions.replaceAll(this.code, "==", "=");
        this.code = this.commonFunctions.replaceAll(this.code, "=", "#");
        this.code = this.commonFunctions.replaceAll(this.code, "#", "==");
        let splitedlines = this.code.split("\n");
        for (let i = 0; i < splitedlines.length; i++){
            str += splitedlines[i] + "\n"
        }
        return str;
    }
}

export default QueryParser;

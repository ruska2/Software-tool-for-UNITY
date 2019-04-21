import QueryParser from "./QueryParser";

class QueryConverter {

    constructor(code) {
        this.code = code;
    }


    convertToString= () => {
        let toWriteStr = "";
        const queryParser = new QueryParser(this.code);
        let d = queryParser.parse();
        if (!d) {
            return localStorage.getItem("errorMsg");
        }
        toWriteStr += d;
        return toWriteStr;

    }
}

export default QueryConverter;

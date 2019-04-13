import UTYstrToXTAlist from "../UTYstrToXTAlist";
import DeclareParser from "./DeclareParser";
import InitParser from "./InitParser";
import AlwaysParser from "./AlwaysParser";
import AssignParser from "./AssignParser";


class UTYtoXTAParser  {

    constructor(code) {
        this.box = '\u25A1';
        this.code = code;
        this.name = "";
        this.initializedVariables= [];
        this.alwaysSection = [];
        this.sequentialAssignments = [];
        this.paralellAssignments = [];
    }

    getBox() {
        return this.box;
    }


    parse = () => {
        const stringToList = new UTYstrToXTAlist();
        if(stringToList === undefined) return false;
        stringToList.getListFromString(this.code);


        const declareParser = new DeclareParser(stringToList.getDeclare());
        let declaredVariables = declareParser.parseDeclare();
        if(!declaredVariables) return false;

        const initParser = new InitParser(stringToList.getInitially(), declareParser.declaredVaribles);
        let initializedVariables = initParser.parseInit();

        if(!initializedVariables) return false;

        const alwaysParser = new AlwaysParser(stringToList.getAlways(), initParser.declaredVariables);
        let alwaysVariables = alwaysParser.parseAlways();
        if(!alwaysVariables) return false;

        this.initializedVariables = alwaysParser.initializedVariables;
        this.alwaysSection = alwaysParser.alwaysSectionLines;

        const assignParser = new AssignParser(stringToList.getAssign(), this.initializedVariables);
        let assignVariables = assignParser.parseAssign();
        if (!assignVariables) return false;
        this.sequentialAssignments = assignParser.sequentialAssignments;
        this.paralellAssignments = assignParser.paralellAssignments;
        return true;
    };
}

export default UTYtoXTAParser;
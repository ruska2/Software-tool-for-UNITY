
class UTYstrToXTAlist{

    constructor(){
        this.name = "";
        this.declare = [];
        this.always = [];
        this.initially = [];
        this.assign = [];
    }

    getName = () =>{
        return this.name;
    };

    getDeclare = () =>{
        return this.declare;
    };

    getInitially = () =>{
        return this.initially;
    };

    getAlways = () =>{
      return this.always;
    };

    getAssign = () =>{
        return this.assign;
    };

    strToListDeclare = (trimedlines) => {
        let index = 0;
        let declare = [];

        while(trimedlines[index] !== "declare"  && index < trimedlines.length){
            index++;
        }
        index++;
        while (trimedlines[index] !== "always" && trimedlines[index] !== "initially" && trimedlines[index] !== "assign" && index < trimedlines.length) {
            declare.push(trimedlines[index]);
            index++;
        }
        this.declare = declare;
    };

    strToListInit = (trimedlines) => {
        let index = 0;
        let init = [];
        while(trimedlines[index] !== "initially"  && index < trimedlines.length){
            index++;
        }
        index++;
        while (trimedlines[index] !== "always" && trimedlines[index] !== "declare" && trimedlines[index] !== "assign" && index < trimedlines.length) {
            init.push(trimedlines[index]);
            index++;
        }
        this.initially = init;
    };

    strToListAlways = (trimedlines) => {
        let index = 0;
        let always = [];
        while(trimedlines[index] !== "always" && index < trimedlines.length){
            index++;
        }
        index++;
        while (trimedlines[index] !== "initially" && trimedlines[index] !== "declare" && trimedlines[index] !== "assign" && index < trimedlines.length) {
            always.push(trimedlines[index]);
            index++;
        }
        this.always = always;
    };

    strToListAssign = (trimedlines) => {
        let index = 0;
        let assign = [];
        while(trimedlines[index] !== "assign" && index < trimedlines.length){
            index++;
        }
        index++;
        while (trimedlines[index] !== "always" && trimedlines[index] !== "declare" && trimedlines[index] !== "initially" && index < trimedlines.length) {
            assign.push(trimedlines[index]);
            index++;
        }
        this.assign = assign;
    };

    getListFromString = (code) =>{
        let splitedlines = code.split("\n");

        if (splitedlines.length < 4) {
            localStorage.setItem("errorMsg", "Syntax Error!");
            return;
        }

        let trimedlines = [];

        for (let i = 0; i < splitedlines.length; i++) {
            if (splitedlines[i].trim() !== "") {
                trimedlines.push(this.removeAllSpaces(splitedlines[i].trim()));
            }
        }

        this.name = trimedlines[0];
        trimedlines.splice(0,1);
        trimedlines.splice(trimedlines.length-1,1);


        this.strToListDeclare(trimedlines);
        this.strToListInit(trimedlines);
        this.strToListAlways(trimedlines);
        this.strToListAssign(trimedlines);

        console.log("getLinesFromEditor:");
        console.log(this);
        return true;
    };

    removeAllSpaces = (str) =>{
        return str.replace(/\s/g, "");
    }



}

export default UTYstrToXTAlist;

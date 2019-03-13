import UTYstrToXTAlist from "./UTYstrToXTAlist";


class UTYtoXTAParser  {

    constructor(code) {
        this.box = '\u25A1';
        this.code = code;
        this.name = "";
        this.declare = [];
        this.init = [];
        this.always = [];
        this.assign = [];
        this.sequential = [];
        this.quantified = [];
        this.variables = [];
        this.quantifiedparalell = [];
    }

    getBox() {
        return this.box;
    }

    getSequential = () =>{
        return this.sequential;
    };

    getQuantified = () =>{
        return this.quantified;
    };


    getQuantifiedParalell = () =>{
        return this.quantifiedparalell;
    };

    getVariables = () =>{
        return this.variables;
    };

    getAlways = () =>{
        return this.always;
    };

    parse = () => {
        const stringToList = new UTYstrToXTAlist();
        if(stringToList === undefined) return;
        stringToList.getListFromString(this.code);

        this.name = stringToList.getName();
        this.declare = stringToList.getDeclare();
        this.init = stringToList.getInitially();
        this.always = stringToList.getAlways();
        this.assign = stringToList.getAssign();

        //console.log("declare", this.state.declare);
        //console.log("init", this.state.init);
        //console.log("always", this.state.always);
        //console.log("assign", this.state.assign);

        //return;

        let variables = this.parseDeclare();
        variables = this.parseInit(variables);
        if (variables === undefined) return;
        let assignments = this.parseAssign(variables);
        let linear = assignments[0];
        let cycles = assignments[1];
        let paralell = assignments[2];

        if (assignments === undefined && cycles === undefined) return;
        if(cycles === undefined) cycles = [];
        if(linear === undefined) linear = [];
        this.sequential = linear;
        this.quantified = cycles;
        this.variables = variables;
        this.quantifiedparalell = paralell;
    };

    parseDeclare = () => {
        let variables = {};
        for (let i = 0; i < this.declare.length; i++) {
            let splitedline = this.declare[i].split(" : ");
            if (splitedline.length !== 2) {
                alert("Syntax Error!");
                return;
            }
            let splitedvars = splitedline[0].split(",");
            for (let n = 0; n < splitedvars.length; n++) {
                if (splitedline[1].trim().includes("[") && splitedline[1].trim().includes("]") && splitedline[1].includes("of")) {
                    let arrayline = splitedline[1].trim().split("of");
                    let start = Number(this.getStringBetween(arrayline[0],"[",".."));
                    let end = Number(this.getStringBetween(arrayline[0],"..","]"));
                    let length = end - start;
                    if (isNaN(Number(length))) {
                        alert("Syntax Error!");
                        return;
                    }
                    let value = "";
                    if (arrayline[1].trim() === "integer") {
                        value = "0";
                    }
                    else if (arrayline[1].trim() === "boolean") {
                        value = "false";
                    } else {
                        alert("Syntax Error!");
                        return;
                    }
                    let key = splitedvars[n].trim();
                    let v = [];
                    for (let x = 0; x < length; x++) {
                        if(value === "false" || value === "true") {
                            let min = Math.ceil(0);
                            let max = Math.floor(2);
                            let n = Math.floor(Math.random() * (max - min + 1)) + min;
                            if (n === 0) {
                                value = "true";
                            }
                        }
                        else{
                            let min = Math.ceil(0);
                            let max = Math.floor(100);
                            let n = Math.floor(Math.random() * (max - min + 1)) + min;
                            value = n + "";
                        }
                        v.push(value);
                    }
                    variables[key] = v;
                }
                else if (splitedline[1].includes("integer")) {
                    let key = splitedvars[n].trim();
                    variables[key] = "0";
                }
                else if (splitedline[1].includes("boolean")) {
                    let key = splitedvars[n].trim();
                    variables[key] = "false";
                }
                else {
                    alert("Syntax Error!");
                    return;
                }
            }
        }
        //console.log(variables);
        return variables;
    };

    replaceAll = (string,str1, str2) => {
        let d = string;
        for(let i = 0; i < string.length; i++){
            d = d.replace(str1,str2);
        }
        return d;
    };


    parseInit = (variables) => {
        let initalizedvars = [];
        for (let i = 0; i < this.init.length; i++) {
            let splitedinitline = this.init[i].split("=");
            let splitedfirstinitline = splitedinitline[0].split(",");
            let splitedsecondinitline = splitedinitline[1].split(",");
            if (splitedfirstinitline.length !== splitedsecondinitline.length) {
                alert("Syntax Error!");
                return;
            }
            for (let n = 0; n < splitedfirstinitline.length; n++) {
                let key = splitedfirstinitline[n].trim();
                let newValue = splitedsecondinitline[n].trim();
                let actualvalue = variables[key];
                //alert(key + " " + actualvalue + " " + newValue);
                if (!(key in variables) && !key.includes("[") && !key.includes("]")) {
                    variables[key] = newValue;
                    initalizedvars.push([key]);
                    continue;
                }
                if ((variables[key] === "false" || variables[key] === "true") && !isNaN(Number(newValue))) {
                    alert("Syntax Error!");
                    return;
                }
                console.log(variables);
                if (key.includes("[") && key.includes("]")) {
                    let startindex = key.indexOf("[");
                    let endindex = key.indexOf("]");
                    let keyto = key.substring(0, startindex);
                    let index = key.substring(startindex + 1, endindex);
                    if (!keyto in variables || Number(index) >= variables[keyto].length) {
                        alert("Syntax Error!\n Index: " + index + " out of bound in array " + keyto);
                        return;
                    }
                    if (!isNaN(Number(variables[keyto][0])) && isNaN(Number(newValue))) {
                        alert("Syntax Error!");
                        return;
                    }
                    if ((variables[keyto][0] === "false" || variables[keyto][0] === "true") && !isNaN(Number(newValue))) {
                        alert("Syntax Error!");
                        return;
                    }
                    initalizedvars.push([keyto,index]);
                    variables[keyto][index] = newValue;
                }
                else if ( !isNaN(Number(actualvalue)) && !isNaN(Number(newValue))) {
                    variables[key] = newValue;
                    initalizedvars.push([key]);
                }
                else if (isNaN(Number(actualvalue))) {
                    variables[key] = newValue;
                    initalizedvars.push([key]);
                }
                else {
                    alert("Syntax Error!");
                    return;
                }
            }
        }

        Object.keys(variables).forEach(function (key) {
            let checker = false;
            let index = 0;
            for(let i = 0; i < initalizedvars.length; i++){
                if(initalizedvars[i].length === 1){
                    if(initalizedvars[i].includes(key)){
                        checker = true;
                    }
                }
                if(initalizedvars[i].length === 2){
                    if(initalizedvars[i][0].includes(key)){
                        checker = true;
                        index = i;
                    }
                }
            }
            if(!checker){
                if(variables[key] === "false"){
                    let min = Math.ceil(0);
                    let max = Math.floor(1);
                    let n = Math.floor(Math.random() * (max - min + 1)) + min;
                    if(n === 0){
                        variables[key] = "true";
                    }
                }
                else if(variables[key] === "0"){
                    let min = Math.ceil(0);
                    let max = Math.floor(100);
                    let n = Math.floor(Math.random() * (max - min + 1)) + min;
                    variables[key] = n + "";
                }
            }
        });
        console.log(initalizedvars);
        console.log(variables);
        return variables;
    };

    parseAssign = (variables) => {
        let assigments = [];
        let cycles = [];
        let paralellcycles = [];
        console.log(this.assign);
        for (let i = 0; i < this.assign.length; i++) {
            if (this.assign[i].startsWith(this.getBox())) {
                let index = this.assign[i].indexOf(this.getBox());
                this.assign[i] = this.assign[i].substring(index + 1, this.assign[i].length).trim();
            }
        }

        for (let i = 0; i < this.assign.length; i++) {
            let line = this.assign[i].trim();
            if (line === "end") continue;
            if (line.startsWith("<")) {
                //CYCLE
                    //SEQUENCE
                    let paralell = false;
                    let variable = this.getStringBetween(line, "<", ":");

                    if(variable.startsWith(this.getBox()) || variable.startsWith("||")){
                        if(!variable.startsWith(this.getBox())){
                            paralell = true;
                        }
                        variable = variable.substring(1,variable.length).trim();
                        if(variable.startsWith("|")){
                            variable = variable.substring(1,variable.length).trim();
                        }
                    }
                    let count = this.getStringBetween(line,":", "::");
                    let start = 0;
                    if(count.includes("<=")){
                        start = Number(count.split("<=")[0].trim());
                    }else {
                        start = Number(count.split("<")[0].trim()) + 1;
                    }

                    count = count.split("<");
                    count = count[count.length-1].trim();
                    if(count.includes("=")){
                        count = count.replace("=", "").trim();
                        count = Number(count);
                    }else {
                        count = Number(count) - 1;
                    }
                    let res = [];
                    let vardown = line.split("::")[1];
                    vardown = vardown.substring(0,vardown.length-1);
                    let splitedif = vardown.split("if");
                    for(let i = start; i <= count; i++){
                        //alert(this.replaceAll(splitedif[0],variable, i));
                        let firstpart = this.replaceAll(splitedif[0],variable, i + "");
                        let secondpart  = this.replaceAll(splitedif[1],variable, i + "");
                        res.push(firstpart + " if " + secondpart);
                    }
                    if(paralell){
                        paralellcycles.push(res);
                    }else{
                        cycles.push(res);
                    }

                }

            else {
                let splitonif = line.split("if");
                let guard = "";
                if (splitonif.length === 2) {
                    guard = splitonif[1].trim();
                }
                line = splitonif[0].trim();

                let splitedline = line.split(":=");
                if (splitedline.length < 2) {
                    alert("Syntax Error!");
                    return;
                }
                let vars = splitedline[0].split(",");
                let asigns = splitedline[1].split(",");
                if (vars.length !== asigns.length) {
                    alert("Syntax Error! WRONG INDEX");
                    return;
                }
                if(vars.length === 1){
                    assigments.push([vars[0].trim(), asigns[0].trim(), guard])
                }else{
                    let res = [];
                    for (let n = 0; n < vars.length; n++) {
                        if (!(vars[n].trim() in variables)) {
                            alert("Syntax Error!");
                            return;
                        }
                        res.push(vars[n] + " := " + asigns[n].trim() + " if " + guard);
                    }
                    paralellcycles.push(res);
                }


            }
        }
        console.log("cycles", cycles);
        return [assigments, cycles, paralellcycles];
    };

    getStringBetween = (string, str1, str2) => {
        let part2 = string.split(str1)[1];
        let part1 = part2.split(str2)[0].trim();
        return part1;
    };

}

export default UTYtoXTAParser;
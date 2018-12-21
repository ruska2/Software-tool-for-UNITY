import React, { Component } from 'react';
import AceEditor from 'react-ace';

import './UNITYEditorStyle.css';

import 'brace/mode/python';
import 'brace/mode/haskell'
import 'brace/theme/twilight';
import 'brace/theme/chrome';
import 'brace/theme/github';
import 'brace/theme/monokai';
import 'brace/theme/eclipse';

import TImage from './close.png';
import CodeHandler from "./CodeHandler";


class UNITYEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            code: "",
            name: "",
            declare: [],
            init: [],
            always: [],
            assign: [],
            all: [],
            theme: 'twilight',
            enter: false,
            files: [],
            counter: 1,
            actual: 0,
            ent: false,
            popty: false,
            utyname: '',
            lastenter: false

        };
        this.codeHandler = new CodeHandler();
        this.aceRef = React.createRef();
        this.handleChange = this.handleChange.bind(this);
    }

    static staticProperty = {
        variable: '',
        box: '\u25A1'
    };

    getBox() {
        return UNITYEditor.staticProperty.box;
    }

    handleChange(event) {
        this.setState({theme: event.target.value});
    }

    onEnterNew = () => {
        this.setState({enter: true});
    };

    onLeaveNew = () => {
        this.setState({enter: false});
    };

    clickNew = () => {
        this.openPopup();
        //console.log(this.state.files,this.state.counter);
    };

    onDeleteEneter = () => {
        this.setState({ent: true});
    };

    onDeleteLeave = () => {
        this.setState({ent: false});
    };


    onFileClick = (event) => {
        //console.log(this.state.files, this.state.code)
        let parent = event.target.textContent.trim();
        for (let i = 0; i < this.state.files.length; i++) {
            if (parent === this.state.files[i][0]) {
                parent = i;
                break;
            }
        }

        if (this.state.files[parent] == undefined) return;
        this.state.actual = parent;
        this.setState({code: this.state.files[parent][1]});
    };

    newFile = () => {
        this.state.utyname = this.checkName(this.state.utyname);
        this.state.files.push([this.state.utyname, ""]);
        this.state.actual = this.state.files.length - 1;
        this.state.code = "";
        this.setState({popty: false});
    };

    checkName = (name) => {
        if (name.endsWith(".uty")) {
            name = name.substring(0, name.length - 4);
        }
        let c = 0;
        for (let i = 0; i < this.state.files.length; i++) {
            let h = this.state.files[i][0].substring(0, this.state.files[i][0].length - 4);
            if (h === name) {
                c++;
            }
            if (h.includes("(") && h.includes(")") && h.includes(name)) {
                c++;
            }
        }
        if (c === 0) return name + ".uty";
        return name + "(" + c + ").uty";
    };


    removeFile = (event) => {
        let parent = event.target.parentNode.textContent.trim();
        for (let i = 0; i < this.state.files.length; i++) {
            if (parent === this.state.files[i][0]) {

                this.state.files.splice(i, 1);
                this.state.actual = this.state.files.length - 1;
                if(this.state.files.length > 0){
                    this.state.code = this.state.files[this.state.files.length - 1][1];
                }
                this.setState({files: this.state.files});
                return;
            }
            console.log(this.state.files[i][0]);
        }
        this.state.actual = this.state.files.length - 1;
        if(this.state.files.length > 0){
            this.state.code = this.state.files[this.state.files.length - 1][1];
        }
        this.setState({files: this.state.files});

        console.log(parent);
    };


    writeFiles = () => {
        let f = [];
        for (let i = 0; i < this.state.files.length; i++) {
            if (this.state.actual === i) {
                f.push(<div id="activeline" style={{color: 'white', background: 'grey'}}
                            onClick={this.onFileClick}> {this.state.files[i][0]} <img
                    className={this.state.ent ? "msge" : "msg"} onMouseEnter={this.onDeleteEneter}
                    onMouseLeave={this.onDeleteLeave}
                    onClick={this.removeFile} src={TImage}></img></div>);
                continue;
            }
            f.push(<div id="line" onClick={this.onFileClick}> {this.state.files[i][0]} <img
                className={this.state.ent ? "msge" : "msg"} onMouseEnter={this.onDeleteEneter}
                onMouseLeave={this.onDeleteLeave}
                onClick={this.removeFile} src={TImage}></img></div>);
        }
        return f;
    };

    downloadUTY = () => {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.state.code));
        if(this.state.files.length <= 0){
            alert("You have to make file first!");
            return;
        }
        element.setAttribute('download', this.state.files[this.state.actual][0]);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    };

    unityPopUp = () => {
        let d = [];
        d.push(
            <div className='popup'>
                <div className='popup_inner'>
                    <label>File name:</label><input onChange={this.nameChange} type={"text"}/>
                    <button onClick={this.closePopup}>Close me</button>
                    <button onClick={this.newFile}>Okay</button>
                </div>
            </div>
        );
        return d;
    };

    nameChange = (event) => {
        this.setState({utyname: event.target.value});
    };

    closePopup = () => {
        this.setState({popty: false});
    };

    openPopup = () => {
        this.setState({popty: true});
    };


    render() {
        let d = this.writeFiles();
        let pty = this.unityPopUp();
        return (
            <div>
                <div id="header">
                    <form>
                        <label id="lab">
                            Theme:
                            <select value={this.state.theme} onChange={this.handleChange} id="sel">
                                <option value="twilight">Twilight</option>
                                <option value="chrome">Chrome</option>
                                <option value="github">Github</option>
                                <option value="monokai">Monokai</option>
                                <option value="eclipse">Eclipse</option>
                            </select>
                        </label>
                    </form>
                </div>
                <div id="struct">
                    <div id="plus" onMouseEnter={this.onEnterNew} onClick={this.clickNew} onMouseLeave={this.onLeaveNew}
                         style={this.state.enter ? {background: "#A0A0A0"} : {background: "#808080"}}>
                        <div id="pimg"></div>
                    </div>
                    {d}

                </div>
                <AceEditor id="edit" ref={this.aceRef}
                           theme={this.state.theme}
                           onChange={this.onChange}
                           name="UNIQUE_ID_OF_DIV"
                           editorProps={{$blockScrolling: true}}
                           value={this.state.code}
                           width='850px'

                />
                <input type="button" value="Convert" onClick={this.onConvert}/>
                <input type="file" onChange={this.onUpload}/>
                <input type="button" value="Download .uty" onClick={this.downloadUTY}/>


                {this.state.popty ? <div>{pty}</div> : null}
            </div>

        )
    }


    onUpload = event => {
        let x = event.target.files[0];
        //console.log(x);
        let reader = new FileReader();
        let res = "";
        let name = x.name;

        if (!name.endsWith(".uty")) {
            alert("Wrong file extension! ('.uty' - expected)");
            return;
        }

        name = this.checkName(name);

        reader.onload = function (progressEvent) {
            // Entire file
            //console.log(this.result);
            // By lines
            let lines = this.result.split('\n');
            for (let line = 0; line < lines.length; line++) {
                res += lines[line] + "\n";
            }
            return res;

        };

        reader.readAsText(x);
        setTimeout(function () {
            this.state.files.push([name, res]);
            this.state.actual = this.state.files.length-1;
            this.state.code = this.state.files[this.state.actual][1];
            this.setState({code: res});
            //console.log(res);


        }.bind(this), 200);


    };

    insert = (str, index, value) => {
        return str.substr(0, index) + value + str.substr(index);
    };

    getStringBetween = (string, str1, str2) =>{
        let part2 = string.split(str1)[1];
        let part1 = part2.split(str2)[0].trim();
        return part1;
    };


    onChange = (newValue) => {
        /*newValue = this.codeHandler.removeCommas(newValue);
        if(newValue[1]){
            let x = this.aceRef.current.editor.getCursorPosition();
            console.log(x.row + 1);
            this.aceRef.current.editor.moveCursorTo(x.row + 1, x.column);
            this.aceRef.current.editor.navigateLineEnd();

        }*/
        //let n = this.codeHandler.removeEmptyLinesAtEnd(newValue[0]);
        this.state.code = newValue;
        if(this.state.files.length > 0){
            this.state.files[this.state.actual][1] = newValue;
        }
        this.forceUpdate();
    };

    getDeclare = (trimedlines) => {
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
        return declare;
    };

    getInit = (trimedlines) => {
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
        return init;
    };

    getAlwaysR = (trimedlines) => {
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
        return always;
    };

    getAssign = (trimedlines) => {
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
        return assign;
    };

    onConvert = () => {

        this.state.assign = [];
        this.state.init = [];
        this.state.declare = [];
        this.state.always = [];

        if(this.state.files.length === 0){
            alert("You have to make a file first!");
            return;
        }

        let splitedlines = this.state.code.split("\n");
        if (splitedlines.length < 2) {
            alert("Syntax Error!");
            return;
        }

        let trimedlines = [];

        for (let i = 0; i < splitedlines.length; i++) {
            if (splitedlines[i].trim() !== "") {
                trimedlines.push(splitedlines[i].trim());
            }
        }

        this.state.name = trimedlines[0];
        trimedlines.splice(0,1);
        trimedlines.splice(trimedlines.length-1,1);


        let declare = this.getDeclare(trimedlines);
        let init = this.getInit(trimedlines);
        let always = this.getAlwaysR(trimedlines);
        let assign = this.getAssign(trimedlines);

        this.state.init = init;
        this.state.always = always;
        this.state.assign = assign;
        this.state.declare = declare;
        //console.log("declare", this.state.declare);
        //console.log("init", this.state.init);
        //console.log("always", this.state.always);
       // console.log("assign", this.state.assign);

        let text = this.parseString();
        if(text === undefined) return;

        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', "test.xta");
        alert(text);
        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    };

    getAlways = (always, variable) => {
        let res = " ";
        for (let i = 0; i < always.length; i++) {
            if (always[i][0] === variable) {
                res += " && " + always[i][1];
            }
        }
        return res;
    };


    parseDeclare = () => {
        let variables = {};
        for (let i = 0; i < this.state.declare.length; i++) {
            let splitedline = this.state.declare[i].split(" : ");
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
        alert(variables);
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

    getRandomBool = () => {
        let d = this.getRandomInt(0,1);
        if(d === 0){
            return "false";
        }
        return "true";
    };

    parseInit = (variables) => {
        let initalizedvars = [];
        for (let i = 0; i < this.state.init.length; i++) {
            let splitedinitline = this.state.init[i].split("=");
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
        console.log(this.state.assign);
        for (let i = 0; i < this.state.assign.length; i++) {
            if (this.state.assign[i].startsWith(this.getBox())) {
                let index = this.state.assign[i].indexOf(this.getBox());
                this.state.assign[i] = this.state.assign[i].substring(index + 1, this.state.assign[i].length).trim();
            }
        }

        for (let i = 0; i < this.state.assign.length; i++) {
            let line = this.state.assign[i].trim();
            if (line === "end") continue;
            if (line.startsWith("<")) {
                //CYCLE
                if(line.includes("<||")){
                    //PARALELL
                }else{
                    //SEQUENCE
                    let variable = this.getStringBetween(line, "<", ":");
                    if(variable.startsWith(this.getBox()) || variable.startsWith("||")){
                        variable = variable.substring(1,variable.length).trim();
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
                    alert("Syntax Error! WRONG INDDEX");
                    return;
                }
                for (let n = 0; n < vars.length; n++) {
                    if (!(vars[n].trim() in variables)) {
                        alert("Syntax Error!");
                        return;
                    }
                    assigments.push([vars[n].trim(), asigns[n].trim(), guard])
                }

            }
        }
        console.log("cycles", cycles);
        return [assigments, cycles];
    };

    parseString = () => {
        let toWriteStr = "";
        let variables = this.parseDeclare();
        variables = this.parseInit(variables);
        if (variables === undefined) return;
        let as = this.parseAssign(variables);
        let assignments = as[0];
        let cycles = as[1];

        console.log(variables);
        console.log(assignments);
        //alert(cycles);
        if (variables === undefined || assignments === undefined || cycles === undefined) return;

        let always = [];
        let keys = [];
        Object.keys(variables).forEach(function (key) {
            keys.push(key);
        });


        let counter = assignments.length;
        if (counter !== 0) {
            toWriteStr += "chan ";
        }

        for (let i = 0; i < counter; i++) {
            if (i + 1 < counter) {
                toWriteStr += "ch" + (i + 1) + ", ";
            }
            else {
                toWriteStr += "ch" + (i + 1) + ";\n";
            }
        }
        console.log(keys);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if ((variables[key].includes("true") || variables[key].includes("false")) && !(variables[key] instanceof Array)) {
                toWriteStr += "bool " + key + " = " + variables[key] + ";\n";
            }
            else if (!isNaN(Number(variables[key]))) {
                toWriteStr += "int " + key + " = " + variables[key] + ";\n";
            } else {
                let arry = variables[key];
                let helperString = "{";
                console.log("arry", arry);
                for (let j = 0; j < arry.length; j++) {
                    if (j + 1 < arry.length) {
                        helperString += arry[j] + ","
                    }
                    else {
                        helperString += arry[j] + "};\n"
                    }
                }
                if ((variables[key][0].includes("true") || variables[key][0].includes("false"))) {
                    toWriteStr += "bool " + key + "[" + variables[key].length + "] := " + helperString;
                }
                else if (!isNaN(Number(variables[key][0]))) {
                    toWriteStr += "int " + key + "[" + variables[key].length + "] := " + helperString;
                }
            }
        }

        let cyclecount = cycles.length;

        for (let i = 0; i < cyclecount; i++) {
            //cyclechanesl
            toWriteStr += "chan ";
            for (let j = 0; j < cycles[i].length; j++) {
                if (j + 1 < cycles[i].length) {
                    toWriteStr += "chCycle" + (i + 1) + (j + 1) + ", ";
                }
                else {
                    toWriteStr += "chCycle" + (i + 1) + (j + 1) + ";\n";
                }
            }

            toWriteStr += "\n";
        }

        toWriteStr += "int intvarhelper = 0;\n";
        toWriteStr += "bool boolvarhelper = false;\n";
        toWriteStr += "\n";

        //HELPER

        toWriteStr += "\nprocess Helper(){\n\n";
        toWriteStr += "state \n\tS0;\n";
        toWriteStr += "init S0;\n";
        toWriteStr += "trans\n";

        for (let i = 0; i < counter; i++) {
            if ((i + 1) === counter) {
                toWriteStr += "\tS0 -> S0 { sync ch" + (i + 1) + "?;},\n"
            } else {
                toWriteStr += "\tS0 -> S0 { sync ch" + (i + 1) + "?;},\n"
            }
        }

        for (let i = 0; i < cyclecount; i++) {
            for (let j = 0; j < cycles[i].length; j++) {
                if (j + 1 < cycles[i].length) {
                    toWriteStr += "\tS0 -> S0 { sync chCycle" + (i + 1) + (j + 1) + "?;},\n"
                }
                else {
                    toWriteStr += "\tS0 -> S0 { sync chCycle" + (i + 1) + (j + 1) + "?;},\n"
                }
            }
            if (i + 1 === cyclecount) {
                toWriteStr = toWriteStr.slice(0, toWriteStr.length - 2) + ";\n";
            }
        }

        toWriteStr += "}\n\n";


        for (let i = 0; i < assignments.length; i++) {
            toWriteStr += "process Line" + (i + 1) + "() {\n\n";
            toWriteStr += "state\n";
            toWriteStr += "\tS0,\n";
            toWriteStr += "\tS1;\n";
            toWriteStr += "init S0;\n";
            toWriteStr += "trans\n";
            let guard = assignments[i][2];
            let first = assignments[i][0] + " := " + assignments[i][1];


            if (guard === "") {
                toWriteStr += "\tS0 -> S1 {  sync ch" + (i + 1) + "!; assign " + first + ";},\n";
                toWriteStr += "\tS1 -> S0 {  sync ch" + (i + 1) + "!; assign " + first + ";};\n";
            } else {
                toWriteStr += "\tS0 -> S1 { guard " + guard + "; sync ch" + (i + 1) + "!; assign " + first + ";},\n";
                toWriteStr += "\tS1 -> S0 { guard " + guard + "; sync ch" + (i + 1) + "!; assign " + first + ";};\n";
            }

            toWriteStr += "}\n\n";
        }


        for (let i = 0; i < cyclecount; i++) {

            for (let j = 0; j < cycles[i].length; j++) {

                toWriteStr += "\n";

                toWriteStr += "process Cycle" + (i + 1) + (j + 1) + "() {\n\n";
                toWriteStr += "state\n";
                toWriteStr += "\tS0,\n";
                toWriteStr += "\tS1;\n";
                toWriteStr += "init S0;\n";
                toWriteStr += "trans\n";


                let line = cycles[i][j].split("if");
                let guard = "";
                console.log(line);
                if (line.length > 1) {
                    guard = line[1].trim();
                }
                let con = line[0].trim();
                con = con.split(":=");
                if(con.length > 1){
                    let left = con[0].split(",");
                    let right = con[1].split(",");
                    //alert(left.length + "  " +right.length);
                    //alert(left + "  " +right);
                    if(left.length !== right.length){
                        alert("SYNTAX ERROR!");
                        return;
                    }
                    if(left.length === 1){
                        con = line[0].trim();
                    }else{
                        con = "";
                        for(let k = 0; k < left.length; k+= 1){
                            let leftv = left[k].trim();
                            let rightv = right[k].trim();
                            //alert(k + " " + left.length);
                            if(k === left.length-1){

                                con += left[k].trim() + " :=" + right[k].trim();
                                continue;
                            }
                            let leftv1 = left[k+1].trim();
                            let rightv1 = right[k+1].trim();
                            if(k+1 < left.length && leftv === rightv1 && leftv1 === rightv){
                                if(k+2 < left.length){
                                    con += "intvarhelper := " + leftv + ",\n";
                                    con += leftv + " := " + rightv + ",\n";
                                    con += rightv + " := intvarhelper,"
                                }else{
                                    con += "intvarhelper := " + leftv + ",\n";
                                    con += leftv + " := " + rightv + ",\n";
                                    con += rightv + " := intvarhelper"
                                }
                                k++;
                            }else{
                                if(k+1 < left.length){
                                    con += left[k].trim() + " :=" + right[k].trim()+",\n";
                                }else{
                                    con += left[k].trim() + " :=" + right[k].trim();
                                }
                            }
                        }
                    }

                }else{
                    con = line[0].trim();
                }
                let sync = "chCycle" + (i + 1) + (j + 1);
                if (guard !== "") {
                    toWriteStr += "\tS1 -> S0  {guard " + guard + ";  sync " + sync + "!; assign " + con + ";},\n";
                    toWriteStr += "\tS0 -> S1  {guard " + guard + ";  sync " + sync + "!; assign " + con + ";};\n";
                } else {
                    toWriteStr += "\tS1 -> S0 {  sync " + sync + "!; assign " + con + ";},\n";
                    toWriteStr += "\tS0 -> S1 {  sync " + sync + "!; assign " + con + ";};\n";
                }

                toWriteStr += "}\n\n";
            }
        }


        toWriteStr += "\n";
        toWriteStr += "\n";
        toWriteStr += "\n";
        toWriteStr += "helper = Helper();\n";

        for (let i = 0; i < counter; i++) {
            toWriteStr += "line" + (i + 1) + " = Line" + (i + 1) + "();\n";
        }

        for (let i = 0; i < cyclecount; i++) {
            for (let j = 0; j < cycles[i].length; j++) {
                toWriteStr += "cycle" + (i + 1) + (j + 1) + " = Cycle" + (i + 1) + (j + 1) + "();\n";
            }
        }

        toWriteStr += "system helper,";
        for (let i = 0; i < counter; i++) {
            if (i + 1 === counter) {
                toWriteStr += "line" + (i + 1) + ",";
            } else {
                toWriteStr += "line" + (i + 1) + ",";
            }
        }

        for (let i = 0; i < cyclecount; i++) {
            for (let j = 0; j < cycles[i].length; j++) {
                    toWriteStr += "cycle" + (i + 1) + (j + 1) + ",";
            }
        }

        toWriteStr = toWriteStr.substring(0,toWriteStr.length-1) + ";";

        return toWriteStr;
    };
}

export default UNITYEditor;

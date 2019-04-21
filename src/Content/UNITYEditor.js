import React, { Component } from 'react';
import AceEditor from 'react-ace';

import './Styles/UNITYEditorStyle.css';

import 'brace/mode/python';
import 'brace/mode/haskell'
import 'brace/theme/twilight';
import 'brace/theme/chrome';
import 'brace/theme/github';
import 'brace/theme/monokai';
import 'brace/theme/eclipse';
import UTYtoXTAConverter from "../Converter/UTYtoXTAConverter";

class UNITYEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            actualFile: null,
            theme: "chrome",
            code: "",
            headColors:{"chrome":"#dcdcdc", "twilight":"#232323", "monokai":"#2F3129","cobalt":"#011e3a"},
            headTextColors:{"monokai":"#8F908A","chrome":"#777777","twilight": "#E2E2E2", "cobalt": "#FFFFFF"},
            headActiveColors:{"chrome":"#e8e8e8", "twilight": "#232323E5", "monokai":"#202020","cobalt":"#002240F1"},
            themeColors:{"chrome":"#FFFFFF", "twilight":"#141414", "monokai":"#272822", "cobalt": "#002240"}
        };

    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        this.state.files = nextProps.files;
        this.state.actualFile = nextProps.actualFile;
        if(this.state.actualFile != null && nextProps.files[nextProps.actualFile] != undefined){
            this.state.code = nextProps.files[nextProps.actualFile][1];
        }
        this.state.theme = nextProps.theme;
    }

    render() {
        let name = this.state.files[this.state.actualFile]  === undefined ? "" : this.state.files[this.state.actualFile][0]
        let w = name.length === 0 ? "0px" : (name.length * 10) + "px";
        let bckgC = this.state.headColors[this.state.theme];
        if (bckgC === undefined){
            bckgC = "white";
        }
        let textC = this.state.headTextColors[this.state.theme];
        if (textC === undefined){
            textC = "white";
        }
        let headC = this.state.headActiveColors[this.state.theme];
        if (headC === undefined){
            headC = "white";
        }
        return (
            <div id={"unityEditorHolder"}>

                <div id="editorfilename" style={{backgroundColor: headC, position: "relative"}}>
                    <div id="diveditorfilename"  style={{ width: w, backgroundColor: bckgC, color: textC}}>
                        {name}
                    </div>

                    <button style={{float: "right", verticalAlign: "middle", horizontalAlign: "middle", width:"100px"}} onClick={this.onConvert} id="toXtaBtn">.uty >>> .xta</button>

                </div>
                <AceEditor  style={{float: "left"}} id="edit"
                           theme={this.state.theme}
                           onChange={this.onChange}
                           name="UNIQUE_ID_OF_DIV"
                           editorProps={{$blockScrolling: true}}
                           value={this.state.code}
                           width='100%'
                           height='100%'
                />
                {/*
                {/* <div id ="utyEditorSettings" style={{width: "50px"}}>
                    <div className="dropdown2">
                        <div id={"color"} style={{backgroundColor: themeC}}/>
                        <div className="dropdown2-content">
                            <div onClick={this.onChangeThemeClick} className={"chrome"}></div>
                            <div onClick={this.onChangeThemeClick} className={"twilight"}></div>
                            <div onClick={this.onChangeThemeClick} className={"monokai"}></div>
                            <div onClick={this.onChangeThemeClick} className={"cobalt"}></div>
                        </div>
                    </div>
                </div>*/}

            </div>


        )
    }

    onChange = (newValue) => {
        if(this.state.files.length > 0){
            this.state.files[this.state.actualFile][1] = newValue;
            this.props.onCodeChange(this.state.files);
        }
        this.state.code = newValue;
    };

    onChangeThemeClick = (e) =>{
        this.setState({theme:e.target.className});
        this.props.onThemeChange(e.target.className);
    };


    cleanLists = () => {
        this.state.assign = [];
        this.state.init = [];
        this.state.declare = [];
        this.state.always = [];
    };

    onConvert = () => {
        if(this.state.files.length <= 0){
            this.props.onConvert("ERROR: You have to make file first!");
            return;
        }

        this.cleanLists();
        let code = this.state.files[this.state.actualFile][1];

        const utyToXtaConverter = new UTYtoXTAConverter(code);
        let text = utyToXtaConverter.convertToString();
        if(text === undefined || text === "") return;

        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        let fileName = this.state.files[this.state.actualFile][0];
        fileName = fileName.substring(0,fileName.length-4);
        /*element.setAttribute('download', fileName+".xta");
        alert(text);
        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);*/
        this.props.onConvert(text);

    };
}

export default UNITYEditor;

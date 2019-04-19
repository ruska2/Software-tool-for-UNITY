import React, { Component } from 'react';
import UNITYEditor from "./UNITYEditor";
import Header from "./Header";
import FileHandler from "./FileHandler";
import AddFilePopup from "./AddFilePopup";
import VerificationEditor from "./VerificationEditor";
import XTAEditor from "./XTAEditor";
import XTAVerificationEditor from "./XTAVerificationEditor";
import './Styles/ContentStyle.css';
import ButtonUI from "./ButtonUI";
import UTYtoXTAConverter from "../Converter/UTYtoXTAConverter";

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unityEditorTheme: "chrome",
            actualFile: 0,
            files: [],
            popUpControll: false,
            verificationCode: "",
            xtaCode: "",
            readOnly: true,
            themne: "chrome"
        };
    }

    onThemeChange = (newValue) => {
        this.setState({theme: newValue});
    };

    onCodeChange = (files) => {
      this.setState({files: files});
      localStorage.setItem("code",this.state.files)
    };

    onReadOnlyChange = (newValue) =>{
        this.setState({readOnly:newValue});
    };

    onFileChange = (files, actualFile) =>{
      this.setState({files: files, actualFile: actualFile})
    };

    onActualFileChange = (actualFile) =>{
      this.setState({actualFile: actualFile});
    };

    onVerificationCodeChange = (newValue) =>{
        this.setState({verificationCode: newValue});
    };

    onXTACodeChange = (code) => {
        this.setState({xtaCode: code});
    };

    render() {
        return (
            <div>
                <Header onThemeChange={this.onThemeChange}  verificationCode={this.state.verificationCode} actualFile={this.state.actualFile} files={this.state.files}/>
                <FileHandler theme = {this.state.theme} files={this.state.files} actualFile={this.state.actualFile} createNewFile={this.createNewFile} clickOnNewFile={this.clickOnNewFile} clickOnRemoveFile={this.onFileChange} onActualFileChange={this.onActualFileChange}/>
                <div id="editors">
                    <UNITYEditor theme={this.state.theme} files={this.state.files} actualFile={this.state.actualFile} onCodeChange={this.onCodeChange} onConvert={this.onXTACodeChange}/>
                    <XTAEditor readOnly={this.state.readOnly} code={this.state.xtaCode} onCodeChange={this.onXTACodeChange}/>
                    <div id="verificators">
                        <VerificationEditor theme={this.state.theme}/>
                        <XTAVerificationEditor readOnly={this.state.readOnly}/>
                    </div>
                </div>
                <ButtonUI onThemeChange={this.onThemeChange} changeReadOnly={this.onReadOnlyChange} onXtaDownload={this.onXTADownload} onUtyDownload={this.downloadUTY}/>

                <AddFilePopup popUpControll={this.state.popUpControll} createNewFile={this.createNewFile} onClosePopup={this.onClosePopup}/>
            </div>
        )
    }

    createNewFile = (fileName, content) =>{
        fileName = this.checkName(fileName);
        this.state.files.push([fileName, content]);
        this.state.actualFile = this.state.files.length - 1;
        this.setState({popUpControll: false});
    };

    clickOnNewFile = (actualFile) => {
        this.setState({actualFile: actualFile, popUpControll: true});
    };

    onClosePopup = () => {
        this.setState({popUpControll: false});
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

    onXTADownload = () => {
        if(this.state.files.length <= 0){
            alert("You have to make file first!");
            return;
        }
        let text = this.state.xtaCode;
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        let fileName = this.state.files[this.state.actualFile][0];
        fileName = fileName.substring(0,fileName.length-4);
        element.setAttribute('download', fileName+".xta");
        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    };

    downloadUTY = () => {
        if(this.state.files.length <= 0){
            alert("You have to make file first!");
            return;
        }

        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.state.files[this.state.actualFile][1]));
        element.setAttribute('download', this.state.files[this.state.actualFile][0]);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    };
}

export default Content;

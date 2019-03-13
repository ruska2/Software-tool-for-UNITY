import React, { Component } from 'react';
import UNITYEditor from "./UNITYEditor";
import Header from "./Header";
import ButtonUI from "./ButtonUI";
import FileHandler from "./FileHandler";
import AddFilePopup from "./AddFilePopup";
import VerificationEditor from "./VerificationEditor";

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: "chrome",
            actualFile: 0,
            files: [],
            popUpControll: false,
            verificationCode: ""
        };
    }

    onThemeChange = (newValue) => {
        this.setState({theme: newValue});
    };

    onCodeChange = (files) => {
      this.setState({files: files});
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

    render() {
        return (
            <div >
                <Header onThemeChange={this.onThemeChange}  verificationCode={this.state.verificationCode} actualFile={this.state.actualFile} files={this.state.files}/>
                <FileHandler files={this.state.files} actualFile={this.state.actualFile} createNewFile={this.createNewFile} clickOnNewFile={this.clickOnNewFile} clickOnRemoveFile={this.onFileChange} onActualFileChange={this.onActualFileChange}/>
                <UNITYEditor files={this.state.files} actualFile={this.state.actualFile} onCodeChange={this.onCodeChange} theme={this.state.theme}/>
                <VerificationEditor theme={this.state.theme} code={this.state.verificationCode} onCodeChange={this.onVerificationCodeChange}/>
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
}

export default Content;

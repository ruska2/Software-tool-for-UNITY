import React, { Component } from 'react';
import UNITYEditor from "./UNITYEditor";
import Header from "./Header";
import ButtonUI from "./ButtonUI";
import FileHandler from "./FileHandler";
import AddFilePopup from "./AddFilePopup";

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: "twilight",
            actualFile: 0,
            files: [],
            popUpControll: false
        };
    }

    onThemeChange = (newValue) => {
        this.setState({theme: newValue});
    };

    onCodeChange = (newValue) => {
      this.setState({code: newValue});
    };

    onFileChange = (files, actualFile) =>{
      this.setState({files: files, actualFile: actualFile})
    };

    render() {
        return (
            <div >
                <Header onThemeChange={this.onThemeChange} actualFile={this.state.actualfile} files={this.state.files}/>
                <FileHandler files={this.state.files} actualFile={this.state.actualFile} clickOnNewFile={this.clickOnNewFile} clickOnRemoveFile={this.onFileChange}/>
                <UNITYEditor onCodeChange={this.onCodeChange} theme={this.state.theme}/>
                <ButtonUI actualFile={this.state.actualFile} files={this.state.files} createNewFile={this.createNewFile}/>
                <AddFilePopup popUpControll={this.state.popUpControll} createNewFile={this.createNewFile}/>
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

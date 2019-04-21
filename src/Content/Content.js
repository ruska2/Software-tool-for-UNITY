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

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            actualFile: 0,
            files: [],
            popUpControll: false,
            verificationCode: "",
            xtaCode: "",
            readOnly: true,
            theme: "chrome",
            query: ""
        };
    }

    onThemeChange = (newValue) => {
        this.setState({theme: newValue});
        localStorage.setItem("theme",newValue);
    };

    onCodeChange = (files) => {
        this.setState({files: files});
        let f = files.join(";");
        localStorage.setItem("files", f);
    };

    onQueryChange = (value) => {
        this.setState({query: value});
    };

    onReadOnlyChange = (newValue) =>{
        this.setState({readOnly:newValue});
    };

    onFileChange = (files, actualFile) =>{
        this.setState({files: files, actualFile: actualFile});
        let f = files.join(";");
        localStorage.setItem("files", f);
        localStorage.setItem("actualFile",actualFile);
    };

    onActualFileChange = (actualFile) =>{
        this.setState({actualFile: actualFile});
        localStorage.setItem("actualFile",actualFile);
    };

    onVerificationCodeChange = (newValue) =>{
        this.setState({verificationCode: newValue});
    };

    onXTACodeChange = (code) => {
        this.setState({xtaCode: code});
    };

    render() {
        console.log(localStorage);
        //this.loadStorage();
        return (
            <div style={{ height: "100vh"}}>
                <Header/>
                <FileHandler theme = {this.state.theme} files={this.state.files} actualFile={this.state.actualFile} createNewFile={this.createNewFile} downloadUTY = {this.downloadUTY} clickOnNewFile={this.clickOnNewFile} clickOnRemoveFile={this.onFileChange} onActualFileChange={this.onActualFileChange}/>
                <div id="editors">
                    <UNITYEditor theme={this.state.theme} files={this.state.files} actualFile={this.state.actualFile} onCodeChange={this.onCodeChange} onConvert={this.onXTACodeChange}/>
                    <XTAEditor readOnly={this.state.readOnly} code={this.state.xtaCode} onCodeChange={this.onXTACodeChange}/>
                    <div id="verificators">
                        <VerificationEditor code = {this.state.verificationCode} theme={this.state.theme} onQueryChange={this.onQueryChange} onVerificationCodeChange={this.onVerificationCodeChange}/>
                        <XTAVerificationEditor code={this.state.query} queryChange={this.onQueryChange} readOnly={this.state.readOnly}/>
                    </div>
                </div>
                <ButtonUI theme={this.state.theme} onThemeChange={this.onThemeChange} changeReadOnly={this.onReadOnlyChange} onXtaDownload={this.onXTADownload} onUtyDownload={this.downloadUTY} onQueryDownload={this.downloadQuery}/>
                <div id="footer">
                    © Róbert Ruska. All rights reserved.
                </div>
                <AddFilePopup popUpControll={this.state.popUpControll} createNewFile={this.createNewFile} onClosePopup={this.onClosePopup}/>
            </div>
        )
    }

    loadStorage = () => {

        let t = localStorage.getItem("theme");
        let files = localStorage.getItem("files").split(";");
        if (files[0] === ""){
            files = [];
        }
        console.log("storaghe");
        console.log(localStorage.getItem("files"));
        console.log(files);
        let act = localStorage.getItem("actualFile");
        let f2 = [];
        for (let i = 0; i < this.state.files.length; i++){
            f2.push(this.state.files[i][0]);
            f2.push(this.state.files[i][1]);
        }
        console.log(act);
        if ((files !== null && files !== undefined) && files.length !== f2.length){
            let f = [];
            for (let i = 0; i < files.length; i+=2){
                f.push([files[i],files[i+1]]);
            }
            this.setState({files: f});
        }

        if ((act !== null && act !== undefined) && act != this.state.actualFile){
            if(act == -1){
                localStorage.setItem("actualFile", "0");
                this.setState({actualFile: 0})
            }
            else{
                this.setState({actualFile: act})
            }
        }
        if ((t) !== undefined && t !== this.state.theme){
            this.setState({theme: t})
        }


    };

    createNewFile = (fileName, content) =>{
        fileName = this.checkName(fileName);
        this.state.files.push([fileName, content]);
        this.state.actualFile = this.state.files.length - 1;
        let f = this.state.files.join(";");
        localStorage.setItem("files", f);
        localStorage.setItem("actualFile", this.state.actualFile);
        this.setState({popUpControll: false});
    };

    clickOnNewFile = (actualFile) => {
        this.setState({actualFile: actualFile, popUpControll: true});
        localStorage.setItem("actualFile",actualFile);
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
            this.setState({xtaCode: "ERROR: You have to make file first!"});
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
            this.setState({xtaCode: "ERROR: You have to make file first!"});
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

    downloadQuery = () => {
        if(this.state.files.length <= 0){
            this.setState({xtaCode: "ERROR: You have to make file first!"});
            return;
        }
        let fileName = this.state.files[this.state.actualFile][0];
        fileName = fileName.substring(0,fileName.length-4);
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.state.query));
        element.setAttribute('download', fileName + ".q");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    };


}

export default Content;

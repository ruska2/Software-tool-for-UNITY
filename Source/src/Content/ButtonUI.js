import React, { Component } from 'react';


import './Styles/UNITYEditorStyle.css';
import UTYtoXTAConverter from "../Converter/UTYtoXTAConverter";
import UTYtoXTAVerificaitonConverter from "../Converter/VerificationModel/UTYtoXTAVerificaitonConverter";




class ButtonUI extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            actualFile: null,
            verificationCode: ""
        };
    }



    componentWillUpdate(nextProps, nextState, nextContext) {
        this.state.name = nextProps.name;
        this.state.files = nextProps.files;
        this.state.actualFile = nextProps.actualFile;
        this.state.verificationCode = nextProps.verificationCode;
    }



    render() {
        return (
            <div>
                <input type="button" value="ConvertToXTA" onClick={this.onConvert}/>
                <input   type="button" value="ConvertQuery" onClick={this.onQueryConvert}/>
                <input type="button" value="ConvertToXTAVerif" onClick={this.onVerification}/>
            </div>
        )
    }




    cleanLists = () => {
        this.state.assign = [];
        this.state.init = [];
        this.state.declare = [];
        this.state.always = [];
    };

    onConvert = () => {
        if(this.state.files.length <= 0){
            alert("You have to make file first!");
            return;
        }

        this.cleanLists();
        let code = this.state.files[this.state.actualFile][1];

        const utyToXtaConverter = new UTYtoXTAConverter(code);
        let text = utyToXtaConverter.convertToString();
        if(text === ""){
            return;
        }
        if(text === undefined) return;

        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', this.state.files[this.state.actualFile][0]+".xta");
        console.log(this.state.files);
        alert(text);
        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);

    };

    onVerification = () => {
        if(this.state.files.length <= 0){
            alert("You have to make file first!");
            return;
        }

        this.cleanLists();
        let code = this.state.files[this.state.actualFile][1];

        const utyToXtaConverter = new UTYtoXTAVerificaitonConverter(code);
        let text = utyToXtaConverter.convertToString();
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

    onQueryConvert = () => {
        let element2 = document.createElement('a');
        element2.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.state.verificationCode));
        element2.setAttribute('download', "test.q");
        element2.style.display = 'none';
        document.body.appendChild(element2);

        element2.click();

        document.body.removeChild(element2);
    };
}

export default ButtonUI;

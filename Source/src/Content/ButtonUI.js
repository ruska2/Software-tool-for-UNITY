import React, { Component } from 'react';


import './UNITYEditorStyle.css';
import UTYtoXTAConverter from "../Converter/UTYtoXTAConverter";




class ButtonUI extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            actualFile: 0,
        };
    }



    componentWillUpdate(nextProps, nextState, nextContext) {
        this.state.name = nextProps.name;
        this.state.files = nextProps.files;
        this.state.actualfFle = nextProps.actualFile;
    }



    render() {
        return (
            <div>
                <input type="button" value="Convert" onClick={this.onConvert}/>
                <input type="file" onChange={this.onUpload}/>
            </div>
        )
    }


    onUpload = event => {
        let x = event.target.files[0];
        console.log(x);
        let reader = new FileReader();
        let res = "";
        let name = x.name;

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
            this.props.createNewFile(name,res);
        }.bind(this), 200);


    };

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
}

export default ButtonUI;

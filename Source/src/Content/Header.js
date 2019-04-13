import React, { Component } from 'react';
import './Styles/HeaderStyle.css';
import UTYtoXTAConverter from "../Converter/UTYtoXTAConverter";
import UTYtoXTAVerificaitonConverter from "../Converter/VerificationModel/UTYtoXTAVerificaitonConverter";

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            actualFile: null,
            files:[],
            theme: "chrome",
            verificationCode: ""

        };
    }

    handleChange = (event) => {
        this.props.onThemeChange(event.target.value);
    };

    componentWillUpdate(nextProps, nextState, nextContext) {
        this.state.actualFile = nextProps.actualFile;
        this.state.files = nextProps.files;
        this.state.theme = nextProps.theme;
        this.state.verificationCode = nextProps.verificationCode;

    }

    render() {
        return (
            <div>
                <div id="header">



                    <div id={"buttonUI"}>
                        <div id={"softwarename"}>
                            Software tool for UNITY
                        </div>
                        <div onClick={this.onConvert} id={"toXTA"}>
                            toXTA
                        </div>
                        <div onClick={this.onVerification} id={"toXTAVerif"}>
                            toXTAVer
                        </div>
                        <div onClick={this.onQueryConvert} id={"toQuery"}>
                            toQuery
                        </div>
                    </div>

                    <div className="dropdown2">
                        <div id={"color"}/>
                        <div className="dropdown2-content">
                            <div onClick={this.onChangeThemeClick} className={"chrome"}></div>
                            <div onClick={this.onChangeThemeClick} className={"twilight"}></div>
                            <div onClick={this.onChangeThemeClick} className={"monokai"}></div>
                        </div>
                    </div>
               </div>
            </div>

        )
    }

    onChangeThemeClick = (e) =>{
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
            alert("You have to make file first!");
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
        element.setAttribute('download', fileName+".xta");
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

export default Header;

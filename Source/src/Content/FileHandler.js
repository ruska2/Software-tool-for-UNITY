import React, { Component } from 'react';


import './Styles/FileHandlerStyle.css';
import TImage from "./Images/close.png";


class FileHandler extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            actualFile: null,
            enter: false,
            ent: false,
        };
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        this.state.actualFile = nextProps.actualFile;
        this.state.files = nextProps.files;
    }
    render() {
        let fileList = this.writeFiles();
        return (
            <div id="struct">
                <div id="plus" onMouseEnter={this.onEnterNew} onClick={this.clickNewFile} onMouseLeave={this.onLeaveNew}
                     style={this.state.enter ? {background: "#A0A0A0"} : {background: "#808080"}}>
                    <div id="pimg"></div>
                </div>
                {fileList}
            </div>
        )
    }


    clickNewFile = () =>{
        this.props.clickOnNewFile(this.state.actualFile);
    };

    onEnterNew = () => {
        this.setState({enter: true});
    };

    onLeaveNew = () => {
        this.setState({enter: false});
    };

    clickOnNewFile = () => {
        this.props.clickOnNewFile();
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

        if (this.state.files[parent] === undefined) return;
        this.props.onActualFileChange(parent);
    };


    removeFile = (event) => {
        let parent = event.target.parentNode.textContent.trim();
        for (let i = 0; i < this.state.files.length; i++) {
            if (parent === this.state.files[i][0]) {
                this.state.files.splice(i, 1);
            }
        }
        this.state.actualFile = this.state.files.length - 1;
        this.props.clickOnRemoveFile(this.state.files,this.state.actualFile);
    };


    writeFiles = () => {
        let f = [];
        for (let i = 0; i < this.state.files.length; i++) {
            if (this.state.actualFile === i) {
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
}

export default FileHandler;

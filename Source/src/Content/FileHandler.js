import React, { Component } from 'react';


import './Styles/FileHandlerStyle.css';
import DeleteImage from "./Images/close.png";
import FileImage from "./Images/file.png";


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
        let displayDropContent = this.state.dropDownContent ? "block" : "none";
        return (
            <div id="struct">
                <div id="plus">
                    <div id="filestitle">Files</div>
                    <div id="pimg"  onMouseEnter={this.onEnterNew} onClick={this.clickNewFile} onMouseLeave={this.onLeaveNew}
                         style={this.state.enter ? {cursor: "pointer"} : {cursor: "auto"}}/>
                    <div className="dropdown">
                        <div id="dropdownmenu"/>
                        <div className="dropdown-content">
                            <div onClick={this.downloadUTY}>Download as .uty</div>
                            <div onClick={this.onClickUpload}><input style={{display: "none"}} id="upload" name="UploadUTY"  type="file" onChange={this.onUpload}/>Upload file</div>
                        </div>
                    </div>
                </div>
                {fileList}
            </div>
        )
    }

    cutFileName = (fileName) => {
        if(fileName.length > 12){
            return fileName.substring(0,9)+"...";
        }
        return fileName;
    };

    onClickUpload = () =>{
        document.getElementById("upload").click();
        this.onClickDropdown();
    };

    onClickDropdown = () =>{
        this.setState({dropDownContent: !this.state.dropDownContent})
    };

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
                f.push( <div id="activeline" style={{color: 'white', background: '#7A98A5', margin: 'auto'}} onClick={this.onFileClick}>
                            <input type={"hidden"} value={this.state.files[i][0]}/>
                            <img className={"fileIcon"} src={FileImage} height="12" width="12"/>

                            <div className={"fileName"}><input type={"hidden"} value={this.state.files[i][0]}/>{this.state.files[i][0]}</div>
                            <img className={this.state.ent ? "msge" : "msg"} onMouseEnter={this.onDeleteEneter} onMouseLeave={this.onDeleteLeave} onClick={this.removeFile} src={DeleteImage}></img>


                        </div>);
                continue;
            }
            f.push(<div id="line" onClick={this.onFileClick}>
                <input type={"hidden"} value={this.state.files[i][0]}/>
                <img className={"fileIcon"} src={FileImage} height="12" width="12"/>
                <div className={"fileName"} ><input type={"hidden"} value={this.state.files[i][0]}/>{this.state.files[i][0]}</div>
                <img className={this.state.ent ? "msge" : "msg"} onMouseEnter={this.onDeleteEneter} onMouseLeave={this.onDeleteLeave} onClick={this.removeFile} src={DeleteImage}></img>
            </div>);
        }
        return f;
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
        this.onClickDropdown()
    };

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
}

export default FileHandler;

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


class UNITYEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            actualFile: null,
            theme: "chrome",
            code: ""
        };

    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        this.state.files = nextProps.files;
        this.state.actualFile = nextProps.actualFile;
        this.state.theme = nextProps.theme;
        if(this.state.actualFile != null && nextProps.files[nextProps.actualFile] != undefined){
            this.state.code = nextProps.files[nextProps.actualFile][1];
        }
    }

    render() {
        let name = this.state.files[this.state.actualFile]  === undefined ? "" : this.state.files[this.state.actualFile][0]
        let w = name.length === 0 ? "0px" : (name.length * 10) + "px";
        return (
            <div id={"unityEditorHolder"}>
                <div id="editorfilename">
                    <div id="diveditorfilename"  style={{width: w}}>
                        {name}
                    </div>
                </div>
                <AceEditor id="edit"
                           theme={this.state.theme}
                           onChange={this.onChange}
                           name="UNIQUE_ID_OF_DIV"
                           editorProps={{$blockScrolling: true}}
                           value={this.state.code}
                           width='570px'
                           height='100vh'
                />
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
}

export default UNITYEditor;

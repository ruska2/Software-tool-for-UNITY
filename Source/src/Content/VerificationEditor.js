import React, { Component } from 'react';
import AceEditor from 'react-ace';

import './Styles/VerificationEditorStyle.css';

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
            theme: "chrome",
            code: ""
        };

    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        this.state.theme = nextProps.theme;
        this.state.code = nextProps.code;
    }

    render() {
        return (
            <div id = "verifholder">
                <div id={"verificationLabel"}>
                    Verification
                </div>
                <AceEditor id="vedit"
                           theme={this.state.theme}
                           onChange={this.onChange}
                           name="UNIQUE_ID_OF_DIV"
                           editorProps={{$blockScrolling: true}}
                           value={this.state.code}
                           width='100hh'
                           height="100vh"
                />
            </div>

        )
    }

    onChange = (newValue) => {
        this.props.onCodeChange(newValue);

    };
}

export default UNITYEditor;

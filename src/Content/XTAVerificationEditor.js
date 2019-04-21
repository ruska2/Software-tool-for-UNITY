import React, { Component } from 'react';
import AceEditor from 'react-ace';

import './Styles/XTAVerificationEditorStyle.css';

import 'brace/mode/python';
import 'brace/mode/haskell'
import 'brace/theme/twilight';
import 'brace/theme/chrome';
import 'brace/theme/github';
import 'brace/theme/monokai';
import 'brace/theme/eclipse';
import 'brace/theme/cobalt';
import 'brace/theme/solarized_dark';


class XTAVerificationEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            theme: "solarized_dark",
            code: "",
            readOnly: true
        };

    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        this.state.theme = nextProps.theme;
        this.state.code = nextProps.code;
        this.state.readOnly = nextProps.readOnly;
    }

    render() {
        return (
            <div id = "xtaverifholder">
                <div id={"xtaverificationLabel"}>
                    <strong>Query</strong>
                </div>
                <AceEditor style={{float: "left"}} id="xtavedit"
                           theme={this.state.theme}
                           onChange={this.onChange}
                           name="UNIQUE_ID_OF_DIV"
                           editorProps={{$blockScrolling: true}}
                           value={this.state.code}
                           width='100%'
                           height="20vh"
                           readOnly= {this.state.readOnly}
                />
            </div>

        )
    }

    onChange = (newValue) => {
        this.state.code = newValue;
        this.props.queryChange(newValue);
    };


}

export default XTAVerificationEditor;

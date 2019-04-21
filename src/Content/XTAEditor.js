import React, { Component } from 'react';
import AceEditor from 'react-ace';

import './Styles/XTAEditorStyle.css';

import 'brace/mode/python';
import 'brace/mode/haskell'
import 'brace/theme/twilight';
import 'brace/theme/chrome';
import 'brace/theme/github';
import 'brace/theme/monokai';
import 'brace/theme/eclipse';


class XTAEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            theme: "cobalt",
            code: "",
            readOnly: true
        };

    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        this.state.code = nextProps.code;
        this.state.readOnly = nextProps.readOnly;

    }

    render() {
        return (
            <div id={"xtaEditorHolder"}>

                <div id="xtaEditorfilename" style={{backgroundColor: "#002240F1", position: "relative"}}>
                    .XTA
                </div>
                <AceEditor id="edit"
                           theme={this.state.theme}
                           onChange={this.onChange}
                           name="UNIQUE_ID_OF_DIV"
                           editorProps={{$blockScrolling: true}}
                           value={this.state.code}
                           width='100%'
                           height='60vh'
                           readOnly= {this.state.readOnly}
                />
            </div>

        )
    }

    onChange = (newValue) => {
        this.props.onCodeChange(newValue);
    };

    onChangeThemeClick = (e) =>{
        this.setState({theme:e.target.className});
    };
}

export default XTAEditor;

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
import 'brace/theme/cobalt';
import 'brace/theme/terminal';


class VerificationEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            theme: "chrome",
            code: "",
            headColors:{"chrome":"#dcdcdc", "twilight":"#232323", "monokai":"#2F3129","cobalt":"#011e3a"},
            headTextColors:{"monokai":"#8F908A","chrome":"#777777","twilight": "#E2E2E2", "cobalt": "#FFFFFF"},
            headActiveColors:{"chrome":"#e8e8e8", "twilight": "#232323E5", "monokai":"#202020","cobalt":"#002240F1"},
        };

    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        this.state.theme = nextProps.theme;
        this.state.code = nextProps.code;
        this.state.readOnly = nextProps.readOnly;
    }

    render() {

        let textC = this.state.headTextColors[this.state.theme];
        if (textC === undefined){
            textC = "white";
        }
        let headC = this.state.headActiveColors[this.state.theme];
        if (headC === undefined){
            headC = "white";
        }
        return (
            <div id ="verifholder" style={{backgroundColor: headC}}>
                <div id={"verificationLabel"} style={{ position: "relative", color: textC}}>
                    <strong>Verification</strong>
                        <button style={{float:"right", verticalAlign: "middle", horizontalAlign: "middle", width:"100px"}} id="toQueryb"> >>> .query</button>

                </div>
                <AceEditor style={{float: "left"}} id="vedit"
                           theme={this.state.theme}
                           onChange={this.onChange}
                           name="UNIQUE_ID_OF_DIV"
                           editorProps={{$blockScrolling: true}}
                           value={this.state.code}
                           width='100%'
                           height="20vh"
                />

            </div>

        )
    }

    onChange = (newValue) => {
        this.state.code = newValue;

    };
}

export default VerificationEditor;

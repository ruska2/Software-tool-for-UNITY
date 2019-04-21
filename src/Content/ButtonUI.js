import React, { Component } from 'react';
import './Styles/ButtonUIStyle.css';


class ButtonUI extends Component {

    constructor(props) {
        super(props);
        this.state = {
            verificationCode: "",
            edit: "Edit",
            readOnly: true,
            theme: "chrome",
            themeColors:{"chrome":"#FFFFFF", "twilight":"#141414", "monokai":"#272822", "cobalt": "#002240"}
        };
    }



    componentWillUpdate(nextProps, nextState, nextContext) {
        this.state.verificationCode = nextProps.verificationCode;
        this.state.theme = nextProps.theme;
    }



    render() {
        let col = this.state.themeColors[this.state.theme];
        return (
            <div style={{ height: "10vh", float:"left", width: "100%"}}>
                <div  style={{width:"205px", float:"left", margin: "auto", textAllign: "center"}}>
                    <div style={{marginLeft: "25px", float: "left", paddingTop: "20px"}} id="colorTheme"> <strong>Editor color:</strong> </div>
                <div className="dropdown2">
                    <div style={{backgroundColor: col}} id={"color"}/>
                    <div className="dropdown2-content">
                        <div onClick={this.onChangeThemeClick} className={"chrome"}></div>
                        <div onClick={this.onChangeThemeClick} className={"twilight"}></div>
                        <div onClick={this.onChangeThemeClick} className={"monokai"}></div>
                        <div onClick={this.onChangeThemeClick} className={"cobalt"}></div>
                    </div>
                </div>
                </div>
                <div id="bui" style={{ paddingTop: "10px", float: "left"}}>
                    <div id="bui1">
                        <button className={"baseButton"} type="button" onClick={this.onUtyDownload}> Download .uty</button>
                        {/*<button className={"baseButton"}  type="button">Download verification</button>*/}
                    </div>
                    <div  id="bui2">
                        <button className={"baseEditButton"} type="button" onClick={this.changeEdit}> {this.state.edit}</button>
                        <button className={"baseButton"} type="button" onClick={this.onXtaDownload}> Download .xta</button>
                        <button className={"baseButton"}  type="button" onClick={this.props.onQueryDownload}>Download .query</button>
                    </div>
                </div>
            </div>
        )
    }


    changeEdit = () =>{
      if(this.state.edit === "Edit"){
          this.props.changeReadOnly(false);
          this.state.edit = "Lock";
      }else{
          this.props.changeReadOnly(true);
          this.state.edit = "Edit";
      }
    };

    onXtaDownload = () =>{
        this.props.onXtaDownload();
    };

    onUtyDownload = () => {
      this.props.onUtyDownload();
    };

    onChangeThemeClick = (event) =>{
       let className = event.target.className;
       this.setState({theme: className});
       this.props.onThemeChange(className);
    }
}

export default ButtonUI;

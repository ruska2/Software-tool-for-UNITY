import React, { Component } from 'react';
import './Styles/AddFilePopupStyle.css';

class AddFilePopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popUpControll: false,
            fileName: ''
        };
    }


    componentWillUpdate(nextProps, nextState, nextContext) {
        this.state.popUpControll = nextProps.popUpControll;
    }

    render() {
        let popup = this.unityPopUp();
        return (
            <div >
                {this.state.popUpControll ? <div>{popup}</div> : null}
            </div>
        )
    }
    unityPopUp = () => {
        let d = [];
        d.push(
            <div className='popup'>
                <div className='popup_inner' >
                    <label style={{display: "block", margin: "8px"}}> <strong>Set file name:</strong></label><input maxLength={25} style={{display: "block", marginLeft:"35px", width:"70%"}} onChange={this.onFileNameChange} type="text"/>
                    <button className="bPopup" onClick={this.closePopup}>Close</button>
                    <button className="bPopup" onClick={this.onOkayClick}>Okay</button>
                </div>
            </div>
        );
        return d;
    };

    closePopup = () => {
        this.props.onClosePopup();
    };


    onFileNameChange = (event) => {
        this.setState({fileName: event.target.value});
    };

    onOkayClick = () =>{
        if(this.state.fileName === "") return;
        //TODO MSG
        this.props.createNewFile(this.state.fileName, "");
        this.state.fileName = "";
    }
}

export default AddFilePopup;

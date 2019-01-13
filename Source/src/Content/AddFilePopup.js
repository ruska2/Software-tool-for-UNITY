import React, { Component } from 'react';


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
                <div className='popup_inner'>
                    <label>File name:</label><input onChange={this.onFileNameChange} type="text"/>
                    <button onClick={this.closePopup}>Close me</button>
                    <button onClick={this.onOkayClick}>Okay</button>
                </div>
            </div>
        );
        return d;
    };


    closePopup = () => {
        this.setState({popUpControll: false});
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

import React, { Component } from 'react';
import UNITYEditor from "./UNITYEditor";
import Header from "./Header";

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: "twilight"
        };
    }

    onThemeChange = (newValue) => {
        this.setState({theme: newValue});
    };

    render() {
        return (
            <div >
                <Header onThemeChange={this.onThemeChange}/>
                <UNITYEditor theme={this.state.theme}/>
            </div>
        )
    }
}

export default Content;

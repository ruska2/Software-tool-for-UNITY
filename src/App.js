import React, { Component } from 'react';
import './App.css';
import Content from "./Content/Content";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    render() {
        return (
            <div className="App">
                <Content/>
            </div>
        )
    }
}

export default App;

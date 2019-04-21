import React, { Component } from 'react';
import './Styles/HeaderStyle.css';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <div>
                <div id="header">
                    <div id={"buttonUI"}>
                        <div id={"softwarename"}>
                            <strong>Software tool for UNITY</strong>
                        </div>
                    </div>
               </div>
            </div>

        )
    }



}

export default Header;

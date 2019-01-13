import React, { Component } from 'react';
import './Styles/HeaderStyle.css';
import DownloadIcon from './Images/download.png';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            actualFile: null,
            files:[]
        };
    }

    handleChange = (event) => {
        this.props.onThemeChange(event.target.value);
    };

    componentWillUpdate(nextProps, nextState, nextContext) {
        this.state.actualFile = nextProps.actualFile;
        this.state.files = nextProps.files;
    }

    downloadUTY = () => {
        if(this.state.files.length <= 0){
            alert("You have to make file first!");
            return;
        }

        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.state.files[this.state.actualFile][1]));
        element.setAttribute('download', this.state.files[this.state.actualFile][0]);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    };

    render() {
        return (
            <div>
                <div id="header">
                    <form id="themeform">
                        <label id="themelabel">
                            Theme:
                            <select value={this.state.theme} onChange={this.handleChange} id="themeselection">
                                <option value="twilight">Twilight</option>
                                <option value="chrome">Chrome</option>
                                <option value="github">Github</option>
                                <option value="monokai">Monokai</option>
                                <option value="eclipse">Eclipse</option>
                            </select>
                        </label>
                    </form>
                    <div id="downloadico">
                        <img src={DownloadIcon} onClick={this.downloadUTY}/>
                    </div>
                </div>
            </div>

        )
    }

}

export default Header;

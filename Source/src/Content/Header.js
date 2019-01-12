import React, { Component } from 'react';
import './HeaderStyle.css';

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleChange = (event) => {
        this.props.onThemeChange(event.target.value);
    };

    render() {
        return (
            <div>
                <div id="header">
                    <form>
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
                </div>
            </div>

        )
    }

}

export default Header;

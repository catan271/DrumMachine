import React from "react";
import ReactDOM from 'react-dom';
import './index.css';
import {createStore} from "redux";
import {Provider, connect} from "react-redux";

const AUDIO = [
    ['https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3', 'Q', 'Heater 1', 81],
    ['https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3', 'W', 'Heater 2', 87],
    ['https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3', 'E', 'Heater 3', 69],
    ['https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3', 'A', 'Heater 4', 65],
    ['https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3', 'S', 'Clap', 83],
    ['https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3', 'D', 'Open HH', 68],
    ['https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3', 'Z', "Kick n' Hat", 90],
    ['https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3', 'X', 'Kick', 88],
    ['https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3', 'C', 'Closed HH', 67]
];

//Redux

const displayReducer = (state = {display: ''}, action) => {
    if (action.type === 'change') return {display: action.display};
    else return state;
}

var store = createStore(displayReducer);

class Drumpad extends React.Component {
    constructor(props) {
        super(props); //index
        this.state = {
            re: 0
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleClick() {
        ReactDOM.findDOMNode(this).firstChild.play();
        store.dispatch({
            type: 'change',
            display: AUDIO[this.props.index][2]
        });
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress);
    }

    handleKeyPress(event) {
        if (event.keyCode == AUDIO[this.props.index][3]) {
            this.handleClick();
        }
    }

    render() {
        return (
            <button id={AUDIO[this.props.index][1] + '-button'} className="drum-pad" onClick={this.handleClick} onFocus={this.handleClick}>
                <audio id={AUDIO[this.props.index][1]} className="clip" src={AUDIO[this.props.index][0]}/>
                {AUDIO[this.props.index][1]}
            </button>
        )
    }
}

class DisabledDrumpad extends React.Component {
    render() {
        return (
            <button id={AUDIO[this.props.index][1] + '-button'} className="drum-pad">
                {AUDIO[this.props.index][1]}
            </button>
        )
    }
}

class Pads extends React.Component {
    render() {
        return (
            <div id="pads">
                <Drumpad index={0}/>
                <Drumpad index={1}/>
                <Drumpad index={2}/>
                <Drumpad index={3}/>
                <Drumpad index={4}/>
                <Drumpad index={5}/>
                <Drumpad index={6}/>
                <Drumpad index={7}/>
                <Drumpad index={8}/>
            </div>
        )
    }
}

class DisabledPads extends React.Component {
    render() {
        return (
            <div id="pads">
                <DisabledDrumpad index={0}/>
                <DisabledDrumpad index={1}/>
                <DisabledDrumpad index={2}/>
                <DisabledDrumpad index={3}/>
                <DisabledDrumpad index={4}/>
                <DisabledDrumpad index={5}/>
                <DisabledDrumpad index={6}/>
                <DisabledDrumpad index={7}/>
                <DisabledDrumpad index={8}/>
            </div>
        )
    }
}

class Display extends React.Component {
    render() {
        return (
            <div id={"display"}>
                {this.props.display}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}

const mapDispatchToProps = (dispatch) => {
    return ({
        sendDisplay: (s) => {
            dispatch(s);
        }
    });
}

const DisplayContainer = connect(mapStateToProps, mapDispatchToProps)(Display);

class DrumMachine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            power: 'on'
        }
        this.powerOnOff = this.powerOnOff.bind(this);
    }
    powerOnOff() {
        if (this.state.power == 'on') {
            this.setState({power: 'off'});
        }
        else this.setState({power: 'on'});
    }
    render() {
        return (
            <div id={"machine"}>
                <div id="bar">Catan's Drum Machine</div>
                <div id="drum-machine">
                    {this.state.power == 'on'? <Pads/> : <DisabledPads/>}
                    <div id={"controls"}>
                        <div id={"power"}>
                            POWER
                            <button onClick={this.powerOnOff}>{this.state.power}</button>
                        </div>
                        <Provider store={store}>
                            <DisplayContainer/>
                        </Provider>
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <DrumMachine/>,
    document.getElementById('root')
);
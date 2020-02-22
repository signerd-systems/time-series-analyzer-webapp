import React from 'react';
import './AddRemoveSignals.css';

export class AddRemoveSignals extends React.Component {

    constructor(props){
        super(props);
        this.addSignals = this.addSignals.bind(this);
        this.removeSignals = this.removeSignals.bind(this);
    }

    addSignals(event){
        const newSignal = event.target.value;
        let signalsList = this.props.signalsList;
        if (signalsList.indexOf(newSignal) === -1){
            signalsList.push(newSignal);
        }
        this.props.handleSignalsList(signalsList, newSignal, '');
    }

    removeSignals(event){
        const signalToRemove = event.target.value.replace('  [X]  ', '');
        let signalsList = this.props.signalsList;
        if (signalsList.indexOf(signalToRemove) !== -1){
            signalsList.splice(signalsList.indexOf(signalToRemove), 1);
        }
        this.props.handleSignalsList(signalsList, '', signalToRemove);
    }

    render(){
        let availableSignals = [];
        this.props.availableSignals.map(signalName => availableSignals.push(
            <option key={"signal_option_" + Math.floor(Math.random()*1e20)}>
                {signalName}
            </option>
        ));
        let addRemoveButtonStyle = {
            flexDirection: this.props.flexDirection,
        }
        return(
            <div className="add-remove-signals-panel" style={addRemoveButtonStyle}
                 key={"add_remove_signals_panel_" + Math.floor(Math.random()*1e20)} className="add-remove-signals-panel">
                <select className="add-remove-selection"
                        name="add-remove-signals" onChange={this.addSignals}>
                    <option value=''>--add signal--</option>
                    {availableSignals}
                </select>
                {this.props.signalsList.map((signal, index) =>{
                    if (this.props.availableSignals.indexOf(signal) !== -1){
                        return(<input className="add-remove-buttons"
                            key={"remove_signal_" + Math.floor(Math.random()*1e20)}
                            type="button"
                            value={signal + "  [X]  "}
                            onClick={this.removeSignals}>
                        </input>)
                    }}
                )}

            </div>
        )
    }
}
import React from 'react';
import './DataTable.css';

export class DataTable extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userSelectedSignals: [],
            buttonStyles: {},
            dataTableVisibility: {
                display: "block",
            },
            showText: "Hide Data Table",
        };
        this.handleSignal = this.handleSignal.bind(this);
        this.removeTrace  = this.removeTrace.bind(this);
        this.showDataTable = this.showDataTable.bind(this);
    }

    handleSignal(event){
        let newSignal = event.target.value;
        let userSelectedSignals = this.state.userSelectedSignals;
        let buttonStyles = this.state.buttonStyles;

        if (userSelectedSignals.indexOf(newSignal) === -1){
            userSelectedSignals.push(newSignal);
            buttonStyles[newSignal] = {
                backgroundColor: 'rgb(0, 150, 250)',
                borderRadius: 5,
                fontSize: '1em',
            };
        }
        else {
            userSelectedSignals.splice(userSelectedSignals.indexOf(newSignal),1);
            delete(buttonStyles[newSignal]);
        }
        this.setState({userSelectedSignals: userSelectedSignals});
        this.setState({buttonStyles: buttonStyles});
        this.props.handleSignal(newSignal);
    }

    removeTrace(event){
        this.props.removeTrace(event.target.name);
    }

    showDataTable(){
        if (this.state.dataTableVisibility.display === "none"){
            this.setState({dataTableVisibility: {display: "block",},
                           showText: "Hide Data Table"});
        }
        else{
            this.setState({dataTableVisibility: {display: "none"},
                           showText: "Show Data Table"});
        }
    }

    render() {
        const tableHeaders = ['', 'SignalName', 'StartTime', 'StopTime', 'SamplingTime', 'Description'];

        let signalsOverview = [];
        let signalData;
        let signalNames = Object.keys(this.props.inputTraces);
        signalNames.map(signalName => {
            signalData = this.props.inputTraces[signalName];
            signalsOverview.push({
                name:         signalName,
                startTime:    signalData.time[0],
                stopTime:     signalData.time[signalData.time.length - 1],
                samplingTime: signalData.samplingTime,
                description:  signalData.description,
            });
        });

        let tableData = [];

        signalsOverview.map(signal => {
            tableData.push(
                <tr key={'signal_' + Math.floor(Math.random()*1e20)}>
                    <td><input className="remove-signal-button"
                               type="button"
                               value=" [X] "
                               name={signal.name}
                               onClick={this.removeTrace}>
                        </input>
                    </td>
                    <td><input 
                            className = "signal-button" 
                            type      = "button" 
                            value     = {signal.name}
                            onClick   = {this.handleSignal}
                            style     = {this.state.buttonStyles[signal.name]}>
                        </input>
                    </td>
                    <td>{signal.startTime}</td>
                    <td>{signal.stopTime}</td>
                    <td>{signal.samplingTime}</td>
                    <td>{signal.description}</td>
                </tr>
            )
        })

        return (
            <div className="data-table-display">
                <input className="show-hide-button" 
                       type="button" 
                       value={this.state.showText} 
                       onClick={this.showDataTable}></input>
                <table style={this.state.dataTableVisibility}>
                    <thead>
                        <tr>
                            {tableHeaders.map(header => <td key={'header_' + Math.floor(Math.random()*1e20)}>{header}</td>)}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData}
                    </tbody>
                </table>
            </div>
        )
    }
}
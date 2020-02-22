import React from 'react';
import './SignalDerivative.css'
import { AddRemoveSignals } from '../utilities/AddRemoveSignals';
import {Trace} from '../ImportJsonData/ImportJsonData.js';

export class SignalDerivative extends React.Component {

    constructor(props){
        super(props);
        this.updateDerivativeTime = this.updateDerivativeTime.bind(this);
        this.calculateSignalDerivative = this.calculateSignalDerivative.bind(this);
    }

    calculateSignalDerivative(signalName){
        let trace = this.props.inputTraces[signalName];
        const derivativeTime = this.props.derivativeTimes[signalName];
        let signalDerivative = [];
        let signalTime = [];
        const derivativeSampleSize = Math.floor(derivativeTime/trace.samplingTime);
        let i;
        for (i=0; i < trace.time.length - derivativeSampleSize - 1; i++){
            signalDerivative.push((trace.data[i + derivativeSampleSize] - trace.data[i])/(trace.samplingTime * derivativeSampleSize));
            signalTime.push(trace.time[i]);
        }

        let signalDerivativeTrace = {};
        let traceName = 'Derivative_' + signalName;
        signalDerivativeTrace[traceName]= new Trace(
                                                    'Derivative_' + signalName,
                                                    signalDerivative,
                                                    signalTime,
                                                    trace.signalUnit,
                                                    trace.timeUnit,
                                                    trace.samplingTime,
                                                    'derivative of signal ' + trace.name + ' with derivative time = ' + derivativeSampleSize*trace.samplingTime + 's',
                                                );
        this.props.handleSignalDerivativeTrace(signalDerivativeTrace);
    }    

    updateDerivativeTime(event){
        let signalName, derivativeTime, derivativeTimes;
        if (event.keyCode === 13 || event.keyCode === 9){
            signalName = event.target.name;
            derivativeTime = event.target.value;
            derivativeTimes = this.props.derivativeTimes;
            derivativeTimes[signalName] = derivativeTime;
            this.props.handleSignalDerivativeTime(derivativeTimes);
            this.calculateSignalDerivative(signalName);
        }
    }

    render(){
        let availableSignals = [];
        Object.keys(this.props.inputTraces).map(signalName => availableSignals.push(signalName));
        let derivativeTime = {};

        this.props.signalsList.map(signalName => {
            derivativeTime[signalName] = (
            <tr>
                <td>{signalName}</td>
                <td><input type="number" 
                       key={"derivative_time_" + Math.floor(Math.random()*1e20)}
                       name={signalName} 
                       placeholder={this.props.derivativeTimes[signalName]? this.props.derivativeTimes[signalName] : 
                                                                        "derivative time in sec e.g. 0.5)"}
                       onKeyDown={this.updateDerivativeTime}>
                </input></td>
            </tr>);
        });

        return(
            <div className="signal-derivative-panel">
                <AddRemoveSignals key={'add_remove_' + Math.floor(Math.random()*1e20)}
                                  availableSignals={availableSignals}
                                  flexDirection="row"
                                  signalsList={this.props.signalsList}
                                  handleSignalsList={this.props.handleSignalsList}/>
                {Object.keys(derivativeTime).map(signalName => { 
                    return(<div>
                            {derivativeTime[signalName]}
                           </div>)})}
            </div>
        )
    }
}
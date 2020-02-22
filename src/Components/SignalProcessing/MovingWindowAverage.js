import React from 'react';
import './MovingWindowAverage.css'
import { AddRemoveSignals } from '../utilities/AddRemoveSignals';
import {Trace} from '../ImportJsonData/ImportJsonData.js';

export class MovingWindowAverage extends React.Component {

    constructor(props){
        super(props);
        this.updateWindowSize = this.updateWindowSize.bind(this);
        this.calculateMovingWindowAverage = this.calculateMovingWindowAverage.bind(this);
    }

    calculateMovingWindowAverage(signalName){
        const trace = this.props.inputTraces[signalName];
        const windowSize = this.props.windowSizes[signalName];
        let movingWindowAverageSignal = [];
        const windowSampleSize = windowSize/trace.samplingTime;
        let i, j, dataArray;
        for (i = 0; i < trace.time.length; i++){
            dataArray = Array(windowSampleSize).fill(0);
            for (j = 0; j < windowSampleSize - 1; j++){
                trace.data[i - j]? dataArray.push(trace.data[i-j]) : dataArray.push(0);
            }
            windowSampleSize === 0? movingWindowAverageSignal.push(trace.data[i]) : 
                                    movingWindowAverageSignal.push(dataArray.reduce((accumulator, currentValue) => 
                                                                                    accumulator + currentValue)/windowSampleSize);
        }
        let movingWindowAverageTrace = {};
        let traceName = 'MovingWindowAvg_' + signalName;
        movingWindowAverageTrace[traceName]= new Trace(
                                                    traceName,
                                                    movingWindowAverageSignal,
                                                    trace.time,
                                                    trace.signalUnit,
                                                    trace.timeUnit,
                                                    trace.samplingTime,
                                                    'moving window average of signal ' + 
                                                        trace.name + ' with window-size = ' + windowSize + 's',
                                                );
        this.props.handleMovingWindowAverageTrace(movingWindowAverageTrace)
    }    

    updateWindowSize(event){
        let signalName, windowSize, windowSizes;
        if (event.keyCode === 13 || event.keyCode === 9){
            signalName = event.target.name;
            windowSize = event.target.value;
            windowSizes = this.props.windowSizes;
            windowSizes[signalName] = windowSize;
            this.props.handleWindowSize(windowSizes);
            this.calculateMovingWindowAverage(signalName);
            
        }
    }

    render(){
        let availableSignals = [];
        Object.keys(this.props.inputTraces).map(signalName => availableSignals.push(signalName));
        let windowSize = {};
        this.props.signalsList.map(signalName => {
            windowSize[signalName] = (
            <tr>
            <td>{signalName}</td>
            <td><input type="number" 
                       key={"window_size_" + Math.floor(Math.random()*1e20)}
                       name={signalName} 
                       placeholder={this.props.windowSizes[signalName]? this.props.windowSizes[signalName] : 
                                                                        "window size in sec e.g. 0.5)"}
                       onKeyDown={this.updateWindowSize}>
                </input></td>
            </tr>);
        });
        return(
            <div className="moving-window-average-panel">
                <AddRemoveSignals key={'add_remove_' + Math.floor(Math.random()*1e20)}
                                  availableSignals={availableSignals}
                                  flexDirection="row"
                                  signalsList={this.props.signalsList}
                                  handleSignalsList={this.props.handleSignalsList}/>
                {Object.keys(windowSize).map(signalName => { 
                    return(<table>
                            {windowSize[signalName]}
                           </table>)})}
            </div>
        )
    }
}
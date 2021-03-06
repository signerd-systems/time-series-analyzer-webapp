import React from 'react';
import './FFTPlot.css';
import Plotly from 'plotly.js-basic-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import { AddRemoveSignals } from '../utilities/AddRemoveSignals';
import {fft} from 'ezfft';
import {Resizable} from 're-resizable';
const Plot = createPlotlyComponent(Plotly);

export class FFTPlotTrace {
    constructor(name, amplitude, frequency, signalUnit, timeUnit, color, visible){
        this.name = name;
        this.y = amplitude;
        this.x = frequency;
        this.type = 'scatter';
        this.mode = 'lines';
        this.signalUnit = signalUnit;
        this.timeUnit = 1/timeUnit;
        this.line = {
            color: color,
            width: 1,
        };
        this.visible = visible;
    }
}


export class FFTPlot extends React.Component {

    constructor(props){
        super(props);
        this.handleLegendClick = this.handleLegendClick.bind(this);
        this.handleWindowSize = this.handleWindowSize.bind(this);
    }

    handleWindowSize(e, direction, ref, d){
        this.props.updateWindowSize(this.props.windowSize[0] + d.width, this.props.windowSize[1] + d.height);
    }

    handleLegendClick(event){
        const signalName = event.data[event.curveNumber].name;
        this.props.updateSelectedLegend(signalName);
    }

    render(){
        const availableSignals = Object.keys(this.props.inputTraces);
        let fftTraces = [], fftData, visible;
        this.props.signalsList.map(signalName => {
            visible = true;
            if ((this.props.selectedLegend !== '') && (this.props.selectedLegend !== signalName)){
                visible = 'legendonly';
            }

            if (availableSignals.indexOf(signalName) !== -1){
                fftData = fft(this.props.inputTraces[signalName].data, 
                            1/this.props.inputTraces[signalName].samplingTime);
                fftTraces.push(new FFTPlotTrace(signalName, 
                                                fftData.frequency.amplitude, 
                                                fftData.frequency.frequency, 
                                                this.props.inputTraces[signalName].signalUnit, 
                                                this.props.inputTraces[signalName].timeUnit, 
                                                this.props.inputTraces[signalName].color,
                                                visible));
            }
        });
        return (
            <div className="fft-plot-panel">
                <div className="fft-plot-display">
                    <Resizable style={{overflow: "scroll"}} 
                            size={{width: this.props.windowSize[0], height: this.props.windowSize[1]}} 
                            onResizeStop={this.handleWindowSize}>
                        <Plot data={fftTraces} onLegendDoubleClick={this.handleLegendClick}
                            layout={{
                                title: (this.props.selectedLegend !== '') ? 
                                this.props.selectedLegend : 
                                this.props.inputTraces[this.props.primarySignal].name, 
                                width: this.props.windowSize[0]*0.8,
                                height: this.props.windowSize[1],
                                xaxis: {
                                    title: 'frequency ( 1/s)',
                                },
                                yaxis: {
                                    title: (this.props.selectedLegend !== '') ?
                                    this.props.selectedLegend + " (" +
                                    this.props.inputTraces[this.props.selectedLegend].signalUnit + ")" :
                                    this.props.inputTraces[this.props.primarySignal].name + " (" +
                                    this.props.inputTraces[this.props.primarySignal].signalUnit + ")", 
                                }
                            }}/>
                    </Resizable>
                </div>
                <div className="fft-plot-add-remove-signals">
                    <AddRemoveSignals key={"add_remove_" + Math.floor(Math.random()*1e20)}
                                    availableSignals={availableSignals}
                                    signalsList={this.props.signalsList}
                                    flexDirection="row"
                                    handleSignalsList={this.props.updateFFTPlotSignalsList}/>
                </div>
            </div>
        );
    }
}
import React from 'react';
import './XYPlot.css';
import {AddRemoveSignals} from '../utilities/AddRemoveSignals.js';
import Plotly from 'plotly.js-basic-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import {Resizable} from 're-resizable';
const Plot = createPlotlyComponent(Plotly);

function zeroOderHoldResample(trace, timeBase){
    //find start time
    let startIndex = 0, i;
    while(timeBase[0] > trace.time[startIndex]){
        startIndex++;
    }

    let traceData = [];

    for (i=0; i < timeBase.length; i++){
        traceData.push(trace.data[startIndex]);
        if (timeBase[i] >= trace.time[startIndex]){
            startIndex++;
        }
    }

    return ({
        data: traceData,
        time: timeBase,
        samplingTime: trace.samplingTime,
    });
}

function resampleToSameTimeBase(trace1, trace2){
    const samplingTime = trace1.samplingTime < trace2.samplingTime ? trace1.samplingTime : trace2.samplingTime;
    const startTime = trace1.time[0] > trace2.time[0] ? trace1.time[0] : trace2.time[0];
    const stopTime  = trace1.time[trace1.time.length - 1] < trace2.time[trace2.time.length -1] ? 
        trace1.time[trace1.time.length - 1] : trace2.time[trace2.time.length -1];

    let timeBase = Array(Math.floor((stopTime - startTime)/samplingTime)).fill().map((t, i) => startTime + i*samplingTime);

    return {
        trace1: zeroOderHoldResample(trace1, timeBase),
        trace2: zeroOderHoldResample(trace2, timeBase),
    }
}

export class XYPlotTrace{
    constructor(name, x, y, xUnit, yUnit, color, visible){
        this.name = name;
        this.x = x;
        this.y = y;
        this.type = 'scatter';
        this.mode = 'lines';
        this.xUnit = xUnit;
        this.yUnit = yUnit;
        this.line = {
            color: color,
            width: 1,
        };
        this.visible = visible;
    }
}

export class XYPlot extends React.Component {

    constructor(props){
        super(props);
        this.handleLegendClick = this.handleLegendClick.bind(this);
        this.handleWindowSize = this.handleWindowSize.bind(this);
    }

    handleWindowSize(e, direction, ref, d){
        this.props.updateWindowSize(this.props.windowSize[0] + d.width, this.props.windowSize[1] + d.height);
    }

    handleLegendClick(event){
        const legendTitle = event.data[event.curveNumber].name;
        let xSignal, ySignal;
        [ySignal, xSignal] = legendTitle.split(" Vs ");
        console.log("xSignal = " + xSignal);
        console.log("ySignal = " + ySignal);
        this.props.updateSelectedLegend(xSignal, ySignal);
    }

    render(){
        let availableSignals = [];
        Object.keys(this.props.inputTraces).map(signalName => availableSignals.push(signalName));

        let xyPlots = [], xyPlot, visible; 
        this.props.xSignalsList.map(xSignalName => {
            if (availableSignals.indexOf(xSignalName) !== -1){
                this.props.ySignalsList.map(ySignalName => {

                    console.log(this.props.selectedLegend);
                    if (this.props.selectedLegend.length !==0){
                        if ((xSignalName === this.props.selectedLegend[0]) && (ySignalName === this.props.selectedLegend[1])){
                            visible = true;
                        }
                        else{
                            visible = 'legendonly';
                        }
                    }
                    else {
                        visible = true;
                    }

                    if (availableSignals.indexOf(ySignalName) !== -1){
                        xyPlot = resampleToSameTimeBase(this.props.inputTraces[xSignalName], this.props.inputTraces[ySignalName]);
                        xyPlots.push(new XYPlotTrace(
                            ( this.props.inputTraces[ySignalName].name + " Vs " + this.props.inputTraces[xSignalName].name),
                            xyPlot.trace1.data,
                            xyPlot.trace2.data,
                            this.props.inputTraces[xSignalName].signalUnit,
                            this.props.inputTraces[ySignalName].signalUnit,
                            this.props.inputTraces[ySignalName].color,
                            visible));
                    }
                });
            }
        });
        console.log(xyPlots);

        return(
            <div className="xy-plot-panel">
                <div className="xy-plot-display">
                    <Resizable style={{overflow: "scroll"}} 
                                size={{width: this.props.windowSize[0], height: this.props.windowSize[1]}} 
                                onResizeStop={this.handleWindowSize}>
                        <Plot data={xyPlots} onLegendDoubleClick={this.handleLegendClick}
                            layout={{
                                title : this.props.selectedLegend.length !== 0 ?
                                this.props.selectedLegend[1] + " Vs " + this.props.selectedLegend[0]:
                                "X-Y Plot",
                                width: this.props.windowSize[0]*0.8,
                                height: this.props.windowSize[1],
                                xaxis : {
                                    title: this.props.selectedLegend.length !== 0?
                                    this.props.selectedLegend[0] : "x signal"
                                },
                                yaxis : {
                                    title: this.props.selectedLegend.length !== 0?
                                    this.props.selectedLegend[1] : " y signal"
                                },
                            }}/>
                    </Resizable>
                </div>
                <div className="xy-plot-add-remove-signals">
                    <label>X Axis
                        <AddRemoveSignals key={"add_remove_" + Math.floor(Math.random()*1e20)} 
                                            availableSignals={availableSignals} 
                                            signalsList={this.props.xSignalsList}
                                            flexDirection="row"
                                            handleSignalsList={this.props.updateXYPlotXSignal}/>
                    </label>
                </div>
                <div className="xy-plot-add-remove-signals">
                    <label>Y Axis
                        <AddRemoveSignals key={"add_remove_" + Math.floor(Math.random()*1e20)} 
                                            availableSignals={availableSignals} 
                                            signalsList={this.props.ySignalsList}
                                            flexDirection="row"
                                            handleSignalsList={this.props.updateXYPlotYSignal}/>
                    </label>
                </div>
            </div>
        )
    }
}
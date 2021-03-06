import React from 'react';
import './ScatterPlot.css';
import {AddRemoveSignals} from '../utilities/AddRemoveSignals.js';
import Plotly from 'plotly.js-basic-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import {Resizable} from 're-resizable';
const Plot = createPlotlyComponent(Plotly);


export class ScatterPlotTrace{
    constructor(name, x, y, signalUnit, timeUnit, color, visible){
        this.name = name;
        this.y    = y;
        this.x    = x;
        this.type = 'scatter';
        this.mode = 'lines';
        this.signalUnit = signalUnit;
        this.timeUnit = timeUnit;
        this.visible = visible;
        this.line = {
            color: color,
            width: 1,
        };
    }
}

export class ScatterPlot extends React.Component {

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
        let availableSignals = [];
        Object.keys(this.props.inputTraces).map(signalName => availableSignals.push(signalName));
        let scatterPlots = [];
        let visible;

        this.props.signalsList.map(signalName => {
            visible = true;
            if ((this.props.selectedLegend !== '') && (this.props.selectedLegend !== signalName)){
                visible = 'legendonly';
            }

            if (availableSignals.indexOf(signalName) !== -1){
                scatterPlots.push(new ScatterPlotTrace(signalName,
                    this.props.inputTraces[signalName].time,
                    this.props.inputTraces[signalName].data,
                    this.props.inputTraces[signalName].signalUnit,
                    this.props.inputTraces[signalName].timeUnit,
                    this.props.inputTraces[signalName].color,
                    visible));
            }
        })

        return (
            <div className="scatter-plot-panel">
                <div className="scatter-plot-display">
                    <Resizable style={{overflow: "scroll"}} 
                            size={{width: this.props.windowSize[0], height: this.props.windowSize[1]}} 
                            onResizeStop={this.handleWindowSize}>
                        <Plot data={scatterPlots} onLegendDoubleClick={this.handleLegendClick}
                            layout={{
                                        width: this.props.windowSize[0]*0.8,
                                        height: this.props.windowSize[1],
                                        title: (this.props.selectedLegend !== '') ? 
                                                this.props.selectedLegend : 
                                                this.props.inputTraces[this.props.primarySignal].name, 
                                        xaxis: {
                                            title: "time (s)",
                                            domain: [0, 1]
                                        },
                                        yaxis: {
                                            title: (this.props.selectedLegend !== '') ?
                                                    this.props.selectedLegend + " (" +
                                                    this.props.inputTraces[this.props.selectedLegend].signalUnit + ")" :
                                                    this.props.inputTraces[this.props.primarySignal].name + " (" +
                                                    this.props.inputTraces[this.props.primarySignal].signalUnit + ")", 
                                            side: "left",
                                            position: 0,
                                        },

                        }}/>
                    </Resizable>
                </div>
                <div className="scatter-plot-add-remove-signals">
                    <AddRemoveSignals   key={"add_remove_" + Math.floor(Math.random()*1e20)}
                                        availableSignals={availableSignals} 
                                        signalsList={this.props.signalsList}
                                        flexDirection="row"
                                        handleSignalsList={this.props.updateScatterPlotSignslsList}/>
                </div>
            </div>
        );
    }
}
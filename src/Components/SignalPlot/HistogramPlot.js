import React from 'react';
import './HistogramPlot.css';
import Plotly from 'plotly.js-basic-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import { AddRemoveSignals } from '../utilities/AddRemoveSignals';
import {Resizable} from 're-resizable';
const Plot = createPlotlyComponent(Plotly);

export function dataCount(data, nBins){
    const min = data.reduce((a, b) => a < b? a: b);
    const max = data.reduce((a, b) => a > b? a: b);
    const interval = (max - min)/nBins;
    let limitArr = [];
    let lim;
    for (lim = min; lim < max; lim = lim + interval){
        limitArr.push({
            min: lim,
            max: lim + interval,
            count: 0,
            value: lim + interval/2,
        })
    }

    let i, j;
    for (i = 0; i < data.length; i++){
        for (j = 0; j < limitArr.length; j++){
            if ((data[i] >= limitArr[j].min) && (data[i] < limitArr[j].max)){
                limitArr[j].count ++;
            }
        }
    }

    let x = [], y = [];

    limitArr.map(element => {
        x.push(element.value);
        y.push(element.count);
    })

    return ({
        x: x,
        y: y
    });
}


export class HistogramPlotTrace {
    constructor(name, x, y, color, visible){
        this.name = name;
        this.x    = x;
        this.y    = y;
        this.type = 'bar';
        this.marker = {
            color: color,
        };
        this.visible = visible;
    }
}

export class HistogramPlot extends React.Component {

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
        const nBins = 20;
        const availableSignals = Object.keys(this.props.inputTraces);
        let histogramTraces = [], count, visible;
        this.props.signalsList.map(signalName => {
            visible = true;
            if ((this.props.selectedLegend !== '') && (this.props.selectedLegend !== signalName)){
                visible = 'legendonly';
            }

            if (availableSignals.indexOf(signalName) !== -1){
                count = dataCount(this.props.inputTraces[signalName].data, nBins);
                histogramTraces.push(new HistogramPlotTrace(signalName, count.x, count.y, this.props.inputTraces[signalName].color, visible));
            }
        });

        return (
            <div className="histogram-plot-panel">
                <div className="histogram-plot-display">
                    <Resizable style={{overflow: "scroll"}} 
                            size={{width: this.props.windowSize[0], height: this.props.windowSize[1]}} 
                            onResizeStop={this.handleWindowSize}>
                        <Plot data={histogramTraces} onLegendDoubleClick={this.handleLegendClick}
                            layout={{
                                title: (this.props.selectedLegend !== '') ? 
                                                this.props.selectedLegend : 
                                                this.props.inputTraces[this.props.primarySignal].name, 
                                width: this.props.windowSize[0]*0.8,
                                height: this.props.windowSize[1],
                                xaxis: {
                                    title: (this.props.selectedLegend !== '') ?
                                                    this.props.selectedLegend + " (" +
                                                    this.props.inputTraces[this.props.selectedLegend].signalUnit + ")" :
                                                    this.props.inputTraces[this.props.primarySignal].name + " (" +
                                                    this.props.inputTraces[this.props.primarySignal].signalUnit + ")", 
                                },
                                yaxis: {
                                    title: 'number of occurences',
                                }
                            }}
                        />
                    </Resizable>
                </div>
                <div className="histogram-plot-add-remove-signals">
                    <AddRemoveSignals key={"add_remove_" + Math.floor(Math.random()*1e20)}
                                    primarySignal={this.props.primarySignal}
                                    availableSignals={availableSignals}
                                    signalsList={this.props.signalsList}
                                    flexDirection="row"
                                    handleSignalsList={this.props.updateHistogramPlotSignalsList}/>
                </div>
            </div>
            );
    }
}
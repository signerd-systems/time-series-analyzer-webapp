import React from 'react';
import './SignalPanel.css';
import {ScatterPlot} from '../SignalPlot/ScatterPlot.js';
import {HistogramPlot} from '../SignalPlot/HistogramPlot.js';
import {FFTPlot} from '../SignalPlot/FFTPlot.js';
import {XYPlot} from '../SignalPlot/XYPlot.js';
import {MovingWindowAverage} from '../SignalProcessing/MovingWindowAverage.js';
import {LinearTransformation} from '../SignalProcessing/LinearTransformation.js';
import {SignalDerivative} from '../SignalProcessing/SignalDerivative.js';
import {Resizable} from 're-resizable';

export class SignalPanel extends React.Component {
    //SignalPanel is going to receive all data being provided by data set and the primary signal passed by App.js
    constructor(props){
        super(props);
        this.state = {
            scatterPlotSignalsList: [this.props.primarySignal, ],
            scatterPlotSelectedLegend: '',
            scatterPlotWindowSize: [500, 300],

            histogramPlotSignalsList: [this.props.primarySignal, ],
            histogramPlotSelectedLegend: '',
            histogramPlotWindowSize: [500, 300],

            fftPlotSignalsList : [this.props.primarySignal, ],
            fftPlotSelectedLegend: '',
            fftPlotWindowSize: [500, 300],

            xSignalsList: [this.props.primarySignal, ],
            ySignalsList: [this.props.primarySignal, ],
            xyPlotSelectedLegend: [],
            xyPlotWindowSize: [500, 300],

            activeAnalysisMethods: [],
            analysisPanels: {},
            activeSignalManipulationMethods: [],
            signalManipulationPanels: {},
            movingWindowAverageSignalsList: [],
            movingWindowAverageWindowSizes: {},
            linearTransformParams: {},
            linearTransformationSignalsList: [],
            derivativeTimes: {},
            signalDerivativeSignalsList: [],
            windowHeight: 600,
            windowWidth: 400,
        };

        this.addAnalysisMethod = this.addAnalysisMethod.bind(this);
        this.addAnalysisPanel = this.addAnalysisPanel.bind(this);
        this.removeSignalAnalysisPanel = this.removeSignalAnalysisPanel.bind(this);

        this.addManipulationMethod = this.addManipulationMethod.bind(this);
        this.addSignalManipulationDropDownList = this.addSignalManipulationDropDownList.bind(this);
        this.removeSignalManipulationPanel = this.removeSignalManipulationPanel.bind(this);

        this.analysisMethods = {
            'Histogram Plot':        'addHistogramPlot',
            'FFT Plot':              'addFFTPlot',
            'X-Y Plot':              'addXYPlot'};
        
        this.signalManipulationMethods = {
            'Linear Transformation': 'addLinearTransformationPanel', 
            'Moving Window Average': 'addMovingWindowAveragePanel',
            'Signal Derivative':     'addSignalDerivativePanel'
        };

        this.updateAnalyisPanel = this.updateAnalyisPanel.bind(this);
        this.updateSignalManipulationPanel = this.updateSignalManipulationPanel.bind(this);

        this.addScatterPlot = this.addScatterPlot.bind(this);
        this.addHistogramPlot = this.addHistogramPlot.bind(this);
        this.addFFTPlot = this.addFFTPlot.bind(this);
        this.addXYPlot  = this.addXYPlot.bind(this);
        this.addLinearTransformationPanel = this.addLinearTransformationPanel.bind(this);
        this.addMovingWindowAveragePanel = this.addMovingWindowAveragePanel.bind(this);
        this.addSignalDerivativePanel = this.addSignalDerivativePanel.bind(this);

        this.updateScatterPlotSignslsList = this.updateScatterPlotSignslsList.bind(this);
        this.updateScatterPlotSelectedLegend = this.updateScatterPlotSelectedLegend.bind(this);
        this.updateScatterPlotWindowSize = this.updateScatterPlotWindowSize.bind(this);

        this.updateHistogramPlotSignalsList = this.updateHistogramPlotSignalsList.bind(this);
        this.updateHistogramPlotSelectedLegend = this.updateHistogramPlotSelectedLegend.bind(this);
        this.updateHistogramPlotWindowSize = this.updateHistogramPlotWindowSize.bind(this);

        this.updateFFTPlotSignalsList = this.updateFFTPlotSignalsList.bind(this);
        this.updateFFTPlotSelectedLegend = this.updateFFTPlotSelectedLegend.bind(this);
        this.updateFFTPlotWindowSize = this.updateFFTPlotWindowSize.bind(this);

        this.updateXYPlotXSignal = this.updateXYPlotXSignal.bind(this);
        this.updateXYPlotYSignal = this.updateXYPlotYSignal.bind(this);
        this.updateXYPlotSelectedLegend = this.updateXYPlotSelectedLegend.bind(this);
        this.updateXYPlotWindowSize = this.updateXYPlotWindowSize.bind(this);

        this.handleMovingWindowAverageSignalsList = this.handleMovingWindowAverageSignalsList.bind(this);
        this.handleMovingWindowAverageWindowSize = this.handleMovingWindowAverageWindowSize.bind(this);
        this.handleMovingWindowAverageTrace = this.handleMovingWindowAverageTrace.bind(this);

        this.handleLinearTransformSignalsList = this.handleLinearTransformSignalsList.bind(this);
        this.handleLinearTransformParams = this.handleLinearTransformParams.bind(this);
        this.handleLinearTransformTrace = this.handleLinearTransformTrace.bind(this);

        this.handleSignalDerivativeSignalsList = this.handleSignalDerivativeSignalsList.bind(this);
        this.handleSignalDerivativeTime = this.handleSignalDerivativeTime.bind(this);
        this.handleSignalDerivativeTrace = this.handleSignalDerivativeTrace.bind(this);
        this.handleWindowSize = this.handleWindowSize.bind(this);
    }

    handleWindowSize(e, direction, ref, d){
        let windowWidth = this.state.windowWidth + d.width;
        let windowHeight = this.state.windowHeight + d.height;

        this.setState({
            windowWidth: windowWidth,
            windowHeight: windowHeight,
            scatterPlotWindowSize: [windowWidth, this.state.scatterPlotWindowSize[1]],
            histogramPlotWindowSize: [windowWidth, this.state.histogramPlotWindowSize[1]],
            fftPlotWindowSize: [windowWidth, this.state.fftPlotWindowSize[1]],
            xyPlotWindowSize: [windowWidth, this.state.xyPlotWindowSize[1]],
        });
        if (this.state.activeAnalysisMethods.indexOf('Histogram Plot') !== -1){
            this.addHistogramPlot();
        }
        if (this.state.activeAnalysisMethods.indexOf('FFT Plot') !== -1){
            this.addFFTPlot();
        }
        if (this.state.activeAnalysisMethods.indexOf('X-Y Plot') !== -1){
            this.addXYPlot();
        }

    }

    updateScatterPlotSignslsList(signalsList){
        this.setState({scatterPlotSignalsList: signalsList});
    }

    updateScatterPlotSelectedLegend(signalName){
        this.setState({scatterPlotSelectedLegend: signalName});
    }

    updateScatterPlotWindowSize(width, height){
        this.setState({scatterPlotWindowSize: [width, height]});
    }

    updateHistogramPlotSignalsList(signalsList){
        this.setState({histogramPlotSignalsList: signalsList});
        this.addHistogramPlot();
    }

    updateHistogramPlotSelectedLegend(signalName){
        this.setState({histogramPlotSelectedLegend: signalName});
        this.addHistogramPlot();
    }

    updateHistogramPlotWindowSize(width, height){
        this.setState({histogramPlotWindowSize: [width, height]});
        this.addHistogramPlot();
    }

    updateFFTPlotSignalsList(signalsList){
        this.setState({fftPlotSignalsList: signalsList});
        this.addFFTPlot();
    }

    updateFFTPlotSelectedLegend(signalName){
        this.setState({fftPlotSelectedLegend: signalName});
        this.addFFTPlot();
    }

    updateFFTPlotWindowSize(width, height){
        this.setState({fftPlotWindowSize: [width, height]});
        this.addFFTPlot();
    }

    updateXYPlotXSignal(signalsList){
        this.setState({xSignalsList: signalsList});
        this.addXYPlot();
    }

    updateXYPlotWindowSize(height, width){
        this.setState({xyPlotWindowSize: [width, height]});
        this.addXYPlot();
    }

    updateXYPlotYSignal(signalsList){
        this.setState({ySignalsList: signalsList});
        this.addXYPlot();
    }

    updateXYPlotSelectedLegend(xSignal, ySignal){
        this.setState({xyPlotSelectedLegend: [xSignal, ySignal]});
        this.addXYPlot();
    }

    /*Moving Window Average handles block */

    handleMovingWindowAverageSignalsList(signalsList, signalAdded, signalRemoved){
        if (Object.keys(this.props.inputTraces).indexOf('MovingWindowAvg_' + signalRemoved) !== -1){
            this.props.removeTrace('MovingWindowAvg_' + signalRemoved);
        }
        this.addMovingWindowAveragePanel();
    }

    handleMovingWindowAverageWindowSize(windowSizes){
        this.setState({movingWindowAverageWindowSizes: windowSizes});
        this.addMovingWindowAveragePanel();
    }

    handleMovingWindowAverageTrace(newTrace){
        this.props.updateTraces(newTrace);
    }

    /*LinearTransformation handles block*/

    handleLinearTransformSignalsList(signalsList, signalAdded, signalRemoved){
        if (Object.keys(this.props.inputTraces).indexOf('LinearTransform_' + signalRemoved) !== -1){
            this.props.removeTrace('LinearTransform_' + signalRemoved);
        }
        this.addLinearTransformationPanel();
    };

    handleLinearTransformParams(signalName, key, value){
        let currentLinearTransformParams = this.state.linearTransformParams;
        if ((Object.keys(currentLinearTransformParams).indexOf(signalName) === -1)){
            currentLinearTransformParams[signalName] =  {};
        }
        currentLinearTransformParams[signalName][key] = value;
        this.setState({linearTransformParams: currentLinearTransformParams});
    }

    handleLinearTransformTrace(newTrace){
        this.props.updateTraces(newTrace);
    }

    /*SignalDerivative handles block*/

    handleSignalDerivativeSignalsList(signalsList, signalAdded, signalRemoved){
        if (Object.keys(this.props.inputTraces).indexOf('Derivative_' + signalRemoved) !== -1){
            this.props.removeTrace('Derivative_' + signalRemoved);
        }
        this.addSignalDerivativePanel();
    }

    handleSignalDerivativeTime(derivativeTimes){
        this.setState({derivativeTimes: derivativeTimes});
    }

    handleSignalDerivativeTrace(newTrace){
        this.props.updateTraces(newTrace);
    }

    addAnalysisMethod(event){
        let activeAnalysisMethods = this.state.activeAnalysisMethods;
        const newAnalysisMethod = event.target.value;

        if (activeAnalysisMethods.indexOf(newAnalysisMethod) === -1){
            activeAnalysisMethods.push(newAnalysisMethod);

            eval("this." + this.analysisMethods[newAnalysisMethod])();
        }
    }

    addAnalysisPanel(){
        let analysisMethodsOptions = [];
        Object.keys(this.analysisMethods).map(key => 
            analysisMethodsOptions.push(<option key={'analysis_method_' + Math.floor(Math.random()*1e20)}>{key}</option>));
        return(
            <div className="add-analysis-panel">
                <select className="analysis-selection" name="analysis-method" onChange={this.addAnalysisMethod}>
                    <option value=''>--add analysis method--</option>
                    {analysisMethodsOptions}
                </select>
            </div>
        );
    }

    removeSignalAnalysisPanel(event){
        const removePanelKey = event.target.name;
        let analysisPanels = this.state.analysisPanels;
        delete(analysisPanels[removePanelKey]);

        let activeAnalysisMethods = this.state.activeAnalysisMethods;
        activeAnalysisMethods.splice(activeAnalysisMethods.indexOf(removePanelKey), 1);

        this.setState({analysisPanels: analysisPanels,
                       activeAnalysisMethods: activeAnalysisMethods});
    }

    updateAnalyisPanel(analysisPanelObj){
        let analysisPanels = this.state.analysisPanels;
        analysisPanels[analysisPanelObj['key']] = analysisPanelObj;
        this.setState({analysisPanels: analysisPanels});

    }

    addManipulationMethod(event){
        /*based on the value received from addSignalManipulationDropDownList it call the corresponding add function for that analysis method */
        let activeSignalManipulationMethods = this.state.activeSignalManipulationMethods;
        const newSignalManipulationMethod = event.target.value;

        if (activeSignalManipulationMethods.indexOf(newSignalManipulationMethod) === -1){
            activeSignalManipulationMethods.push(newSignalManipulationMethod);

            eval("this." + this.signalManipulationMethods[newSignalManipulationMethod])();
        }
    }

    addSignalManipulationDropDownList(){
        /* addSignalManipulationDropDownList : goes through all available signalManipulationOptions and creates 
        drop down list of manipulation options, upon selecting any one of them addManipulationMethod is triggered*/
        let signalsManipulationOptions = [];
        Object.keys(this.signalManipulationMethods).map(key => 
            signalsManipulationOptions.push(<option key={'manipulation_method_' + Math.floor(Math.random()*1e20)}>{key}</option>));
        return (
            <div className="add-signal-manipulation-panel">
                <select className="signal-manipulation-selection" 
                        name="manipulation-method" 
                        onChange={this.addManipulationMethod}>
                    <option value=''>--add signal manipulation</option>
                    {signalsManipulationOptions}
                </select>
            </div>
        )
    }

    removeSignalManipulationPanel(event){
        const removePanelKey = event.target.name;
        //remove the panel from state
        let signalManipulationPanels = this.state.signalManipulationPanels;
        delete(signalManipulationPanels[removePanelKey]);

        let activeSignalManipulationMethods = this.state.activeSignalManipulationMethods;
        activeSignalManipulationMethods.splice(activeSignalManipulationMethods.indexOf(removePanelKey), 1);

        this.setState({signalManipulationPanels:        signalManipulationPanels,
                       activeSignalManipulationMethods: activeSignalManipulationMethods});
    }

    updateSignalManipulationPanel(signalManipulationPanelObj){
        let signalManipulationPanels = this.state.signalManipulationPanels;
        signalManipulationPanels[signalManipulationPanelObj['key']] = signalManipulationPanelObj;
        this.setState({signalManipulationPanels: signalManipulationPanels});
    }

    addScatterPlot(){
        return (
        <div className="primary-signal-plot">
            <ScatterPlot key={'scatter_' + Math.floor(Math.random()*1e20)}
                         inputTraces={this.props.inputTraces} 
                         primarySignal={this.props.primarySignal}
                         signalsList={this.state.scatterPlotSignalsList}
                         updateScatterPlotSignslsList={this.updateScatterPlotSignslsList}
                         selectedLegend={this.state.scatterPlotSelectedLegend}
                         updateSelectedLegend={this.updateScatterPlotSelectedLegend}
                         windowSize={this.state.scatterPlotWindowSize}
                         updateWindowSize={this.updateScatterPlotWindowSize}/>
        </div>);

    }

    addHistogramPlot(){
        const panelKey = 'Histogram Plot';
        this.updateAnalyisPanel({
            key: panelKey,
            jsx: (
                <div className="histogram-plot-analysis-panel">
                    <input className="remove-signal-analysis-panel"
                       key={"remove_signal_analysis_panel_" + Math.floor(Math.random()*1e20)}
                       type="button"
                       value={panelKey + '  [X]  '}
                       name={panelKey}
                       onClick={this.removeSignalAnalysisPanel}>
                    </input>                    
                    <HistogramPlot key={'hist_' + Math.floor(Math.random()*1e20)} 
                                   inputTraces={this.props.inputTraces}
                                   primarySignal={this.props.primarySignal} 
                                   signalsList={this.state.histogramPlotSignalsList}
                                   updateHistogramPlotSignalsList={this.updateHistogramPlotSignalsList}
                                   selectedLegend={this.state.histogramPlotSelectedLegend}
                                   updateSelectedLegend={this.updateHistogramPlotSelectedLegend}
                                   windowSize={this.state.histogramPlotWindowSize}
                                   updateWindowSize={this.updateHistogramPlotWindowSize}/>
                </div>)
        });
    }

    addFFTPlot(){
        const panelKey = 'FFT Plot';
        this.updateAnalyisPanel({
            key: panelKey,
            jsx: (
                <div className="fft-plot-analysis-panel">
                    <input className="remove-signal-analysis-panel"
                       key={"remove_signal_analysis_panel_" + Math.floor(Math.random()*1e20)}
                       type="button"
                       value={panelKey + '  [X]  '}
                       name={panelKey}
                       onClick={this.removeSignalAnalysisPanel}>
                    </input>
                    <FFTPlot key={'fft_' + Math.floor(Math.random()*1e20)}
                             inputTraces={this.props.inputTraces}
                             primarySignal={this.props.primarySignal}
                             signalsList={this.state.fftPlotSignalsList}
                             updateFFTPlotSignalsList={this.updateFFTPlotSignalsList}
                             selectedLegend={this.state.fftPlotSelectedLegend}
                             updateSelectedLegend={this.updateFFTPlotSelectedLegend}
                             windowSize={this.state.fftPlotWindowSize}
                             updateWindowSize={this.updateFFTPlotWindowSize}/>
                </div>
            )
        })
    }

    addXYPlot(){
        const panelKey = 'X-Y Plot';
        this.updateAnalyisPanel({
            key: panelKey,
            jsx: (
                <div className="xy-plot-analysis-panel">
                    <input className="remove-signal-analysis-panel"
                       key={"remove_signal_analysis_panel_" + Math.floor(Math.random()*1e20)}
                       type="button"
                       value={panelKey + '  [X]  '}
                       name={panelKey}
                       onClick={this.removeSignalAnalysisPanel}>
                    </input>
                    <XYPlot key={'xy_' + Math.floor(Math.random()*1e20)}
                            inputTraces={this.props.inputTraces}
                            primarySignal={this.props.primarySignal}
                            xSignalsList={this.state.xSignalsList}
                            ySignalsList={this.state.ySignalsList}
                            updateXYPlotXSignal={this.updateXYPlotXSignal}
                            updateXYPlotYSignal={this.updateXYPlotYSignal}
                            selectedLegend={this.state.xyPlotSelectedLegend}
                            updateSelectedLegend={this.updateXYPlotSelectedLegend}
                            windowSize={this.state.xyPlotWindowSize}
                            updateWindowSize={this.updateXYPlotWindowSize}/>
                </div>
            )
        })
    }

    addMovingWindowAveragePanel(){
        const panelKey = 'Moving Window Average';
        this.updateSignalManipulationPanel ({
            key: panelKey,
            jsx: (
            <div className="signal-manipulation-panel">
                <input className="remove-signal-manipulation-panel"
                       key={"remove_signal_manipulation_panel_" + Math.floor(Math.random()*1e20)}
                       type="button"
                       value={panelKey + '  [X]  '}
                       name={panelKey}
                       onClick={this.removeSignalManipulationPanel}>
                </input>
                <MovingWindowAverage key={"moving_window_average_" + Math.floor(Math.random()*1e20)}
                                     inputTraces={this.props.inputTraces}
                                     signalsList={this.state.movingWindowAverageSignalsList}
                                     windowSizes={this.state.movingWindowAverageWindowSizes}
                                     handleSignalsList={this.handleMovingWindowAverageSignalsList}
                                     handleWindowSize={this.handleMovingWindowAverageWindowSize}
                                     handleMovingWindowAverageTrace={this.handleMovingWindowAverageTrace}/>
            </div>)
        });
    }

    addSignalDerivativePanel(){
        const panelKey = 'Signal Derivative';
        this.updateSignalManipulationPanel({
            key: panelKey,
            jsx: (
            <div class="signal-manipulation-panel">
                <input className="remove-signal-manipulation-panel"
                       key={"remove_signal_manipulation_panel_" + Math.floor(Math.random()*1e20)}
                       type="button"
                       value={panelKey + '  [X]  '}
                       name={panelKey}
                       onClick={this.removeSignalManipulationPanel}>
                </input>                
                <SignalDerivative key={"signal_derivative_" + Math.floor(Math.random()*1e20)}
                                  inputTraces={this.props.inputTraces}
                                  signalsList={this.state.signalDerivativeSignalsList}
                                  handleSignalsList={this.handleSignalDerivativeSignalsList}
                                  derivativeTimes={this.state.derivativeTimes}
                                  handleSignalDerivativeTime={this.handleSignalDerivativeTime}
                                  handleSignalDerivativeTrace={this.handleSignalDerivativeTrace}/>
            </div>)
        }
        )
    }

    addLinearTransformationPanel(){
        const panelKey = 'Linear Transformation';
        this.updateSignalManipulationPanel({
            key: panelKey,
            jsx: (
            <div class="signal-manipulation-panel">
                <input className="remove-signal-manipulation-panel"
                       key={"remove_signal_manipulation_panel_" + Math.floor(Math.random()*1e20)}
                       type="button"
                       value={panelKey + '  [X]  '}
                       name={panelKey}
                       onClick={this.removeSignalManipulationPanel}>
                </input>                 
                <LinearTransformation key={'linear_transformation_' + Math.floor(Math.floor()*1e20)}
                                      inputTraces={this.props.inputTraces}
                                      signalsList={this.state.linearTransformationSignalsList}
                                      linearTransformParams={this.state.linearTransformParams}
                                      handleSignalsList={this.handleLinearTransformSignalsList}
                                      updateLinearTransParams={this.handleLinearTransformParams}
                                      handleLinearTransformTrace={this.handleLinearTransformTrace}/>
            </div>)
        })
    }


    render(){
        return(
            <Resizable style={{border: "1px solid gray", overflow: "scroll"}} size={{width: this.state.width, height: this.state.height}} onResizeStop={this.handleWindowSize}>
                <div className="signal-panel">
                    <p className="signal-panel-heading">Signal Panel for {this.props.primarySignal}</p>
                    <div className="signal-display">
                        {this.addScatterPlot()}
                    </div>
                    <div className="signal-manipulation-analysis-panel">
                        {this.addSignalManipulationDropDownList()} 
                        {this.addAnalysisPanel()}
                    </div>
                    {Object.keys(this.state.signalManipulationPanels).map(key => this.state.signalManipulationPanels[key]['jsx'])}
                    {Object.keys(this.state.analysisPanels).map(key => this.state.analysisPanels[key]['jsx'])}
                    <hr/>
                    <br/>
                </div>
            </Resizable>
        );
    }
}
import React from 'react';
import './TimeSeriesAnalyzer.css';
import {ImportJsonData} from '../ImportJsonData/ImportJsonData.js';
import {DataTable} from '../DataTable/DataTable.js';
import {SignalPanel} from '../SignalPanel/SignalPanel';

export class TimeSeriesAnalyzer extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      inputTraces:    [],
      signalPanels: {},
      userSelectedSignals: [],
    }
    this.handleInputData = this.handleInputData.bind(this);
    this.handleSignal    = this.handleSignal.bind(this);
    this.removeTrace     = this.removeTrace.bind(this);
  }

  handleInputData(inputTraces){
    let currentInputTraces = this.state.inputTraces;
    Object.keys(inputTraces).map(signalName => {
      currentInputTraces[signalName] = inputTraces[signalName];
    })
    this.setState({inputTraces: currentInputTraces});
  }

  removeTrace(traceName){
    let currentInputTraces = this.state.inputTraces;
    delete(currentInputTraces[traceName]);

    let currentSignalPanels = this.state.signalPanels;
    delete(currentSignalPanels[traceName]);

    let currentUserSelectedSignals = this.state.userSelectedSignals;
    if (currentUserSelectedSignals.indexOf(traceName) !== -1){
      currentUserSelectedSignals.splice(currentUserSelectedSignals.indexOf(traceName), 1);
    }

    this.setState({inputTraces: currentInputTraces,
                   signalPanels: currentSignalPanels,
                   userSelectedSignals: currentUserSelectedSignals});
  }

  handleSignal(newSignal){
    let userSelectedSignals = this.state.userSelectedSignals;
    let signalPanels = this.state.signalPanels;

    if (userSelectedSignals.indexOf(newSignal) === -1){
        userSelectedSignals.push(newSignal);
        signalPanels[newSignal] = {
          jsx: (
            <div key={'signal_panel_' + Math.floor(Math.random()*1e20)} className="signal-panel">
              <SignalPanel primarySignal={newSignal} 
                           inputTraces={this.state.inputTraces}
                           updateTraces={this.handleInputData}
                           removeTrace={this.removeTrace}/>
            </div>
          )
        }
    }
    else{
        userSelectedSignals.splice(userSelectedSignals.indexOf(newSignal),1);
        delete(signalPanels[newSignal]);
    }
    this.setState({userSelectedSignals: userSelectedSignals});

  }

  render(){
    return (
      <div className="time-series-analysis-main">
        <hr style={{width: "100vw"}}/>
        <div className="load-measurement-and-tutorial">
          <div className="import-json-data-display">
            <ImportJsonData handleInputData={this.handleInputData} />
          </div>
        </div>
        <div className="data-table-display">
          <DataTable inputTraces={this.state.inputTraces} 
                    handleSignal={this.handleSignal}
                    removeTrace={this.removeTrace} />
        </div>
        <div className="signal-panel-display">
          {Object.keys(this.state.signalPanels).map(key=> this.state.signalPanels[key]['jsx'])}
        </div>
      </div>
    );
  }
}


export default TimeSeriesAnalyzer;

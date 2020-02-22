import React from 'react';
import './ImportJsonData.css';


export class Trace{
    constructor(name, data, time, signalUnit, timeUnit, samplingTime, description){
        let colorIndices = [];
        Array(3).fill().map(() => colorIndices.push(Math.floor(Math.random()*256)));
        let color         = "rgb(" + colorIndices.join(',') + ")";
        this.name         = name;
        this.data         = data;
        this.time         = time;
        this.samplingTime = samplingTime;
        this.signalUnit   = signalUnit;
        this.timeUnit     = timeUnit;
        this.color        = color;
        this.description  = description;
    }
}

export class ImportJsonData extends React.Component {
    constructor(props){
        super(props);
        this.handleInputDataFile = this.handleInputDataFile.bind(this);
    }

    async handleInputDataFile(event){
        const filepath = event.target.files[0];
        const fileurl  = URL.createObjectURL(filepath);
        const response = await fetch(fileurl);
        const jsonResponse = await response.json();
        const inputTraces = {};
        const singalNames = Object.keys(jsonResponse);
        let signalData, trace;
        singalNames.map(signalName => {
            signalData = jsonResponse[signalName];
            trace      = new Trace(signalData.name, 
                                   signalData.data, 
                                   signalData.time, 
                                   signalData.signalUnit, 
                                   signalData.timeUnit, 
                                   signalData.samplingTime,
                                   signalData.description);
            inputTraces[signalName] = trace;
        });

        this.props.handleInputData(inputTraces);
    }

    exploreJsonFile(){
        document.getElementById('json-file-input').click();
    }

    render(){
        return (
            <div className="import-json">
                <input id="json-file-input"
                       key={'json_' + Math.floor(Math.random()*1e20)} 
                       type="file" 
                       accept="*.json" 
                       onChange={this.handleInputDataFile}
                       style={{display: 'none'}}
                />
                <input className="import-json-button"
                       key={'json_button_' + Math.floor(Math.random()*1e20)}
                       type="button"
                       value="add measurement file"
                       onClick={this.exploreJsonFile}
                />
                <br/>
            </div>
        );
    }
}
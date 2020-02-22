import React from 'react';
import './TimeSeriesAnalyzerTutorial.css';
import DownloadLink from 'react-download-link';
import sampleData from './generated_signals.json';

export class TimeSeriesAnalyzerTutorial extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className="time-series-analyzer-tutorial">
                <p className="tutorial-heading"><em>Time Series Analyzer Tutorial</em></p>
                <div className="tutorial-content-heading">Data Format</div>
                <div className="tutorial-content">
                    <div className="tutorial-content-image"><img src="https://signerd-images.s3-us-west-1.amazonaws.com/time-series-analyzer/measurement_data_format.jpg"/></div>
                    <div className="tutorial-content-description">
                        <p>
                            Measurement Time Series Data is expected in JSON file format in key-value format. Key being the signal name and value being object with properties name, time, data, samplingTime, description, timeUnit and signalUnit.
                        </p>
                        <DownloadLink filename="generated_signals.json" 
                                  exportFile={()=> JSON.stringify(sampleData)}
                                  label="Download Sample Data"/>
                    </div>
                </div>
                <div className="tutorial-content-heading">Demo</div>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/u_d9QtsDIIw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        );
    }
}
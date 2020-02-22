import React from 'react';
import './LinearTransformation.css';
import { AddRemoveSignals } from '../utilities/AddRemoveSignals';
import {Trace} from '../ImportJsonData/ImportJsonData.js';

export class LinearTransformation extends React.Component {
    constructor(props){
        super(props);
        this.updateFactor = this.updateFactor.bind(this);
        this.updateOffset = this.updateOffset.bind(this);
        this.calculateLinearTransformation= this.calculateLinearTransformation.bind(this);
    }

    calculateLinearTransformation(signalName){
        let trace = this.props.inputTraces[signalName];
        let offset, factor;
    
        if (this.props.linearTransformParams[signalName]){
            if (this.props.linearTransformParams[signalName]['offset']){
                offset = Number(this.props.linearTransformParams[signalName]['offset']);
            }
            else{
                offset = 0;
            }
            if (this.props.linearTransformParams[signalName]['factor']){
                factor = Number(this.props.linearTransformParams[signalName]['factor']);
            }
            else{
                factor = 1;
            }
        }
        let linearTransformData = [];
        trace.data.map(element => linearTransformData.push(element*factor + offset));
        let linearTransformTrace = {};
        let traceName = "LinearTransform_" + trace.name;

        linearTransformTrace[traceName] = new Trace(
                                                traceName,
                                                linearTransformData,
                                                trace.time,
                                                trace.signalUnit,
                                                trace.timeunit,
                                                trace.samplingTime,
                                                trace.name + ' with linear transformation with factor = ' + factor + ' and offset = ' + offset,
        );
        this.props.handleLinearTransformTrace(linearTransformTrace);
    }    

    updateFactor(event){
        let signalName, factorValue, linearTransformationTrace;
        if (event.keyCode === 13 || event.keyCode === 9){
            signalName = event.target.name;
            factorValue = event.target.value;
            this.props.updateLinearTransParams(signalName, 'factor', factorValue);
            this.calculateLinearTransformation(signalName);
        }
    }

    updateOffset(event){
        let signalName, offsetValue;
        if (event.keyCode === 13 || event.keyCode === 9){
            signalName = event.target.name;
            offsetValue = event.target.value;
            this.props.updateLinearTransParams(signalName, 'offset', offsetValue);
            this.calculateLinearTransformation(signalName);
        }
    }

    render(){
        let availableSignals = [];
        Object.keys(this.props.inputTraces).map(signalName => availableSignals.push(signalName));

        let linearTransParams = {};

        this.props.signalsList.map(signalName => {
            linearTransParams[signalName] = (
                <tr>
                    <td>{signalName}</td>
                    <td><input type="number"
                            key={"linearTrans_factor_" + Math.floor(Math.random()*1e20)}
                            name={signalName}
                            placeholder={this.props.linearTransformParams[signalName]? 
                                (this.props.linearTransformParams[signalName]['factor'] ? this.props.linearTransformParams[signalName]['factor']: "factor") : "factor"}
                            onKeyDown={this.updateFactor}>
                    </input></td>
                    <td><input type="number"
                            key={"linearTrans_factor_" + Math.floor(Math.random()*1e20)}
                            name={signalName}
                            placeholder={this.props.linearTransformParams[signalName]? 
                            (this.props.linearTransformParams[signalName]['offset'] ? this.props.linearTransformParams[signalName]['offset']: "offset") : "offset"}
                            onKeyDown={this.updateOffset}>
                    </input></td>
                </tr>
            )
        });
        return (
            <div className="linear-transform-panel">
                <AddRemoveSignals key={'add_remove_' + Math.floor(Math.random()*1e20)}
                                  availableSignals={availableSignals}
                                  flexDirection="row"
                                  signalsList={this.props.signalsList}
                                  handleSignalsList={this.props.handleSignalsList}/>
                {Object.keys(linearTransParams).map(signalName => {
                    return (
                    <div>
                        {linearTransParams[signalName]}
                    </div>)
                })}
            </div>
        )
    }
}
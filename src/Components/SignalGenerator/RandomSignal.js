class RandomSignal{
    constructor(amplitude, startTime, stopTime, samplingTime, name, description, timeUnit, signalUnit){
        this.startTime    = startTime;
        this.stopTime     = stopTime;
        this.samplingTime = samplingTime;
        this.amplitude    = amplitude;
        this.name         = name;
        this.description  = description;
        this.timeUnit = timeUnit;
        this.signalUnit = signalUnit;
    }

    generate(){
        let timeArraySize = Math.floor((this.stopTime - this.startTime)/this.samplingTime + 1);
        let timeArray = [];
        Array(timeArraySize).fill().map((x,i) => timeArray.push(i * this.samplingTime));
        let dataArray = [];
        timeArray.map(() => dataArray.push((Math.random() * this.amplitude)*2 - 1));
        return {
            name: this.name,
            time: timeArray,
            data: dataArray,
            samplingTime: this.samplingTime,
            description: this.description,
            timeUnit: this.timeUnit,
            signalUnit: this.signalUnit,
        }
    }
}

exports.RandomSignal = RandomSignal;
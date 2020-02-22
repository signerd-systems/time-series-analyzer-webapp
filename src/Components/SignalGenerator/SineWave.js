class SineWave {
    constructor(amplitude, frequency, startTime, stopTime, samplingTime, name, description, timeUnit, signalUnit){
        this.amplitude = amplitude;
        this.frequency = frequency;
        this.startTime = startTime;
        this.stopTime = stopTime;
        this.samplingTime = samplingTime;
        this.name = name;
        this.description = description;
        this.timeUnit = timeUnit;
        this.signalUnit = signalUnit;
    }

    generate(){
        let timeArraySize = Math.floor((this.stopTime - this.startTime)/this.samplingTime + 1);
        let timeArray = [];
        Array(timeArraySize).fill().map((x, i) => timeArray.push(i*this.samplingTime));
        timeArray.map(x => x + this.startTime);
        let dataArray = [];
        timeArray.map(t => dataArray.push(this.amplitude * Math.sin(2 * Math.PI * this.frequency * t)));
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

exports.SineWave = SineWave;
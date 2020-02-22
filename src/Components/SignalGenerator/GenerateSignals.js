const fs = require('fs');

const SineWave = require('./SineWave');
const RandomSignal = require('./RandomSignal');

const sineSignal_10Hz_amp1_Obj = new SineWave.SineWave(1, 10, 0, 10, 0.01, 'sine-10Hz-amp1', '10Hz sine wave with 1 unit amplitude', 's', 'Volts');
const sineSignal_20Hz_amp1_Obj = new SineWave.SineWave(1, 20, 0, 10, 0.01, 'sine-20Hz-amp1', '20Hz sine wave with 1 unit amplitude', 's', 'N');
const sineSignal_1Hz_amp1_Obj = new SineWave.SineWave(1, 1, 0, 10, 0.01, 'sine-1Hz-amp1', '1Hz sine wave with 1 unit amplitude', 's', 'Nm');
const sineSignal_1Hz_amp10_Obj = new SineWave.SineWave(10, 1, 0, 10, 0.01, 'sine-1Hz-amp10', '1Hz sine wave with 10 unit amplitude', 's', 'm/s');
const randomSignalObj = new RandomSignal.RandomSignal(1, 0, 10, 0.01, 'random-amp1', 'random singal oscillating between 1 and -1', 's', 'deg C');

const sineSignal_10Hz_amp1 = sineSignal_10Hz_amp1_Obj.generate();
const sineSignal_20Hz_amp1 = sineSignal_20Hz_amp1_Obj.generate();
const sineSignal_1Hz_amp1 = sineSignal_1Hz_amp1_Obj.generate();
const sineSignal_1Hz_amp10 = sineSignal_1Hz_amp10_Obj.generate();
const randomSignal = randomSignalObj.generate();

const allSignals = {
    'sine-10Hz-amp1': sineSignal_10Hz_amp1,
    'sine-20Hz-amp1': sineSignal_20Hz_amp1,
    'sine-1Hz-amp1': sineSignal_1Hz_amp1,
    'sine-1Hz-amp10': sineSignal_1Hz_amp10,
    'random-amp1': randomSignal,
}

fs.writeFile('./generated_signals.json', JSON.stringify(allSignals, null, 4),(err) => {
    if (err) throw err;
    console.log('File written successfully!');
})
// variable declaration
let attackTime = 0.01,
    releaseTime = 0.5,
    modFreq = 50,
    modDepth = 500;

// slider value updates
var modFreqSlider = document.getElementById("fmFreq");
var modFreqOut = document.getElementById("freqOut")
var modDepthSlider = document.getElementById("fmDepth");
var modDepthOut = document.getElementById("modDepthOut")

modFreqOut.innerHTML = modFreqSlider.value + " Hz";
modFreqSlider.oninput = function() {
    modFreqOut.innerHTML = this.value + " Hz";
    modFreq = this.value;
}

modDepthOut.innerHTML = modDepthSlider.value;
modDepthSlider.oninput = function() {
    modDepthOut.innerHTML = this.value;
    modDepth = this.value;
}

// fm procedure
document.querySelector('#play2').addEventListener('click', () => {
    // initialize 2 sine oscillators
    const carrier = actx.createOscillator();
    var mod1 = actx.createOscillator();
    carrier.type = 'sine';
    mod1.type = 'sine';

    // modulator frequency is dynamic
    carrier.frequency.value = 440;
    mod1.frequency.value = modFreq;

    // mod depth (index) is dynamic
    var mod1Gain = actx.createGain();
    mod1Gain.gain.value = modDepth;

    // adsr for synth
    let envelope = actx.createGain();
    envelope.gain.cancelScheduledValues(actx.currentTime);
    envelope.gain.setValueAtTime(0, actx.currentTime);

    envelope.gain.linearRampToValueAtTime(1, actx.currentTime + attackTime);
    envelope.gain.linearRampToValueAtTime(0, actx.currentTime + attackTime + releaseTime);

    // routing
    mod1.connect(mod1Gain);
    mod1Gain.connect(carrier.frequency);
    carrier.connect(envelope);
    envelope.connect(masterGain);

    // playback
    mod1.start();
    carrier.start();

    mod1.stop(actx.currentTime + attackTime + releaseTime);
    carrier.stop(actx.currentTime + attackTime + releaseTime);
});

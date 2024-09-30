// initialize webaudio nodes for K-S technique
let noise = new AudioBufferSourceNode(actx, {loop:true}),
    noiseGain = new GainNode(actx,{gain:0}),
    delay = new DelayNode(actx,{delayTime:0.001}),
    feedbackGain = new GainNode(actx, {gain:0.9});

// create buffer of white noise, for impulse
noise.buffer = actx.createBuffer(1, actx.sampleRate, actx.sampleRate);
for (i=0; i < actx.sampleRate; i++) {
    noise.buffer.getChannelData(0)[i] = 2 * Math.random() - 1
}

// webaudio routing -- feedback/delay networks
noise.start();
noise.connect(noiseGain);
noiseGain.connect(masterGain);
noiseGain.connect(delay);
delay.connect(feedbackGain);
feedbackGain.connect(delay);
feedbackGain.connect(masterGain);

// update decay slider values
DecayLabel.innerHTML = Decay.value
Decay.oninput = function() {
    feedbackGain.gain.value = this.value;
    DecayLabel.innerHTML = Number(this.value).toFixed(3);
}

// update delay slider values
DelayLabel.innerHTML = Delay.value;
Delay.oninput = function() {
    delay.delayTime.value=0.001 * this.value;
    DelayLabel.innerHTML = Number(this.value).toFixed(2);
}

// update width slider values
WidthLabel.innerHTML = Width.value;
Width.oninput = function() { WidthLabel.innerHTML = Number(this.value).toFixed(2); }

// envelope for noise generation 
Play.onclick = function() {
    actx.resume();
    let now = actx.currentTime;
    noiseGain.gain.setValueAtTime(0.5, now);
    noiseGain.gain.linearRampToValueAtTime(0, now + Width.value/1000);
}

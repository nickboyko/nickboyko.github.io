let Noise = new AudioBufferSourceNode(actx, {loop:true}),
    NoiseGain = new GainNode(actx,{gain:0}),
    delay = new DelayNode(actx,{delayTime:0.001}),
    feedbackGain = new GainNode(actx, {gain:0.9});

Noise.buffer = actx.createBuffer(1, actx.sampleRate, actx.sampleRate);
for (i=0; i < actx.sampleRate; i++) {
    Noise.buffer.getChannelData(0)[i] = 2 * Math.random() - 1
}
Noise.start();
Noise.connect(NoiseGain);
NoiseGain.connect(masterGain);
NoiseGain.connect(delay);
delay.connect(feedbackGain);
feedbackGain.connect(delay);
feedbackGain.connect(masterGain);

DecayLabel.innerHTML = Decay.value
Decay.oninput = function() {
    feedbackGain.gain.value = this.value;
    DecayLabel.innerHTML = Number(this.value).toFixed(3);
}

DelayLabel.innerHTML = Delay.value;
Delay.oninput = function() {
    delay.delayTime.value=0.001 * this.value;
    DelayLabel.innerHTML = Number(this.value).toFixed(2);
}

WidthLabel.innerHTML = Width.value;
Width.oninput = function() { WidthLabel.innerHTML = Number(this.value).toFixed(2); }
Play.onclick = function() {
    actx.resume();
    let now = actx.currentTime;
    NoiseGain.gain.setValueAtTime(0.5, now);
    NoiseGain.gain.linearRampToValueAtTime(0, now + Width.value/1000);
}

// const ksPlay = document.getElementById("ksPlay");

// initialize nodes for K-S technique
// const noise = new AudioBufferSourceNode(actx, {loop:true});
const noise = actx.createBufferSource();
let noiseGain = new GainNode(actx, {gain:0});
let delay = new DelayNode(actx, {delayTime:0.003});
let feedbackGain = new GainNode(actx, {gain:0.98});

// create buffer of white noise, for impulse
const arrayBuffer = actx.createBuffer(1, actx.sampleRate, actx.sampleRate);
const nowBuffering = arrayBuffer.getChannelData(0);
for (let i=0; i < actx.sampleRate; i++) {
    nowBuffering[i] = 2 * Math.random() - 1;
}

noise.buffer = arrayBuffer;
noise.loop = true;

// webaudio routing -- feedback/delay networks
noise.start(actx.currentTime);
noise.connect(noiseGain);
noiseGain.connect(masterGain);
noiseGain.connect(delay);
delay.connect(feedbackGain);
feedbackGain.connect(delay);
feedbackGain.connect(masterGain);

// update decay slider values
DecayLabel.innerHTML = Decay.value;
Decay.oninput = function() {
    feedbackGain.gain.value = this.value;
    DecayLabel.innerHTML = Number(this.value).toFixed(3);
}

// update delay slider values
DelayLabel.innerHTML = Delay.value;
Delay.oninput = function() {
    delay.delayTime.value = 0.001 * this.value;
    DelayLabel.innerHTML = Number(this.value).toFixed(2);
}

// update width slider values
WidthLabel.innerHTML = Width.value;
Width.oninput = function() { WidthLabel.innerHTML = Number(this.value).toFixed(2); }

// envelope for noise generation 
ksPlay.onclick = function() {
    console.log(noise.buffer.getChannelData(0));
    actx.resume().then(() => {
        console.log(Width.value);
        let now = actx.currentTime;
        noiseGain.gain.setValueAtTime(0.5, now);
        noiseGain.gain.linearRampToValueAtTime(0, now + Width.value/1000);
    });
    
}

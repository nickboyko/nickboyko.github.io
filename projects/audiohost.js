// initialize page's audio context
const actx = new (window.AudioContext || window.webkitAudioContext)();
if (!actx) throw 'Not supported :(';

var out = actx.destination;

// master gain control for all webaudio elements
var masterGain = actx.createGain();
var gainSlider = document.getElementById("masterGain");
var gainOut = document.getElementById("gainVal");
masterGain.gain.value = gainSlider.value;
gainOut.innerHTML = "Master Gain: " + gainSlider.value;

// slider value change listener for gain updates
gainSlider.oninput = function() {
    masterGain.gain.value = this.value;
    gainOut.innerHTML = "Master Gain: " + this.value;
}
masterGain.connect(actx.destination);

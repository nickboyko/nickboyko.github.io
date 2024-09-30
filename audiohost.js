
const actx = new (AudioContext || webkitAudioContext)();
if (!actx) throw 'Not supported :(';

var out = actx.destination;

var masterGain = actx.createGain();
var gainSlider = document.getElementById("masterGain");
var gainOut = document.getElementById("gainVal");
masterGain.gain.value = gainSlider.value;
gainOut.innerHTML = "Master Gain: " + gainSlider.value;

gainSlider.oninput = function() {
    masterGain.gain.value = this.value;
    gainOut.innerHTML = "Master Gain: " + this.value;
}
masterGain.connect(actx.destination);


// function handleFiles(event) {
//     var files = event.target.files;
//     $("#src").attr("src", URL.createObjectURL(files[0]));
//     document.getElementById("audio").load();
// }

// document.getElementById("sampleUpload").addEventListener("change", handleFiles, false);

document.querySelector('#play3').addEventListener('click', () => {
    
    const osc = actx.createOscillator();

    osc.type = 'sawtooth';
    osc.frequency.value = 440;
    analyzer = actx.createAnalyser();
    osc.connect(analyzer);
    osc.connect(masterGain);
    

    osc.start();
    osc.stop(actx.currentTime + 0.5);
});


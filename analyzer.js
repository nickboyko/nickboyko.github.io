const analyzer = actx.createAnalyser();
masterGain.connect(analyzer);

const waveform = new Float32Array(analyzer.frequencyBinCount);
analyzer.getFloatTimeDomainData(waveform)

;(function updateWaveform() {
    requestAnimationFrame(updateWaveform);
    analyzer.getFloatTimeDomainData(waveform);
})();

const scopeCanvas = document.getElementById('oscilloscope');
scopeCanvas.width = waveform.length;
scopeCanvas.height = 200;
const scopeContext = scopeCanvas.getContext('2d');

;(function drawOscilloscope() {
    requestAnimationFrame(drawOscilloscope)
    scopeContext.clearRect(0, 0, scopeCanvas.width, scopeCanvas.height)
    scopeContext.beginPath()
    for (let i = 0; i < waveform.length; i++) {
        const x = i
        const y = (0.5 + waveform[i] / 2) * scopeCanvas.height;
        if (i == 0) {
            scopeContext.moveTo(x, y)
        } else {
            scopeContext.lineTo(x, y)
        }
    }
    scopeContext.stroke()
})()

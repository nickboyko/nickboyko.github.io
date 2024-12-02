document.addEventListener('DOMContentLoaded', function () {
    const micBtn = document.getElementById('toggle');
    const scaleBtn = document.getElementById('toggleScale');
    const canvas = document.getElementById('spectrumCanvas');
    const ctx = canvas.getContext('2d');
    const spectrogramCanvas = document.getElementById('spectrogramCanvas');
    const spectrogramCtx = spectrogramCanvas.getContext('2d');
    const minFreqSlider = document.getElementById('minFreq');
    const maxFreqSlider = document.getElementById('maxFreq');
    const minFreqLabel = document.getElementById('minLabel');
    const maxFreqLabel = document.getElementById('maxLabel');

    minFreqSlider.innerHTML = "Min Frequency (Hz):" + document.getElementById('minFreq').value;
    maxFreqSlider.innerHTML = "Max Frequency (Hz):" + document.getElementById('maxFreq').value;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    spectrogramCanvas.width = canvas.offsetWidth;
    spectrogramCanvas.height = canvas.offsetHeight;

    let micFlag = false;
    let analyzerStarted = false;
    window.analyzer = null;
    let dataArray = null;
    let bufferLength = null;
    let spectrogramData = [];
    let isLogScale = false;
    const maxFrames = 75;

    // file player ()
    let fileAudio;
    const audioElement = document.querySelector("audio");
    const track = actx.createMediaElementSource(audioElement);
    const playButton = document.querySelector('#playFile');
    const noUploadText = document.querySelector('#uploadFlag');
    var fileUploaded = false;
    track.connect(masterGain);

    drawInactiveText(spectrogramCtx);
    drawInactiveText(ctx);

    document.getElementById("sampleUpload").addEventListener("change", handleFiles, false);

    minFreqSlider.addEventListener('input', function () {
        if (parseInt(minFreqSlider.value) > parseInt(maxFreqSlider.value)) {
            maxFreqSlider.value = minFreqSlider.value;
            maxFreqLabel.innerHTML = "Max Frequency (Hz): " + maxFreqSlider.value;
        }
        minFreqLabel.innerHTML = "Min Frequency (Hz): " + minFreqSlider.value;
    });

    maxFreqSlider.addEventListener('input', function () {
        if (parseInt(maxFreqSlider.value) < parseInt(minFreqSlider.value)) {
            minFreqSlider.value = maxFreqSlider.value;
            minFreqLabel.innerHTML = "Min Frequency (Hz): " + minFreqSlider.value;
        }
        maxFreqLabel.innerHTML = "Max Frequency (Hz): " + maxFreqSlider.value;
    });

    scaleBtn.addEventListener('click', function () {
        isLogScale = !isLogScale;
        console.log("Frequency scale toggled. Log scale is now " + (isLogScale ? "ON" : "OFF"));
        scaleBtn.textContent = isLogScale ? "Switch to Linear Scale" : "Switch to Log Scale";
    });

    micBtn.addEventListener('click', function () {
        if (!analyzerStarted) {
            analyzerStarted = true;
            window.analyzer = actx.createAnalyser();
            window.analyzer.fftSize = 2048;
            bufferLength = analyzer.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
        }
        if (!micFlag) {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
                const source = actx.createMediaStreamSource(stream);
                source.connect(window.analyzer);
                micBtn.textContent = 'Stop sampling';
                updateSpectrum();
            }).catch(function (err) {
                console.error('Error accessing media devices: ', err);
            });
            micFlag = true;

            if (actx.state === 'suspended') {
                actx.resume().then(() => {
                    micBtn.textContent = 'Stop sampling';
                    console.log('actx resumed');
                    updateSpectrum();
                });
            }
        } else {
            if (actx.state === 'running') {
                actx.suspend().then(() => {
                    micBtn.textContent = 'Start sampling';
                    console.log('ACTX suspended');
                });
            } else if (actx.state === 'suspended') {
                actx.resume().then(() => {
                    micBtn.textContent = 'Stop sampling';
                    console.log('actx resumed');
                    updateSpectrum();
                });
            }
        }
    });

    playButton.addEventListener('click', () => {
        if (!analyzerStarted) {
            analyzerStarted = true;
            window.analyzer = actx.createAnalyser();
            window.analyzer.fftSize = 1024;
            bufferLength = analyzer.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
            track.connect(window.analyzer);

            actx.resume().then(() => {
                micBtn.textContent = 'Stop sampling';
                console.log('actx resumed');
                updateSpectrum();
            });
        }
        if (actx.state === "suspended") {
            actx.resume().then(() => {
                micBtn.textContent = 'Stop sampling';
                console.log('actx resumed');
                updateSpectrum();
            });
        }
        // playback flag to handle play/pause
        if (playButton.dataset.playing === "false") {
            actx.resume().then(() => {
                micBtn.textContent = 'Stop sampling';
                console.log('actx resumed');
                audioElement.play();
                playButton.dataset.playing = "true";
                updateSpectrum();
            });
            // audioElement.play();
            // playButton.dataset.playing = "true";
        } else if (playButton.dataset.playing === "true") {
            actx.suspend().then(() => {
                    micBtn.textContent = 'Start sampling';
                    audioElement.pause();
                    playButton.dataset.playing = "false";
                    console.log('ACTX suspended');
                });
            // audioElement.pause();
            // playButton.dataset.playing = "false";
        }
    });



    function drawInactiveText(theContext) {
        theContext.fillStyle = 'rgb(0, 0, 0)';
        theContext.fillRect(0, 0, theContext.canvas.width, theContext.canvas.height);
        theContext.fillStyle = 'rgb(255, 50, 50)';
        theContext.font = "48px bold";
        theContext.textAlign = "center";
        theContext.textBaseline = "middle";
        theContext.fillText('inactive', theContext.canvas.width/2, theContext.canvas.height/2);
    }

    function handleFiles(event) {
        var files = event.target.files;
        var fileurl = URL.createObjectURL(files[0]);
        $("#src").attr("src", fileurl);
        document.getElementById("audio").load();
        if (!fileUploaded) {
            fileUploaded = true;
            playButton.style.display = "block";
            noUploadText.style.display = "none";
        }
    }

    function drawSpectrum() {
        const width = canvas.width;
        const height = canvas.height;
        window.analyzer.getByteFrequencyData(dataArray);

        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, width, height);

        let barWidth = width / bufferLength;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            if (isLogScale) {
                if (i === 0) {
                    x = 0;
                } else {
                    x = (Math.log(i) / Math.log(bufferLength)) * width;
                }
            } else {
                x = i * barWidth;
            }
            
            ctx.fillStyle = `rgb(${barHeight + 100}, 100, ${barHeight + 100})`
            ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        }

        drawSpectrogram(dataArray);
    }

    function getBinIndex(frequency, sampleRate, fftSize) {
        return Math.floor(frequency / (sampleRate / fftSize));
    }
    
    function drawSpectrogram(dataArray) {
        // Get user-selected frequency range
        const minFreq = parseFloat(document.getElementById('minFreq').value);
        const maxFreq = parseFloat(document.getElementById('maxFreq').value);
        
        // Calculate corresponding bin indices
        const minBin = getBinIndex(minFreq, actx.sampleRate, window.analyzer.fftSize);
        const maxBin = getBinIndex(maxFreq, actx.sampleRate, window.analyzer.fftSize);
    
        spectrogramData.push(new Uint8Array(dataArray));
        if (spectrogramData.length > maxFrames) {
            spectrogramData.shift();
        }
    
        spectrogramCtx.fillStyle = 'rgb(0, 0, 0)';
        spectrogramCtx.fillRect(0, 0, spectrogramCanvas.width, spectrogramCanvas.height);
    
        const width = spectrogramCanvas.width / maxFrames;
        const rangeHeight = spectrogramCanvas.height / (maxBin - minBin + 1);
    
        if (isLogScale) {
            const logScaleMap = new Array(maxBin - minBin + 1);
            const logBase = Math.log10(maxBin + 1) - Math.log10(minBin + 1);
    
            for (let bin = minBin; bin <= maxBin; bin++) {
                logScaleMap[bin - minBin] = Math.round(
                    spectrogramCanvas.height * ((Math.log10(bin + 1) - Math.log10(minBin + 1)) / logBase)
                );
            }
    
            spectrogramData.forEach((frameData, index) => {
                let x = index * width;
                for (let bin = minBin; bin <= maxBin; bin++) {
                    const value = frameData[bin];
                    const brightness = value / 256;
                    spectrogramCtx.fillStyle = `rgb(${brightness * 255}, 0, ${brightness * 255})`;
    
                    // Corrected y position calculation
                    const y = spectrogramCanvas.height - logScaleMap[bin - minBin];
                    const nextY = (bin === maxBin)
                        ? 0
                        : spectrogramCanvas.height - logScaleMap[bin - minBin + 1];
    
                    const binHeight = y - nextY;
    
                    // Ensure no gaps by using Math.ceil for height
                    spectrogramCtx.fillRect(x, nextY, width, Math.ceil(binHeight));
                }
            });
    
        } else {
    
            spectrogramData.forEach((frameData, index) => {
                let x = index * width;
                for (let bin = minBin; bin <= maxBin; bin++) {
                    const value = frameData[bin];
                    const brightness = value / 256;
                    spectrogramCtx.fillStyle = `rgb(${brightness * 255}, 0, ${brightness * 255})`;
    
                    // Corrected y position calculation
                    const y = spectrogramCanvas.height - ((bin - minBin + 1) * rangeHeight);
                    
                    // Ensure no gaps by using Math.ceil for height
                    spectrogramCtx.fillRect(x, y, width, Math.ceil(rangeHeight));
                }
            });
        }
    }

    function updateSpectrum() {
        if (actx.state === 'running') {
            requestAnimationFrame(updateSpectrum);
            drawSpectrum();
        }
    }
});


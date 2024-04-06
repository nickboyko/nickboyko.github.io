document.querySelector('#play').addEventListener('click', () => {
    const actx = new (AudioContext || webkitAudioContext)();
    if (!actx) throw 'Not supported :(';
    // const osc = actx.createOscillator();
    const buffer = actx.createBuffer(
        1,
        actx.sampleRate * 3,
        actx.sampleRate);

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const nowBuffering = buffer.getChannelData(channel);
        for (let i = 0; i < buffer.length; i++) {
            nowBuffering[i] = Math.random() * 2 - 1;
        }
    }

    const source = actx.createBufferSource();
    source.buffer = buffer;
    source.connect(actx.destination);
    source.start();

    // osc.type = 'sawtooth';
    // osc.frequency.value = 440;
    // osc.connect(actx.destination);
    // osc.start();
    // osc.stop(actx.currentTime + 2);
});
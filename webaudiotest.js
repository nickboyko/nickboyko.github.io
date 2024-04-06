// function random_walk_boundary(steps, limit) {
//     let y = [];
//     let x_cur = 0;
//     const step_size = 1;

//     for (let i = 0; i < steps; i++) {
//         if (Math.abs(x_cur) + step_size > limit) {
//             const step = Math.sign(x_cur) * (-1 * step_size);
//         } else {
//             const step = (Math.round(Math.random()) * 2 - 1) * step_size;
//         }
//         x_cur += step;
//         y.push(step);
//     }
//     const x = y.map((sum = 0, n => sum += n));
// }

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

let exp = "Math.sin(x)";

// Generate values
const xValues = [];
const yValues = [];
for (let x = 0; x <= 10; x += 0.1) {
  xValues.push(x);
  yValues.push(eval(exp));
}

// Display using Plotly
const data = [{x:xValues, y:yValues, mode:"lines"}];
const layout = {title: "y = " + exp};
Plotly.newPlot("myPlot", data, layout);
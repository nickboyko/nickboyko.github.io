function random_walk_boundary(steps, limit) {
    let y = [];
    let x_cur = 0;
    const step_size = 1;

    for (let i = 0; i < steps; i++) {
        if (Math.abs(x_cur) + step_size > limit) {
            const step = Math.sign(x_cur) * (-1 * step_size);
        } else {
            const step = (Math.round(Math.random()) * 2 - 1) * step_size;
        }
        x_cur += step;
        y.push(step);
    }
    const x = y.map((sum = 0, n => sum += n));
    return x;
}

function second_order_random_walk(steps, limit) {
    let xs = [0];
    let ys = random_walk_boundary(steps, limit);

    for (const y of ys) {
        let next_step = xs[-1] + y;
        if (Math.abs(next_step) > limit) {
            next_step = xs[-1] + (Math.sign(y) * -1) * Math.abs(y)
        }
        xs.push(next_step)
    }
    return xs, ys
}



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

var plotlyDiv = document.getElementById("myPlot");

let exp = "RANDOM";

// Generate values
const xValues = [];
// const yValues = [];
const randomWalk = random_walk_boundary(1000, 10)
for (let x = 0; x <= 1000; x += 1) {
  xValues.push(x);
//   yValues.push(eval(exp));
}

// Display using Plotly
const data = [{x:xValues, y:randomWalk, mode:"lines"}];
const layout = {title: "y = " + exp};
Plotly.newPlot(plotlyDiv, data, layout);

console.log(random_walk_boundary(1000, 10));
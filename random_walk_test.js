// function random_walk_boundary(steps, limit) {
//     let y = [];
//     let x_cur = 0;
//     const step_size = 1;

//     for (let i = 0; i < steps; i++) {
//         if (Math.abs(x_cur) + step_size > limit) {
//             var step = Math.sign(x_cur) * (-1 * step_size);
//         } else {
//             var step = (Math.round(Math.random()) * 2 - 1) * step_size;
//         }
//         x_cur += step;
//         y.push(step);
//     }
//     const x = y.map((sum = 0, n => sum += n));
//     return x;
// }

// console.log(random_walk_boundary(1000, 10).slice(1, 100));

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

// var plotlyDiv = document.getElementById("myPlot");

// let exp = "RANDOM";

// // Generate values
// const xValues = [];
// // const yValues = [];
// const randomWalk = random_walk_boundary(1000, 10)
// for (let x = 0; x <= 1000; x += 1) {
//   xValues.push(x);
// //   yValues.push(eval(exp));
// }

// // Display using Plotly
// const data = [{x:xValues, y:randomWalk, mode:"lines"}];
// const layout = {title: "y = " + exp};
// Plotly.newPlot(plotlyDiv, data, layout);

// console.log(random_walk_boundary(1000, 10));

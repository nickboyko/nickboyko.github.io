function random_walk_boundary(steps, limit) {
    let y = [];
    let x_cur = 0;
    const step_size = 1;

    for (let i = 0; i < steps; i++) {
        if (Math.abs(x_cur) + step_size > limit) {
            var step = Math.sign(x_cur) * (-1 * step_size);
        } else {
            var step = (Math.round(Math.random()) * 2 - 1) * step_size;
        }
        x_cur += step;
        y.push(step);
    }
    const x = y.map((sum = 0, n => sum += n));
    return x;
}

console.log(random_walk_boundary(1000, 10).slice(1, 100));
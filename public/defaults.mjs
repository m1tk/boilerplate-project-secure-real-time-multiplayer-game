
const bordersize = 5;

const defaults = {
    canvaW: 640, 
    canvaH: 480,
    areaW: 640 - 2 * bordersize,
    areaH: 480 - 50 - 2 * bordersize,
    minX: 0 + bordersize,
    maxX: 640 - bordersize,
    minY: 50 + bordersize,
    maxY: 480 - bordersize
};

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function rand_start_position() {
    return [
        rand(defaults.minX + 40, defaults.maxX - 40),
        rand(defaults.minY + 40, defaults.maxY - 40)
    ]
}

export function rand_coin() {
    var pos = rand_start_position();
    pos.push(rand(1, 3));
    return pos;
}

try {
    module.exports = {
        defaults,
        rand_start_position,
        rand_coin
    }
} catch(e) {
}

export default defaults;
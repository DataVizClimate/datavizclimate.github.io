function lerp(a, b, t) {
    return a + (b - a) * t;
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function lerpColor(percentage, colorA, colorB) {
    // Ensure the percentage is between 0 and 1
    percentage = Math.min(1, Math.max(0, percentage));
  
    // Split colors into R, G, and B components
    const [rA, gA, bA] = colorA.match(/\w\w/g).map(hex => parseInt(hex, 16));
    const [rB, gB, bB] = colorB.match(/\w\w/g).map(hex => parseInt(hex, 16));
  
    // Interpolate each color component
    const r = Math.round(rA + percentage * (rB - rA));
    const g = Math.round(gA + percentage * (gB - gA));
    const b = Math.round(bA + percentage * (bB - bA));
  
    // Combine the color components back into a single string
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function mapRange(value, aStart, aEnd, bStart, bEnd) {
    const normalized = (value - aStart) / (aEnd - aStart);
    const mappedValue = normalized * (bEnd - bStart) + bStart;
    return mappedValue;
}
  

function csvToJson(csv) {
    const lines = csv.split("\n");

    // Remove the header line and store it
    const headers = lines.shift().split(",");

    return lines.map(line => {
        const data = line.split(",");
        return headers.reduce((obj, nextKey, index) => {
        obj[nextKey] = data[index];
        return obj;
        }, {});
    });
}
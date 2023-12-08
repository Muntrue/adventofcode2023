const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", "utf8").split("\r\n").filter(Boolean);

const map = {};
map.seeds = input[0].replace("seeds: ", "").split(" ").map((x) => parseInt(x));

input.shift();

let key = "";
input.forEach((line) => {
    if (line.includes("map:")) {
        key = line.replace(" map:", "").replaceAll("-", "_");
        map[key] = [];
    } else {
        const values = line.split(" ");
        map[key].push({
            source: parseInt(values[0]),
            destination: parseInt(values[1]),
            range: parseInt(values[2])
        });
    }
});

const rangePairs = splitArrayIntoPairs(map.seeds);

let x = false;
let i = 1;
// Start loop to find lowest location
while (!x) {

    let currentValue = i

    // Loop trough all maps in reverse order to find matches
    Object.keys(map).reverse().forEach((key) => {
        if (key === 'seeds') return;


        currentValue = findValue(parseInt(currentValue), key);
    })

    // If the resulting seed fits in any of the seed ranges
    const isInRange = rangePairs.some((pair) => {
        return isNumberBetween(currentValue, pair[0], pair[0] + pair[1]);
    });

    if (isInRange) {
        console.log(i);
        x = true;
    }

    i++;
}

function findValue(seed, key) {
    let result = seed;
    map[key].some((values) => {
        //Check if the number fits
        if (isNumberBetween(seed, values.source, (values.source + values.range))) {
            // Number fits, get offset from source -> destination
            const offset = (values.destination - values.source);

            // return the correct number
            result = seed + offset;
            return true;
        }
    })

    return result;
}

function isNumberBetween(number, lowerBound, upperBound) {
    return number >= lowerBound && number <= upperBound;
}

function splitArrayIntoPairs(array) {
    const pairs = [];

    for (let i = 0; i < array.length; i += 2) {
        pairs.push(array.slice(i, i + 2));
    }

    return pairs;
}
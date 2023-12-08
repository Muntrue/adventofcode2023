const fs = require("fs");

const input = fs.readFileSync(__dirname + "/input.txt", "utf8").split("\r\n").filter(Boolean);

const map = {};
map.seeds = input[0].replace("seeds: ","").split(" ");

input.shift();

let key = "";
input.forEach((line) => {
    if(line.includes("map:")){
        key = line.replace(" map:", "").replaceAll("-", "_");
        map[key] = [];
    }else{
        const values = line.split(" ");
        map[key].push({
            source: parseInt(values[1]),
            destination: parseInt(values[0]),
            range: parseInt(values[2])
        });
    }
});

const finalValues = [];

map.seeds.forEach((seed) => {
    let currentValue = seed;

    Object.keys(map).forEach((key) => {
        if(key === 'seeds') return;

        currentValue = findValue(parseInt(currentValue), key);
    })

    finalValues.push({
        seed: seed,
        location: currentValue
    })
})


function findValue(seed, key){

    let result = seed;
    map[key].some((values) => {
        //Check if the number fits
        if(isNumberBetween(seed, values.source, (values.source + values.range))){
            // Number fits, get offset from source -> destination
            const offset = (values.destination - values.source);

            // return the correct number
            result = seed + offset;
            return  true;
        }
    })

    return result;
}

const lowestLocation = finalValues.reduce((min, obj) => Math.min(min, obj.location), Infinity);

console.log(lowestLocation);

function isNumberBetween(number, lowerBound, upperBound) {
    return number >= lowerBound && number <= upperBound;
}

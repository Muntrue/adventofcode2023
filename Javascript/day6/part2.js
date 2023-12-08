const fs = require("fs");

function getInput(){
    const input = fs.readFileSync(__dirname + "/input.txt", "utf8").split("\r\n").filter(Boolean);
    input[0] = input[0].replace('Time:', '');
    input[1] = input[1].replace('Distance:', '');

    const x = input.map(y => y.split(" ").filter(z => z !== '').map(q => parseInt(q)));

    const raceData = {
        duration: '',
        distance: ''
    };

    for (let i = 0; i < x[0].length; i++) {
        raceData.duration = parseInt(raceData.duration + '' + x[0][i])
        raceData.distance = parseInt(raceData.distance + '' + x[1][i])
    }

    return raceData;
}


const raceData = getInput();

console.log(raceData);

// Define win condition array
const raceWinConditions = [];

// Loop to all seconds and push button for X amount
let winCons = 0;
for(let i = 1; i <= raceData.duration; i++){
    const distance = i * (raceData.duration - i);
    if(distance > raceData.distance) winCons++;
}

raceWinConditions.push(winCons);


const result = raceWinConditions.reduce((total, currentValue) => total * currentValue, 1);
console.log(result);

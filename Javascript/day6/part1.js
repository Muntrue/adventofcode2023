const fs = require("fs");

function getInput(){
    const input = fs.readFileSync(__dirname + "/input.txt", "utf8").split("\r\n").filter(Boolean);
    input[0] = input[0].replace('Time:', '');
    input[1] = input[1].replace('Distance:', '');

    const x = input.map(y => y.split(" ").filter(z => z !== '').map(q => parseInt(q)));

    const raceData = [];
    for (let i = 0; i < x[0].length; i++) {
        raceData.push({
            duration: x[0][i],
            distance: x[1][i]
        });
    }

    return raceData;
}


const raceData = getInput();

// Define win condition array
const raceWinConditions = [];

// Loop through all races
raceData.forEach(function(race){
    // Loop to all seconds and push button for X amount
    let winCons = 0;
    for(let i = 1; i <= race.duration; i++){
        const distance = i * (race.duration - i);
        if(distance > race.distance) winCons++;
    }

    raceWinConditions.push(winCons);

});

const result = raceWinConditions.reduce((total, currentValue) => total * currentValue, 1);
console.log(result);

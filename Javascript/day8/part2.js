const fs = require("fs");

function getInput() {
    const input = fs.readFileSync(__dirname + "/input.txt", "utf8").split("\r\n")
        .filter(Boolean)
        .map(x => x.split(" "));

    const instruction = input[0][0].split("").map((i) => i === 'R' ? 1 : 0);
    input.shift();

    const routes = {};

    input.forEach((line) => {
        routes[line[0]] = [line[2].replace(/[^a-z0-9]+/gi, ""), line[3].replace(/[^a-z0-9]+/gi, "")];
    })


    return {
        instruction,
        routes
    };
}

const map = getInput();

const startingRoutes = Object.keys(map.routes).filter((route) => {
    return route[route.length - 1] === "A"
});

let instructionIndex = 0;

const stepsTaken = [];



startingRoutes.forEach((route) => {
    let steps = 0;
    while(route[route.length -1 ] !== 'Z'){
        route = map.routes[route][map.instruction[instructionIndex]];
        steps++;
        instructionIndex = instructionIndex >= map.instruction.length- 1 ? 0 : instructionIndex += 1;
    }

    stepsTaken.push(steps);
    instructionIndex = 0;
});

let gcd = 2;
while(stepsTaken.some(steps => steps % gcd !== 0)) gcd++;


const answer = stepsTaken.reduce((total, loopAmount) => (total * loopAmount) / gcd);

//13129439557681
console.log(answer);

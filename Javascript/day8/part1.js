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

console.log(map);
let currentKey = 'AAA';

console.log(iterate(currentKey, 0));


function iterate(currentKey, currentIteration){

    let key = currentKey;

    for(let i=0; i < map.instruction.length; i++){
        key = map.routes[key][map.instruction[i]];
        currentIteration++;

        if(key === 'ZZZ') break;
    }


    if(key !== 'ZZZ'){
        currentIteration = iterate(key, currentIteration);
    }

    return currentIteration;
}

const fs = require("fs");

function getInput() {
    const input = fs.readFileSync(__dirname + "/input.txt", "utf8").split("\r\n")
        .filter(Boolean)
        .map(x => x.split(" "));

    return input;
}

const input = getInput().map(x => x.map(y => parseInt(y)));

const answers = [];
input.forEach(history => {
    const diffHistory = diffMachine(history, [history]);
    answers.push(extrapolate(diffHistory));
});

console.log(answers.reduce((total, x) => total + x, 0));


function diffMachine(line, carry){
    const tmpArray = [];
    for(let i = 0; i < line.length -1; i++){
        const fKey = i;
        const lKey = i + 1;
        const diff = line[lKey] - line[fKey];
        tmpArray.push(diff);
    }

    carry.push(tmpArray);

    if(tmpArray.every(x => x === 0)) return carry;

    return diffMachine(tmpArray, carry);
}

function extrapolate(history){
    const reverse = history.reverse();

    reverse.forEach((line, index) => {
        if(index > 0){
            const prevEx = reverse[index -1][reverse[index-1].length - 1];
            const thisEx = line[line.length - 1];
            line.push(prevEx + thisEx);
        }else{
            line.push(0);
        }
    })

    return reverse.reverse()[0].slice(-1)[0];
}

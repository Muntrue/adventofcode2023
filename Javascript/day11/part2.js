const fs = require('fs');

function getInput() {
    const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').split('\r\n').filter(Boolean).map(x => x.split(' '));

    return input.map(x => x[0].split(''));
}

const map = getInput();
const colsWithoutGalaxy = [];
const rowsWithoutGalaxy = [];

const expansion = 999999;

// Get all columns without galaxy
map[0].forEach((col, index) => {
    const colMap = []
    for (let i = 0; i < map.length; i++) {
        colMap.push(map[i][index]);
    }

    if (!colMap.some(x => x === '#')) colsWithoutGalaxy.push(index);
})

// Get all rows without galaxy
map.forEach((row, index) => {
    if (!row.some(x => x === '#')) rowsWithoutGalaxy.push(index);
});

// Get Galaxy coords
const galaxyIndexMap = [];
map.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
        if (col === '#') galaxyIndexMap.push([rowIndex, colIndex]);
    });
});


let total = 0;
const passed = [];
galaxyIndexMap.forEach((first, firstIndex) => {
    passed[firstIndex] = [];

    galaxyIndexMap.forEach((second, secondIndex) => {
        if (first !== second && !passed[secondIndex]?.includes(firstIndex)) {
            passed[firstIndex].push(secondIndex);

            total += calcDistance(first, second);
        }
    })
});
console.log(total);

function calcDistance(one, two) {
    let [firstRow, firstCol] = one;
    let [secondRow, secondCol] = two;

    firstRow += expand(firstRow, 'row');
    firstCol += expand(firstCol, 'col');

    secondRow += expand(secondRow, 'row');
    secondCol += expand(secondCol, 'col');

    return Math.abs(firstRow - secondRow) + Math.abs(firstCol - secondCol);
}

function expand(index, type){
    const noGalaxyArray = type === 'row' ? rowsWithoutGalaxy : colsWithoutGalaxy;

    return (noGalaxyArray.filter((x) => x < index).length) * expansion;
}
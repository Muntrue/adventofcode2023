const fs = require('fs');

function getInput() {
    const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').split('\r\n').filter(Boolean).map(x => x.split(' '));

    return input.map(x => x[0].split(''));
}

const map = getInput();
const colsWithoutGalaxy = [];

const expansion = 1;

map[0].forEach((col, index) => {
    const rowMap = []
    for (let i = 0; i < map.length; i++) {
        rowMap.push(map[i][index]);
    }

    if (!rowMap.some(x => x === '#')) colsWithoutGalaxy.push(index);
})

// Splice in new cols
map.map(row => {
    let rowsAdded = 0;
    colsWithoutGalaxy.forEach(x => {
        for(let i = 0; i<expansion;i++){
            row.splice(x + rowsAdded, 0, '.')
        }
        rowsAdded = rowsAdded + expansion;
    })
});

// Expand rows
const expandedMap = [];
map.forEach(row => {
    if (!row.some(col => col === '#')) {
        for(let i = 0; i < expansion; i++){
            expandedMap.push(row);
        }
    }
    expandedMap.push(row);
});


//console.table(expandedMap);
// Get Galaxy coords
const galaxyIndexMap = [];
expandedMap.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
        if (col === '#') galaxyIndexMap.push([rowIndex, colIndex]);
    });
});

/*console.log('Between galaxy 5 and galaxy 9: 9', calcDistance(galaxyIndexMap[4], galaxyIndexMap[8]));
console.log('Between galaxy 1 and galaxy 7: 15', calcDistance(galaxyIndexMap[0], galaxyIndexMap[6]));
console.log('Between galaxy 3 and galaxy 6: 17', calcDistance(galaxyIndexMap[2], galaxyIndexMap[5]));
console.log('Between galaxy 8 and galaxy 9: 5', calcDistance(galaxyIndexMap[7], galaxyIndexMap[8]));
console.log('Between galaxy 1 and galaxy 9: 12', calcDistance(galaxyIndexMap[0], galaxyIndexMap[8]));*/

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

//console.table(passed);

console.log('total should be 374, is:', total);

function calcDistance(one, two) {
    return Math.abs(one[0] - two[0]) + Math.abs(one[1] - two[1]);
}
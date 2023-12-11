//const fs = require('fs');

function getInput() {
    //const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').split('\r\n').filter(Boolean).map(x => x.split(' '));

    const string = '.F----7F7F7F7F-7....\n' +
        '.|F--7||||||||FJ....\n' +
        '.||.FJ||||||||L7....\n' +
        'FJL7L7LJLJ||LJ.L-7..\n' +
        'L--J.L7...LJS7F-7L7.\n' +
        '....F-J..F7FJ|L7L7L7\n' +
        '....L7.F7||L7|.L7L7|\n' +
        '.....|FJLJ|FJ|F7|.LJ\n' +
        '....FJL-7.||.||||...\n' +
        '....L---J.LJ.LJLJ...';

    const input = string.split(/\r?\n/);
    return input.map(x => x.split(''));
}

const map = getInput();

const table = document.getElementById('maintable');
console.log(table);
let zz = 0;
map.forEach(line => {
    const row = table.insertRow();
    line.forEach((letter, index) => {
        const col = row.insertCell();
        col.setAttribute('id', `row${zz}col${index}`)
        if(letter === 'S') col.classList.add('start');
        col.innerText = letter;
    });

    zz++;
});

// Find starting position
const startingPos = findStartingPos();

// Set valid pieces for every direction
const validPieces = {
    up: [ '|', 'F', '7' ],
    right: [ '-', '7', 'J' ],
    down: [ '|', 'L', 'J' ],
    left: [ 'F', '-', 'L' ],
};

const validConnections = {
    '-': {
        left: [ 'F', '-', 'J', 'L' ],
        right: [ 'J', '7', '-' ],
        up: [],
        down: [],
    },
    '|': {
        left: [],
        right: [],
        up: [ '|', '7', 'F' ],
        down: [ '|', 'J', 'L' ],
    },
    'L': {
        left: [],
        right: [ '-', '7','J'],
        up: [ '|', '7', 'F' ],
        down: [],
    },
    'J': {
        left: [ '-', 'F', 'L' ],
        right: [],
        up: [ '|', '7', 'F' ],
        down: [],
    },
    '7': {
        left: [ '-', 'F', 'L' ],
        right: [],
        up: [],
        down: [ '|', 'L', 'J' ],
    },
    'F': {
        left: [],
        right: [ '-', 'J', '7' ],
        up: [],
        down: [ '|', 'J', 'L' ],
    },
};

const x = findNearestValidPiece(startingPos, [], true, 1);

console.log(x.length / 2);

let counter = 0;

function findNearestValidPiece(position, prev, firstPass = true, counter = 1) {
    console.log(counter);
    const carry = prev;

    const currentCharacter = map[ position.row ][ position.col ];
    let characterFound;

    let result = {
        row: 0,
        col: 0,
    };
    for ( let i = 0; i < Object.keys(validPieces).length; i++ ) {
        let row = position.row;
        let col = position.col;
        const direction = Object.keys(validPieces)[ i ];

        switch ( direction ) {
            case 'up':
                row -= 1;
                break;
            case 'right':
                col += 1;
                break;
            case 'down':
                row += 1;
                break;
            case 'left':
                col -= 1;
                break;
        }

        if ( row < 0 || col < 0 ) continue;
        if ( row >= map.length || col >= map[ 0 ].length ) continue;

        characterFound = map[ row ][ col ];

        if ( characterFound === 'S' && !firstPass && carry.length > 3 && validConnections[currentCharacter][direction].length > 0 ) break;

        if ( validPieces[ direction ].includes(characterFound) ) {
            const validConnection = (currentCharacter === 'S') ? true : validConnections[ currentCharacter ][ direction ].includes(characterFound);
            const previously = [ carry[ carry.length - 2 ]?.row, carry[ carry.length - 2 ]?.col ].join('');
            const notSameAsPrev = previously !== [ row, col ].join('');

            if ( validConnection && notSameAsPrev ) {
                result.row = row;
                result.col = col;
                break;
            }
        }
    }

    const cellElem = document.getElementById(`row${result.row}col${result.col}`);
    cellElem.classList.add('on');
    cellElem.scrollIntoViewIfNeeded();
    carry.push(result);

    if ( characterFound === 'S' && !firstPass ) {
        return carry;
    }

    if ( result.row === 0 && result.col === 0 ) return carry;

    setTimeout(() => {
        return findNearestValidPiece(result, carry, false);
    }, 0);
}

function findStartingPos() {
    let foundRow = 0;
    let foundCol = 0;
    let done = false;

    for ( let row = 0; row < map.length; row++ ) {
        foundCol = 0;
        for ( let col = 0; col < map[ row ].length; col++ ) {
            if ( map[ foundRow ][ foundCol ] === 'S' ) {
                done = true;
                break;
            }
            foundCol++;
        }

        if ( done ) break;
        foundRow++;
    }

    return {
        row: foundRow,
        col: foundCol,
    };
}


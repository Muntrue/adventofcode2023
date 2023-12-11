const fs = require('fs');

function getInput() {
    const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').split('\r\n').filter(Boolean).map(x => x.split(' '));

    return input.map(x => x[0].split(''));
}

const map = getInput();


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

let counter = 0;
//const x = findNearestValidPiece(startingPos, [], true);

let done = false;
let position = startingPos;
let previousResult = position;
let firstPass = true;
const passed = [];

while(!done){
    const currentCharacter = map[ position.row ][ position.col ];
    let characterFound;
    previousResult = position;
    passed.push(`row${previousResult.row}col${previousResult.col}`)

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

        if ( characterFound === 'S' && !firstPass && counter > 3 ) break;

        if ( validPieces[ direction ].includes(characterFound) ) {
            const validConnection = (currentCharacter === 'S') ? true : validConnections[ currentCharacter ][ direction ].includes(characterFound);

            console.log(previousResult, [row,col]);
            const notSameAsPrev = !passed.includes(`row${row}col${col}`) ;

            if ( validConnection && notSameAsPrev ) {
                result.row = row;
                result.col = col;
                break;
            }
        }
    }

    counter++;

    if ( characterFound === 'S' && !firstPass ) {
        done = true;
    }

    if ( result.row === 0 && result.col === 0 ) done = true;
    firstPass = false;
    position = result;

    //return findNearestValidPiece(result, position, false);
}

console.log(counter / 2);

/*function findNearestValidPiece(position, previousResult, firstPass = true) {

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

        if ( characterFound === 'S' && !firstPass && counter > 3 ) break;

        if ( validPieces[ direction ].includes(characterFound) ) {
            const validConnection = (currentCharacter === 'S') ? true : validConnections[ currentCharacter ][ direction ].includes(characterFound);

            const previously = [ previousResult.row, previousResult.col].join('');
            const notSameAsPrev = previously !== [ row, col ].join('');

            if ( validConnection && notSameAsPrev ) {
                result.row = row;
                result.col = col;
                break;
            }
        }
    }

    counter++;

    if ( characterFound === 'S' && !firstPass ) {
        return 0;
    }

    if ( result.row === 0 && result.col === 0 ) return 0;

    return findNearestValidPiece(result, position, false);
}*/

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


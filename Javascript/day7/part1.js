const fs = require("fs");

function getInput() {
    const input = fs.readFileSync(__dirname + "/input.txt", "utf8").split("\r\n")
        .filter(Boolean)
        .map(x => x.split(" "));

    return input;
}


const cardScores = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    T: 10
}
const hands = getInput();
const scoredHands = {
    highCard: [],
    onePair: [],
    twoPair: [],
    threeOfAKind: [],
    fullHouse: [],
    fourOfAKind: [],
    fiveOfAKind: [],
};
hands.forEach((hand) => {
    const [cards, value] = [hand[0], parseInt(hand[1])];
    const pairs = makePairs(cards);

    // Calculate score of pair
    let hasThree = false;
    let hasTwo = false;
    let hasFour = false;
    let hasFive = false;
    let pairAmounts = 0;

    Object.keys(pairs).forEach((key) => {
        if (pairs[key].amount === 1) return;
        const amount = pairs[key].amount;
        if (amount === 2) {
            hasTwo = true;
            pairAmounts++;
        }
        if (amount === 3) hasThree = true;
        if (amount === 4) hasFour = true;
        if (amount === 5) hasFive = true;
    });

    if (hasFive) type = 'fiveOfAKind';
    else if (hasFour) type = 'fourOfAKind';
    else if (hasThree && hasTwo) type = 'fullHouse';
    else if (hasThree) type = 'threeOfAKind';
    else if (hasTwo && pairAmounts === 2) type = 'twoPair';
    else if (hasTwo && pairAmounts === 1) type = 'onePair';
    else type = 'highCard';

    scoredHands[type].push({
        cards,
        value
    });
});

let finalScore = 0;
let iteration = 1;

Object.keys(scoredHands).forEach(key => {
    sortByFirstCharacter(scoredHands[key], 'cards').forEach((cards) => {
        finalScore += (cards.value * iteration);

        iteration++;
    });
});


console.log(finalScore);


function makePairs(cards) {
    const pairs = {}
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        if (!Object.keys(pairs).includes(card)) {
            pairs[card] = {
                amount: 1
            }
        } else {
            pairs[card].amount++;
        }
    }

    return pairs;
}

function sortByFirstCharacter(arr, property) {
    // Custom sorting function
    const customSort = (a, b) => {
        const aValue = a[property];
        const bValue = b[property];

        for (let i = 0; i < Math.min(aValue.length, bValue.length); i++) {
            const charA = (Object.keys(cardScores).includes(aValue[i]) ? cardScores[aValue[i]] : parseInt(aValue[i]));
            const charB = (Object.keys(cardScores).includes(bValue[i]) ? cardScores[bValue[i]] : parseInt(bValue[i]));

            if (charA !== charB) {
                return charA - charB;
            }
        }

        return aValue.length - bValue.length;
    };

    // Use the custom sorting function
    const sortedArray = arr.slice().sort(customSort);

    return sortedArray;
}
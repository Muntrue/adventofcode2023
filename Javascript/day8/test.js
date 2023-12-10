
const numbers = [6, 15];

let d = 2;

while(numbers.some(number => number % d !== 0 )){
    d++;
    console.log(d);
}


console.log("-------------");
console.log(6 % 4, 15 % 4);
console.log();
console.log(d);
/*

console.log(d);*/


const states = require('./data/states.json');
states.sort((a, b) => b.score - a.score);
console.log(states);

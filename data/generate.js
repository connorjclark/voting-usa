const fs = require('fs');
const stringify = require("json-stringify-pretty-compact");
const states = require('./states.json');

const data = {
  states: [...states],
  categories: [],
}

function partitionBy(arr, key) {
  const parts = [[]];
  for (const item of arr) {
    if (item === key) {
      parts.push([]);
    } else {
      parts[parts.length - 1].push(item);
    }
  }
  return parts;
}

function collect(path) {
  const lines = fs.readFileSync(path, 'utf-8').split('\n').filter(Boolean);
  const parts = partitionBy(lines, '---');
  
  const sources = parts[0].join('\n');
  const scoreData = parts[1];
  const stateData = parts[2];

  const scoring = {};
  for (const item of scoreData) {
    const [k,v] = item.split(' ');
    scoring[k] = Number(v);
  }

  const statesData = stateData.map(text => {
    let [, abbreviation, tags, notes] = text.match(/(\w{2,4}) ?([^#]+)?#?(.*)?/);
    tags = tags ? tags.split(' ').filter(Boolean) : [];
    if (notes) notes = notes.trim();

    return {
      abbreviation,
      score: tags.reduce((acc, cur) => acc + scoring[cur], 0),
      tags,
      notes,
    };
  });

  return {statesData, sources, scoring};
}

function process(property, path) {
  const {statesData, sources, scoring} = collect(path);

  data.categories.push({name: property, sources, scoring});

  for (const item of statesData) {
    data.states.find(s => s.abbreviation === item.abbreviation)[property] = {
      score: item.score,
      tags: item.tags,
      notes: item.notes,
    };
  }
}

process('voteByMail', __dirname + '/vote-by-mail.txt');
process('votingCenters', __dirname + '/vote-centers.txt');
process('rankedChoice', __dirname + '/ranked-choice.txt');
process('sameDayRegistration', __dirname + '/same-day-registration.txt');

const weights = {
  voteByMail: 5,
  rankedChoice: 4,
  sameDayRegistration: 3,
  votingCenters: 2,
};
function calculateScore(state) {
  const totalWeight = Object.values(weights).reduce((acc, cur) => acc + cur, 0);

  let score = 0;
  for (const [property, weight] of Object.entries(weights)) {
    const category = data.categories.find(c => c.name === property);
    const highestScoreForCategory = Math.max(...Object.values(category.scoring));
    const categoryScore = (state[property].score || 0) / highestScoreForCategory;
    score += categoryScore * weight / totalWeight;
  }

  return Math.round(score * 10000) / 10000;
}


for (const state of data.states) {
  state.score = calculateScore(state);
}

fs.writeFileSync(`${__dirname}/data.json`, stringify(data, {maxLength:1000}));

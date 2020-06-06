const fs = require('fs');
const stringify = require("json-stringify-pretty-compact");
const states = require('./states.json');

const data = [...states];

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
  
  const scoreData = parts[1];
  const stateData = parts[2];

  const scoring = {};
  for (const item of scoreData) {
    const [k,v] = item.split(' ');
    scoring[k] = Number(v);
  }

  return stateData.map(text => {
    let [, abbreviation, tags, notes] = text.match(/(\w\w) ?([^#]+)?#?(.*)?/);
    tags = tags ? tags.split(' ').filter(Boolean) : [];
    if (notes) notes = notes.trim();

    return {
      abbreviation,
      score: tags.reduce((acc, cur) => acc + scoring[cur], 0),
      tags,
      notes,
    };
  });
}

function process(property, path) {
  for (const item of collect(path)) {
    states.find(s => s.abbreviation === item.abbreviation)[property] = {
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

for (const state of data) {
  state.score = ['voteByMail', 'votingCenters', 'rankedChoice', 'sameDayRegistration'].reduce((acc, cur) => acc + state[cur].score, 0);
}

fs.writeFileSync(`${__dirname}/data.json`, stringify(data, {maxLength:1000}));

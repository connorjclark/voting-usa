const fs = require('fs');
const stringify = require("json-stringify-pretty-compact");
const states = require('./states.json');

/** @type {Voting.Results} */
const results = {
  states: states.map(state => ({
    ...state,
    score: 0, // Calculated later.
    data: {},
  })),
  categories: {},
}

/**
 * @param {string[]} arr
 * @param {string} key
 */
function partitionBy(arr, key) {
  /** @type {string[][]} */
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

/**
 * @param {string} path
 */
function collect(path) {
  const lines = fs.readFileSync(path, 'utf-8').split('\n').filter(Boolean);
  const parts = partitionBy(lines, '---');

  const sources = parts[0].join('\n');
  const scoreData = parts[1];
  const stateData = parts[2];

  /** @type {Voting.Rubric} */
  const rubric = {};
  for (const item of scoreData) {
    const [k, v] = item.split(' ');
    rubric[k] = Number(v);
  }

  const defaultValue = Object.entries(rubric).reduce((min, cur) => {
    if (min[1] > cur[1]) return cur;
    return min;
  })[0];

  /** @type {Record<string, Voting.CategoryResult>} */
  const categoryResultsByState = {};
  for (const text of stateData) {
    let [, shortCode, tagsString, notes] = text.match(/(\w{2,4}) ?([^#]+)?#?(.*)?/) || [];
    const tags = tagsString ? tagsString.split(' ').filter(Boolean) : [];
    // ?
    // if (tags.length > 1) throw new Error('TODO rm');

    if (notes) notes = notes.trim();

    let value;
    if (tags[0] === 'N/A') value = null;
    else if (tags[0]) value = tags[0];
    else value = defaultValue;

    if (value !== null && rubric[value] === undefined) throw new Error('bad value');

    categoryResultsByState[shortCode] = {
      value,
      score: value ? rubric[value] : 0,
      notes,
    };
  }

  for (const shortCode of Object.keys(categoryResultsByState)) {
    const state = results.states.find(s => s.shortCode === shortCode);
    if (!state) throw new Error('state not found: ' + shortCode);
  }

  return { categoryResultsByState, sources, rubric };
}

/**
 * @param {string} categoryName
 * @param {string} path
 */
function process(categoryName, path) {
  const { categoryResultsByState, sources, rubric } = collect(path);

  results.categories[categoryName] = {
    name: categoryName,
    weight: 0, // Set later.
    rubric,
    sources,
  };

  for (const state of results.states) {
    const categoryResult = categoryResultsByState[state.shortCode] || { value: null, score: null };
    state.data[categoryName] = categoryResult;
  }
}

/**
 * @param {{category: Voting.Category, getValueForState: Function}} param1
 */
function processFromFn({ category, getValueForState }) {
  results.categories[category.name] = category;

  for (const state of results.states) {
    const value = getValueForState(state);
    const score = category.rubric[value];
    state.data[category.name] = {
      value,
      score: score !== undefined ? score : null,
    };
  }
}

process('voteByMail', __dirname + '/vote-by-mail.txt');
process('votingCenters', __dirname + '/vote-centers.txt');
process('rankedChoice', __dirname + '/ranked-choice.txt');
process('sameDayRegistration', __dirname + '/same-day-registration.txt');

// Generate some stuff from JSON.
const mailData = require('./mail-ballots-data.json');

processFromFn({
  category: {
    name: 'processMailBallots',
    weight: 0, // Set later.
    rubric: {
      'recieved': 1,
      'before-election-day': 0.5,
      'election-day': 0,
    },
    sources: 'https://www.cnn.com/interactive/2020/politics/mail-in-voting/',
  },
  /** @param {Voting.State} state */
  getValueForState(state) {
    // @ts-ignore
    const data = mailData.summary.find(s => s.key === 'when_states_counting').values;
    const dataForState = data.find(s => s.state === state.name || s.code === state.shortCode);
    if (!dataForState) return null;

    return ['before-election-day', 'recieved', 'election-day'][dataForState.category];
  }
});

processFromFn({
  category: {
    name: 'arriveMailBallots',
    weight: 0, // Set later.
    rubric: {
      'postmarked-by-election-day': 1,
      'recieved-by-election-day': 0,
    },
    sources: 'https://www.cnn.com/interactive/2020/politics/mail-in-voting/',
  },
  /** @param {Voting.State} state */
  getValueForState(state) {
    // @ts-ignore
    const data = mailData.summary.find(s => s.key === 'when_mailin').values;
    const dataForState = data.find(s => s.state === state.name || s.code === state.shortCode);
    if (!dataForState) return null;

    return ['recieved-by-election-day', 'postmarked-by-election-day'][dataForState.category];
  }
});

/*Maryland Maryland
New Jersey New Jersey
Illinois Illinois
Hawaii Hawaii
Washington (state) Washington
Massachusetts Massachusetts
Washington, D.C. District of Columbia
Vermont Vermont
California California
Rhode Island Rhode Island
New York (state) New York
Connecticut Connecticut
Colorado Colorado
Delaware Delaware
New Mexico New Mexico
Oregon Oregon
*/

processFromFn({
  category: {
    name: 'nationalPopularVote',
    weight: 0, // Set later.
    rubric: {
      yes: 1,
      no: 0,
    },
    sources: 'https://en.wikipedia.org/wiki/National_Popular_Vote_Interstate_Compact',
  },
  /** @param {Voting.State} state */
  getValueForState(state) {
    if (state.shortCode === 'USAF') return null;

    return [
      'New Jersey',
      'Illinois',
      'Hawaii',
      'Washington',
      'Massachusetts',
      'District Of Columbia',
      'Vermont',
      'California',
      'Rhode Island',
      'New York',
      'Connecticut',
      'Colorado',
      'Delaware',
      'New Mexico',
      'Oregon',
    ].includes(state.name) ? 'yes' : 'no';
  }
})

/** @type {Record<string, number>} */
const weights = {
  voteByMail: 5,
  rankedChoice: 4,
  sameDayRegistration: 3,
  votingCenters: 2,
  processMailBallots: 1,
  arriveMailBallots: 1,
  nationalPopularVote: 0.5,
};

for (const category of Object.values(results.categories)) {
  if (!weights[category.name]) throw new Error('missing weight for ' + category.name);
  category.weight = weights[category.name];
}

/**
 * @param {Voting.State} state
 */
function calculateStateScore(state) {
  const totalWeight = Object.values(weights).reduce((acc, cur) => acc + cur, 0);

  let score = 0;
  for (const [name, weight] of Object.entries(weights)) {
    const category = results.categories[name];
    const highestScoreForCategory = Math.max(...Object.values(category.rubric));
    const categoryScore = (state.data[name].score || 0) / highestScoreForCategory;
    score += categoryScore * weight / totalWeight;
  }

  return Math.round(score * 10000) / 10000;
}

for (const state of results.states) {
  state.score = calculateStateScore(state);
}

// Don't show these for now. Maybe just remove entirely.
results.states = results.states.filter(state => {
  return !['AS', 'GU', 'MP', 'PW', 'FM', 'MH', 'PR', 'VI'].includes(state.shortCode);
});

const errors = [];
for (const category of Object.values(results.categories)) {
  for (const score of Object.values(category.rubric)) {
    if (score < 0 || score > 1) errors.push(`invalid score of ${score} in ${category.name} rubric`);
  }
}

if (errors.length > 0) {
  throw new Error(errors.join('\n'));
}

fs.writeFileSync(`${__dirname}/data.json`, stringify(results, { maxLength: 1000 }));

const positions = [{
  "state": "Alabama",
  "code": "AL",
  "col": 9,
  "row": 7,
}, {
  "state": "Alaska",
  "code": "AK",
  "col": 2,
  "row": 1,
}, {
  "state": "Arizona",
  "code": "AZ",
  "col": 4,
  "row": 6,
}, {
  "state": "Arkansas",
  "code": "AR",
  "col": 7,
  "row": 6,
}, {
  "state": "California",
  "code": "CA",
  "col": 3,
  "row": 5,
}, {
  "state": "Colorado",
  "code": "CO",
  "col": 5,
  "row": 5,
}, {
  "state": "Connecticut",
  "code": "CT",
  "col": 12,
  "row": 4,
}, {
  "state": "District of Columbia",
  "code": "DC",
  "col": 11,
  "row": 6,
}, {
  "state": "Delaware",
  "code": "DE",
  "col": 12,
  "row": 5,
}, {
  "state": "Florida",
  "code": "FL",
  "col": 11,
  "row": 8,
}, {
  "state": "Georgia",
  "code": "GA",
  "col": 10,
  "row": 7,
}, {
  "state": "Hawaii",
  "code": "HI",
  "col": 2,
  "row": 8,
}, {
  "state": "Idaho",
  "code": "ID",
  "col": 4,
  "row": 3,
}, {
  "state": "Illinois",
  "code": "IL",
  "col": 8,
  "row": 3,
}, {
  "state": "Indiana",
  "code": "IN",
  "col": 8,
  "row": 4,
}, {
  "state": "Iowa",
  "code": "IA",
  "col": 7,
  "row": 4,
}, {
  "state": "Kansas",
  "code": "KS",
  "col": 6,
  "row": 6,
}, {
  "state": "Kentucky",
  "code": "KY",
  "col": 8,
  "row": 5,
}, {
  "state": "Louisiana",
  "code": "LA",
  "col": 7,
  "row": 7,
}, {
  "state": "Maine",
  "code": "ME",
  "col": 13,
  "row": 1,
}, {
  "state": "Maryland",
  "code": "MD",
  "col": 11,
  "row": 5,
}, {
  "state": "Massachusetts",
  "code": "MA",
  "col": 12,
  "row": 3,
}, {
  "state": "Michigan",
  "code": "MI",
  "col": 10,
  "row": 3,
}, {
  "state": "Minnesota",
  "code": "MN",
  "col": 7,
  "row": 3,
}, {
  "state": "Mississippi",
  "code": "MS",
  "col": 8,
  "row": 7,
}, {
  "state": "Missouri",
  "code": "MO",
  "col": 7,
  "row": 5,
}, {
  "state": "Montana",
  "code": "MT",
  "col": 5,
  "row": 3,
}, {
  "state": "Nebraska",
  "code": "NE",
  "col": 6,
  "row": 5,
}, {
  "state": "Nevada",
  "code": "NV",
  "col": 4,
  "row": 4,
}, {
  "state": "New Hampshire",
  "code": "NH",
  "col": 13,
  "row": 2,
}, {
  "state": "New Jersey",
  "code": "NJ",
  "col": 11,
  "row": 4,
}, {
  "state": "New Mexico",
  "code": "NM",
  "col": 5,
  "row": 6,
}, {
  "state": "New York",
  "code": "NY",
  "col": 11,
  "row": 3,
}, {
  "state": "North Carolina",
  "code": "NC",
  "col": 9,
  "row": 6,
}, {
  "state": "North Dakota",
  "code": "ND",
  "col": 6,
  "row": 3,
}, {
  "state": "Ohio",
  "code": "OH",
  "col": 9,
  "row": 4,
}, {
  "state": "Oklahoma",
  "code": "OK",
  "col": 6,
  "row": 7,
}, {
  "state": "Oregon",
  "code": "OR",
  "col": 3,
  "row": 4,
}, {
  "state": "Pennsylvania",
  "code": "PA",
  "col": 10,
  "row": 4,
}, {
  "state": "Rhode Island",
  "code": "RI",
  "col": 13,
  "row": 3,
}, {
  "state": "South Carolina",
  "code": "SC",
  "col": 10,
  "row": 6,
}, {
  "state": "South Dakota",
  "code": "SD",
  "col": 6,
  "row": 4,
}, {
  "state": "Tennessee",
  "code": "TN",
  "col": 8,
  "row": 6,
}, {
  "state": "Texas",
  "code": "TX",
  "col": 6,
  "row": 8,
}, {
  "state": "Utah",
  "code": "UT",
  "col": 4,
  "row": 5,
}, {
  "state": "Vermont",
  "code": "VT",
  "col": 12,
  "row": 2,
}, {
  "state": "Virginia",
  "code": "VA",
  "col": 10,
  "row": 5,
}, {
  "state": "Washington",
  "code": "WA",
  "col": 3,
  "row": 3,
}, {
  "state": "West Virginia",
  "code": "WV",
  "col": 9,
  "row": 5,
}, {
  "state": "Wisconsin",
  "code": "WI",
  "col": 9,
  "row": 3,
}, {
  "state": "Wyoming",
  "code": "WY",
  "col": 5,
  "row": 4,
}];

/**
 * @param {number} score
 */
function getColorForScore(score) {
  let color;
  if (score >= 0.7) color = 'green';
  else if (score >= 0.2) color = 'yellow';
  else color = 'red';
  return color;
}

/**
 * @param {Voting.Results} results
 * @param {string} categoryName
 */
function renderCategory(results, categoryName) {
  const margin = { top: 0, right: 0, bottom: 20, left: 0 };
  const mapW = (window.innerWidth >= 750 ? 680 : window.innerWidth - 20) + 100;
  const mapH = mapW * (3 / 4);
  const cellSize = 50;

  // Legend stuff!
  // Add hed/dek legend info:
  var titles = d3.select('#categories').append('div');
  titles.append('h2').html(categoryName);

  // Draw container for legend
  const rubric = Object.entries(results.categories[categoryName].rubric);
  rubric.sort((a, b) => b[1] - a[1]);
  var legend = titles.append('ul').attr('class', 'key').selectAll('li').data(rubric).enter().append('li').attr('class', 'key-item');

  // @ts-ignore
  const colors = {
    2: ['green', 'yellow'],
    3: ['green', 'yellow', 'red'],
    4: ['green', 'lightgreen', 'yellow', 'red'],
  }[rubric.length];
  if (!colors) {
    throw new Error('TODO');
  }

  legend.append('span').attr('class', 'key-block').style('background-color', function (d, i) {
    return colors[i];
  });

  // Legend text
  legend.append('p').html(function (d) {
    return d[0];
  });

  // Draw svg
  const svg = d3.select('#categories').append('svg').attr('width', mapW + margin.left + margin.right).attr('height', mapH + margin.top + margin.bottom);

  // Draw grid map group
  const gridMap = svg.append('g').attr('class', 'gridmap').attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

  // Filter by match
  var currView = [];
  let numUnknownPositions = 0;
  for (const state of results.states) {
    const position_ = positions.find(p => p.code === state.shortCode);
    let position;
    if (position_) {
      position = { row: position_.row, col: position_.col };
    } else {
      position = {
        row: 1 + numUnknownPositions++,
        col: 15,
      };
    }

    currView.push({ shortCode: state.shortCode, score: state.data[categoryName].score, value: state.data[categoryName].value, position });
  }

  // Use a key function to bind our cell squares to the states
  var states = gridMap.selectAll('.state').data(currView, function (d) {
    return d.shortCode;
  });

  // Draw state rectangles
  states.enter().append('rect').attr('class', function (d) {
    return 'state ' + d.shortCode;
  }).attr('x', function (d) {
    return (d.position.col - 1) * cellSize;
  }).attr('y', function (d) {
    return (d.position.row - 1) * cellSize;
  }).attr('width', cellSize).attr('height', cellSize).style('fill', function (d) {
    if (d.value === null) return 'lightgrey';

    const rank = rubric.findIndex(r => r[0] === d.value);
    return colors[rank] || 'red';
  });//.on('click', selectState);

  // Draw labels for states
  var labels = gridMap.selectAll('.label').data(currView, function (d) {
    return d.shortCode;
  });

  // add state labels
  labels.enter().append('text').attr('class', function (d) {
    return 'label ' + d.shortCode;
  }).attr('x', function (d) {
    return (d.position.col - 1) * cellSize + cellSize / 2;
  }).attr('y', function (d) {
    return (d.position.row - 1) * cellSize + (cellSize / 2 + 5);
  }).style('text-anchor', 'middle').text(function (d) {
    return d.shortCode;
  });

  var sources = d3.select('#categories').append('div');
  sources.append('p').html(results.categories[categoryName].sources);
}

/**
 * @param {Voting.Results} results
 */
function renderTable(results) {
  /** @type {Record<string, {}>} */
  const stateSpecificStyles = {};
  for (const state of results.states) {
    stateSpecificStyles[state.shortCode] = { fill: getColorForScore(state.score) };
  }

  // @ts-ignore
  $('#map').usmap({
    stateSpecificStyles,
  });

  const tableEl = document.querySelector('#table');
  const categoryCol = {
    sorter: (a, b) => a.score - b.score,
    formatter: cell => {
      let val = '';

      val += cell.getValue().value;
      val += ` (${cell.getValue().score})`;
      if (cell.getValue().notes) {
        val += '*';
      }

      return val;
    },
  };
  const table = new Tabulator(tableEl, {
    data: results.states, // load row data from array
    height: '100%',
    layout: 'fitColumns', // fit columns to width of table
    tooltips: cell => {
      if (!cell.getValue() || !cell.getValue().notes) return false;
      return cell.getValue().notes;
    },
    addRowPos: 'top', // when adding a new row, add it to the top of the table
    history: true, // allow undo and redo actions on the table
    resizableRows: true, // allow row order to be changed
    initialSort: [ // set the initial sort order of the data
      { column: 'score', dir: 'desc' },
    ],
    columns: [ // define the table columns
      { title: 'Name', field: 'name' },
      { title: 'Score', field: 'score', align: 'left', formatter: cell => `${Math.floor(cell.getValue() * 100)}%` },
      { title: 'Vote By Mail', field: 'data.voteByMail', ...categoryCol },
      { title: 'Voting Centers', field: 'data.votingCenters', ...categoryCol },
      { title: 'Ranked Choice', field: 'data.rankedChoice', ...categoryCol },
      { title: 'Same Day Registration', field: 'data.sameDayRegistration', ...categoryCol },
      { title: 'Process Mail Ballots', field: 'data.processMailBallots', ...categoryCol },
      { title: 'Arrive Mail Ballots', field: 'data.arriveMailBallots', ...categoryCol },
    ],
  });

  const sourcesHtml = Object.values(results.categories)
    .map(c => `${c.name}:<br>${c.sources.replace(/\n/g, '<br>')}`)
    .join('<br><br>');
  document.querySelector('#sources').innerHTML = sourcesHtml;
}

async function main() {
  /** @type {Voting.Results} */
  const results = await fetch('data/data.json').then(r => r.json());

  for (const categoryName of Object.keys(results.categories)) {
    renderCategory(results, categoryName);
  }
  renderTable(results);
}

main();

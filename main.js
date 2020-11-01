async function main() {
  /** @type {Voting.Results} */
  const data = await fetch('data/data.json').then(r => r.json());

  /** @type {Record<string, {}>} */
  const stateSpecificStyles = {};
  for (const state of data.states) {
    let fill;
    if (state.score >= 0.7) fill = 'green';
    else if (state.score >= 0.2) fill = 'yellow';
    else fill = 'red';
    stateSpecificStyles[state.shortCode] = { fill };
  }

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
    data: data.states, // load row data from array
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

  const sourcesHtml = Object.values(data.categories)
    .map(c => `${c.name}:<br>${c.sources.replace(/\n/g, '<br>')}`)
    .join('<br><br>');
  document.querySelector('#sources').innerHTML = sourcesHtml;
}

main();

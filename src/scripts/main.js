'use strict';

const thead = document.querySelector('thead').querySelector('tr');
let workerData;
const clickCounts = {};

// #region sorting

thead.addEventListener('click', (e) => {
  workerData = [];

  // eslint-disable-next-line max-len
  const allWorkers = [...document.querySelector('tbody').querySelectorAll('tr')];
  // eslint-disable-next-line max-len
  const theadElements = [...document.querySelector('thead').querySelectorAll('th')];

  collect(allWorkers, theadElements);

  if (!clickCounts.hasOwnProperty(`${e.target.innerText}`)) {
    clickCounts[e.target.innerText] = 0;
  }

  // eslint-disable-next-line max-len
  const sortedData = sort(workerData, e.target.innerText, clickCounts[e.target.innerText]);

  clickCounts[e.target.innerText]++;

  for (const key in clickCounts) {
    if (key !== e.target.innerText) {
      clickCounts[key] = 0;
    }
  }

  changeData(allWorkers, theadElements, sortedData);
});

function collect(allWorkers, theadElements) {
  allWorkers.forEach((worker) => {
    const workerInfo = {};

    for (let j = 0; j < theadElements.length; j++) {
      workerInfo[theadElements[j].innerText] = worker.children[j].innerText;
    }

    workerData.push(workerInfo);
  });
}

function sort(list, sortLine, direction) {
  switch (sortLine) {
    case 'Name':
    case 'Position':
    case 'Office':
      return sortString(list, sortLine, direction);
    case 'Age':
      return sortNumbers(list, sortLine, direction);
    case 'Salary':
      return sortSalary(list, sortLine, direction);
  }
}

function sortSalary(list, sortLine, direction) {
  return (direction % 2 === 0)
    ? list
      .sort((personA, personB) => (
        fromDollars(personA[sortLine]) - fromDollars(personB[sortLine])
      ))
    : list
      .sort((personA, personB) => (
        fromDollars(personB[sortLine]) - fromDollars(personA[sortLine])
  ));
}

function sortNumbers(list, sortLine, direction) {
  return (direction % 2 === 0)
    ? list
      .sort((personA, personB) => (
        personA[sortLine] - personB[sortLine]
      ))
    : list
      .sort((personA, personB) => (
        personB[sortLine] - personA[sortLine]
      ));
}

function sortString(list, sortLine, direction) {
  return (direction % 2 === 0)
    ? list
      .sort((personA, personB) => (
        personA[sortLine].localeCompare(personB[sortLine])
      ))
    : list
      .sort((personA, personB) => (
        personB[sortLine].localeCompare(personA[sortLine])
      ));
}

function fromDollars(salary) {
  return +salary.replace(/[$,]/g, '');
}

function changeData(allWorkers, theadElements, list) {
  allWorkers.forEach((worker, index) => {
    for (let j = 0; j < worker.children.length; j++) {
      worker.children[j].innerText = list[index][theadElements[j].innerText];
    }
  });
}

// #endregion

// #region selection

const tbody = document.querySelector('tbody');

tbody.addEventListener('click', (e) => {
  for (const child of tbody.children) {
    child.className = '';
  }

  e.target.closest('tr').className += 'active';
});

// #endregion

// #region adding form

const body = document.querySelector('body');

const form = `
  <form class='new-employee-form'>
    <label>Name:
      <input
        name="name"
        type="text"
        minlength=4
        data-qa="name"
        required
      >
    </label>

    <label>Position:
      <input
        name="position"
        type="text"
        minlength=6
        data-qa="position"
        required
      >
    </label>

    <label>Office:
      <select data-qa="office" required>
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>

    <label>Age:
      <input
        name="age"
        type="number"
        max=90
        min=18
        data-qa="age"
        required
      >
    </label>

    <label>Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
        required
      >
    </label>
    <button>Save to table</button>
  </form>
`;

body.insertAdjacentHTML('beforeend', form);

// #endregion

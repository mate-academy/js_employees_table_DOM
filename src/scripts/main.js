'use strict';

const thead = document.querySelector('thead').querySelector('tr');
const tbody = document.querySelector('tbody');
let workerData;
const clickCounts = {};

// #region sorting

thead.addEventListener('click', (e) => {
  workerData = [];

  const allWorkers = [...document.querySelector('tbody')
    .querySelectorAll('tr')];
  const theadElements = [...document.querySelector('thead')
    .querySelectorAll('th')];

  collect(allWorkers, theadElements);

  if (!clickCounts.hasOwnProperty(`${e.target.innerText}`)) {
    clickCounts[e.target.innerText] = 0;
  }

  // eslint-disable-next-line max-len
  const sortedData = sort(
    workerData,
    e.target.innerText,
    clickCounts[e.target.innerText]
  );

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
  const copyOfList = [...list];

  switch (sortLine) {
    case 'Name':
    case 'Position':
    case 'Office':
      return sortString(copyOfList, sortLine, direction);
    case 'Age':
      return sortNumbers(copyOfList, sortLine, direction);
    case 'Salary':
      return sortSalary(copyOfList, sortLine, direction);
  }
}

function sortSalary(list, sortLine, direction) {
  const copyOfList = [...list];

  return copyOfList
    .sort((personA, personB) => {
      return direction % 2 === 0
        ? fromDollars(personA[sortLine]) - fromDollars(personB[sortLine])
        : fromDollars(personB[sortLine]) - fromDollars(personA[sortLine]);
    });
}

function sortNumbers(list, sortLine, direction) {
  const copyOfList = [...list];

  return copyOfList
    .sort((personA, personB) => {
      return direction % 2 === 0
        ? personA[sortLine] - personB[sortLine]
        : personB[sortLine] - personA[sortLine];
    });
}

function sortString(list, sortLine, direction) {
  const copyOfList = [...list];

  return copyOfList
    .sort((personA, personB) => {
      return direction % 2 === 0
        ? personA[sortLine].localeCompare(personB[sortLine])
        : personB[sortLine].localeCompare(personA[sortLine]);
    });
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
  <form action='#' method='post' class='new-employee-form'>
    <label>Name:
      <input
        name="name"
        type="text"
        data-qa="name"
        required
      >
    </label>

    <label>Position:
      <input
        name="position"
        type="text"
        data-qa="position"
        required
      >
    </label>

    <label>Office:
      <select
        name="office"
        data-qa="office"
        required
      >
        <option value='Tokyo'>Tokyo</option>
        <option value='Singapore'>Singapore</option>
        <option value='London'>London</option>
        <option value='New York'>New York</option>
        <option value='Edinburgh'>Edinburgh</option>
        <option value='San Francisco'>San Francisco</option>
      </select>
    </label>

    <label>Age:
      <input
        name="age"
        type="number"
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
    <button type='submit'>Save to table</button>
  </form>
`;

body.insertAdjacentHTML('beforeend', form);

// #endregion

// #region collect data

const formField = document.querySelector('form');
let data;

formField.addEventListener('submit', (e) => {
  e.preventDefault();

  data = new FormData(formField);

  if (data.get('name').replace(/[\d\s]/g, '').length < 4) {
    pushNotification(10, 10, 'Incorrect name input',
      'Worker name\n '
      + 'has less than 4 letters', 'error');
    document.querySelector('input[data-qa="name"]').value = '';

    return;
  }

  if (+data.get('age') < 18 || +data.get('age') > 90) {
    pushNotification(10, 10, 'Incorrect age input',
      'Worker age\n '
      + 'need to be between 18 and 90', 'error');
    document.querySelector('input[data-qa="age"]').value = '';

    return;
  }

  const newEmployer = `
  <tr>
    <td>${data.get('name')}</td>
    <td>${data.get('position')}</td>
    <td>${data.get('office')}</td>
    <td>${data.get('age')}</td>
    <td>${numberToDollars(data.get('salary'))}</td>
  </tr>
  `;

  tbody.insertAdjacentHTML('afterbegin', newEmployer);

  pushNotification(10, 10, 'New worker card was added',
    '', 'success');

  document.querySelectorAll('input').forEach(input => {
    input.value = '';
  });

  document.querySelector('select').value = 'Tokyo';
});

function numberToDollars(salary) {
  return `$${(+salary).toLocaleString('en')}`;
}

// #endregion

// #region notifications

const pushNotification = (posTop, posRight, title, description, type) => {
  const messageBody = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageText = document.createElement('p');

  messageBody.className = `notification ${type}`;
  messageBody.dataset.qa = `notification`;
  messageTitle.className = 'title';
  messageBody.style.top = `${posTop}px`;
  messageBody.style.right = `${posRight}px`;
  messageTitle.style.letterSpacing = '-1px';
  messageTitle.innerText = title;
  messageText.innerText = description;
  messageBody.append(messageTitle, messageText);

  body.append(messageBody);

  setTimeout(() => {
    messageBody.remove();
  }, 3500);
};

// #endregion

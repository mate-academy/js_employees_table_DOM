'use strict';

const table = document.querySelector('table');
const [tHead, tBody] = table.children;
const tableBodyRows = [...tBody.rows];
const tablesTitles = [...tHead.children[0].cells]
  .map(td => td.textContent.trim().toLowerCase());

function sortedTable(index, typesSort, methodSort) {
  const bodyRows = [...tBody.rows];

  bodyRows.sort((a, b) => {
    let partA = a.children[index].innerHTML;
    let partB = b.children[index].innerHTML;

    if (typesSort) {
      partA = partA.replace(/\D/g, '');
      partB = partB.replace(/\D/g, '');

      return methodSort ? partA - partB : partB - partA;
    }

    return methodSort ? partA.localeCompare(partB) : partB.localeCompare(partA);
  }).forEach(el => tBody.append(el));
}

tHead.addEventListener('click', (e) => {
  const index = Array.from(e.target.parentElement.children)
    .findIndex(el => el.innerHTML === e.target.innerHTML);
  const wasSortingAlready = e.target.classList.contains('sort-asc');

  if (wasSortingAlready) {
    e.target.classList.remove('sort-asc');
    e.target.classList.toggle('sort-desc');
  } else {
    tHead.querySelectorAll('th').forEach(th =>
      th.classList.remove('sort-asc', 'sort-desc'));
    e.target.classList.add('sort-asc');
  }

  const methodSort = e.target.classList.value === 'sort-asc' ? 1 : 0;
  const typesSort = index <= 2 ? 0 : 1;

  sortedTable(index, typesSort, methodSort);
});

tableBodyRows.forEach(row => {
  const rowChildren = row.children;
  const tablesTitlesLength = tablesTitles.length;

  for (let i = 0; i < tablesTitlesLength; i++) {
    if (!rowChildren[i].dataset.qa) {
      rowChildren[i].dataset.qa = tablesTitles[i];
    }
  }
});

tBody.addEventListener('click', (e) => {
  const elem = e.target;
  const prevElem = tBody.querySelector('tr.active');

  if (prevElem) {
    prevElem.classList.remove('active');
  }

  elem.parentElement.classList.add('active');
});

const arrCountry = [
  'Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco',
];
const formHtml = `
  <form action="/" method="get" class="new-employee-form">
    <label>Name: <input name="name" type="text" autocomplete="off"></label>
    <label>Position: <input name="position" type="text"></label>
    <label>Age: <input name="age" type="number"></label>
    <label>
      Office: 
      <select name="office">
      ${arrCountry
    .map(country => `<option value="${country}">${country}</option>`).join()}
      </select>
    </label>
    <label>Salary: <input name="salary" type="number"></label>
    <button type="submit">Save to table</button>
  </form >
`;

document.body.insertAdjacentHTML('beforeend', formHtml);

const form = document.querySelector('.new-employee-form');
const formElements = form.elements;
const inputName = formElements.name;
const inputPosition = formElements.position;
const inputOffice = formElements.office;
const inputAge = formElements.age;
const inputSalary = formElements.salary;
const positionMessage = {
  topDefault: 10,
  rightDefault: 10,
  top: 10,
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const [message, resultValidation, field] = formValidation();

  pushNotification(
    positionMessage.top,
    positionMessage.rightDefault,
    resultValidation ? 'Success' : 'warning',
    message, resultValidation ? 'success' : 'warning'
  );

  if (field) {
    const targetField = form.querySelector(`input[name="${field}"]`);

    targetField.focus();
  };

  if (resultValidation) {
    tBody.insertAdjacentHTML('beforeend', maskNewRow());
    form.reset();
  }
});

function formValidation() {
  const settings = {
    minLengthName: 4,
    minAge: 18,
    maxAge: 90,
  };
  const message = {
    errNam: 'The minimum length of the \'name\' field is 4 characters',
    errAge: {
      less: +inputAge.value
        ? `Your age is ${inputAge.value}, You are too young`
        : `Enter the field 'age'`,
      more: +inputAge.value
        ? `Your age is ${inputAge.value}, You are too old`
        : `Enter the field 'age'`,
    },
    success: `User ${inputName.value} - added successfully`,
  };

  if (inputName.value.length < settings.minLengthName) {
    return [message.errNam, false, 'name'];
  } else if (inputAge.value < settings.minAge) {
    return [message.errAge.less, false, 'age'];
  } else if (inputAge.value > settings.maxAge) {
    return [message.errAge.more, false, 'age'];
  };

  return [message.success, true];
};

const pushNotification = (posTop, posRight, title, description, type) => {
  const body = document.querySelector('body');
  const block = `
    <div class="notification ${type} data-qa="notification"" 
      style="top: ${posTop}px; right="${posRight}px""
    >
      <h2 class="title">${title}</h2>
      <p>${description}</p>
    </div>
  `;

  body.insertAdjacentHTML('afterbegin', block);
  positionMessage.top += 140;

  setTimeout(() => {
    document.querySelector(`.notification`).remove();
    positionMessage.top -= 140;
  }, 2000);
};

function maskNewRow() {
  return `
    <tr>
      <td data-qa="name">${inputName.value}</td>
      <td data-qa="position">
        ${inputPosition.value.length ? inputPosition.value : '--'}
      </td>
      <td data-qa="office">${inputOffice.value}</td>
      <td data-qa="age">${inputAge.value}</td>
      <td data-qa="salary">${convertToCurrent(inputSalary.value)}</td>
    </tr>
  `;
};

function convertToCurrent(number) {
  const numConvert = +number;

  return `$${number ? numConvert.toLocaleString('en-US') : 0}`;
};

tBody.addEventListener('dblclick', (e) => {
  const elem = e.target;

  if (elem.tagName === 'TD') {
    const elemValue = elem.textContent;

    elem.innerHTML = `
      <input type="text" class="cell-input" value="${elemValue}">
    `;

    const input = elem.querySelector('.cell-input');

    input.focus();
    input.selectionStart = elemValue.length;

    input.addEventListener('blur', () => {
      elem.innerHTML = input.value;
    });

    input.addEventListener('keydown', (event) => {
      if (event.code === 'Enter') {
        elem.innerHTML = input.value;
      }
    });
  };
});

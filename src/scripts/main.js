'use strict';

// const page = document.querySelector('body');
const table = document.querySelector('table');
const tableBody = document.querySelector('tbody');
const tableHead = document.querySelector('thead');
const tableFoot = document.querySelector('tfoot');
// const tr = document.querySelectorAll('tr');

// Head Events

tableHead.addEventListener('click', (sortEvent) => {
  const target = sortEvent.target.closest('th');
  const index = [...tableHead.rows[0].cells].indexOf(target);
  const tableEl = tableBody.rows[0].cells[index].textContent
    .replace(/\$/g, '')
    .trim();

  if (!isNaN(parseInt(tableEl))) {
    const sorted = [...tableBody.rows].sort((a, b) => {
      const aEl = parseInt(
        a.cells[index].textContent.replace(/\$/g, '').trim(),
      );

      const bEl = parseInt(
        b.cells[index].textContent.replace(/\$/g, '').trim(),
      );

      const c = aEl - bEl;

      return c;
    });

    tableBody.append(...sorted);
  }

  if (isNaN(parseInt(tableEl))) {
    const sorted = [...tableBody.rows].sort((a, b) => {
      const aEl = a.cells[index].textContent;

      const bEl = b.cells[index].textContent;

      const c = aEl.localeCompare(bEl);

      return c;
    });

    tableBody.append(...sorted);
  }
});

// Foot Events

function hover(hoverEvent) {
  const target = hoverEvent.target.closest('th');

  target.style.cursor = 'pointer';
  target.style.backgroundColor = '#e25644';
  target.style.color = '#fff400';
}

tableFoot.addEventListener('mouseover', hover);

tableFoot.addEventListener('mouseout', (staticEvents) => {
  const target = staticEvents.target.closest('th');

  target.style.pointerEvents = 'pointer';
  target.style.backgroundColor = '#f5f5f5';
  target.style.color = 'gray';
});

// Foot Events Sort

tableFoot.addEventListener('click', (sortEventReverce) => {
  // debugger;

  const target = sortEventReverce.target.closest('th');
  const index = [...tableFoot.rows[0].cells].indexOf(target);
  const tableEl = tableBody.rows[0].cells[index].textContent
    .replace(/\$/g, '')
    .trim();

  if (!isNaN(parseInt(tableEl))) {
    const sorted = [...tableBody.rows].sort((a, b) => {
      const aEl = parseInt(
        a.cells[index].textContent.replace(/\$/g, '').trim(),
      );

      const bEl = parseInt(
        b.cells[index].textContent.replace(/\$/g, '').trim(),
      );

      const c = bEl - aEl;

      return c;
    });

    tableBody.append(...sorted);
  }

  if (isNaN(parseInt(tableEl))) {
    const sorted = [...tableBody.rows].sort((a, b) => {
      const aEl = a.cells[index].textContent;

      const bEl = b.cells[index].textContent;

      const c = bEl.localeCompare(aEl);

      return c;
    });

    tableBody.append(...sorted);
  }
});

// Body Events

let selectedRow = null;

tableBody.addEventListener('click', (selectEvent) => {
  const target = selectEvent.target.closest('tr');

  if (selectedRow === null) {
    target.classList.add('active');
    selectedRow = target;

    return;
  }

  if (target === selectedRow) {
    target.classList.remove('active');
    selectedRow = null;
  }

  if (target !== selectedRow) {
    selectedRow.classList.remove('active');
    target.classList.add('active');
    selectedRow = target;
  }
});

// Create Form

const inputNames = ['name', 'position', 'office', 'age', 'salary'];
const countries = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const form = document.createElement('form');

form.setAttribute('class', 'new-employee-form');

table.insertAdjacentElement('afterend', form);

const buttonForm = document.createElement('button');

createInputs();

function createInputs() {
  for (const input of inputNames) {
    const newLable = document.createElement('label');

    if (input === 'office') {
      const newSelect = document.createElement('select');

      newLable.innerText = input.charAt(0).toUpperCase() + input.slice(1);
      newSelect.setAttribute('data-qa', `${input}`);
      newSelect.required = true;
      newSelect.setAttribute('data-qa', 'notification');
      newLable.append(newSelect);

      createSelect(newSelect);
    } else {
      const newInput = document.createElement('input');

      newLable.innerText = input.charAt(0).toUpperCase() + input.slice(1);
      newInput.setAttribute('data-qa', `${input}`);
      newInput.required = true;
      // newInput.setAttribute('data-qa', 'notification');

      switch (input) {
        case 'name':
        case 'position':
          newInput.setAttribute('type', 'text');

          break;

        case 'age':
        case 'salary':
          newInput.setAttribute('type', 'number');

          break;
      }
      newLable.append(newInput);
    }
    form.append(newLable);
  }

  buttonForm.innerText = 'Save to table';
  buttonForm.setAttribute('type', 'submit');

  form.append(buttonForm);
}

function createSelect(newSelect) {
  countries.forEach((country) => {
    const option = document.createElement('option');

    option.setAttribute('value', country);
    option.innerText = country;
    newSelect.insertAdjacentElement('beforeend', option);
  });
}

// Forms Events

const labels = document.querySelectorAll('label');

buttonForm.addEventListener('click', (buttonEvent) => {
  buttonEvent.preventDefault();
  runValidation();

  if (countError === 0) {
    const newRow = document.createElement('tr');

    [...labels].forEach((label) => {
      const newTd = document.createElement('td');
      const element = label.querySelector('input, select');

      if (element) {
        const text =
          element.tagName === 'INPUT'
            ? element.value
            : element.options[element.selectedIndex].text;

        if (label.textContent === 'Salary') {
          newTd.innerText = `$${Number(text).toFixed(3).toString().replace('.', ',')}`;
        } else {
          newTd.innerText = text;
        }
      }

      if (element.textContent === 'Salary') {
        const text =
          element.tagName === 'INPUT'
            ? element.value
            : element.options[element.selectedIndex].text;

        newTd.innerText = text;
      }

      newRow.append(newTd);
    });
    tableBody.insertAdjacentElement('beforeend', newRow);
  }
});

let countError = 0;

function runValidation() {
  const personName = document.querySelector('[data-qa="name"]');
  const age = document.querySelector('[data-qa = "age"]');

  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.setAttribute('class', 'notification');
  notification.style.background = 'rgba(222, 0, 0, 0.67)';
  notification.style.color = '#fff';

  if (personName.value.length < 4) {
    notification.innerText = 'to shourt name!';

    form.append(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000);

    personName.classList.add('error');
    countError++;
  } else {
    personName.classList.add('success');
  }

  if (age.value < 18 || age.value > 90) {
    notification.innerText = 'invalid age!';

    form.append(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000);

    age.classList.add('error');
    countError++;
  } else {
    age.classList.add('success');
  }

  // page.append(notification);

  return countError;
}

// Optional table Events

table.addEventListener('dblclick', (dblclickEvent) => {
  const target = dblclickEvent.target.closest('td');

  if (!target) {
    return;
  }

  target.innerText = '';
  target.classList.add('cell-input');
});

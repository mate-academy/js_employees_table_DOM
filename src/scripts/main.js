'use strict';

const tableHeader = Array.from(
  document.querySelector('thead').querySelectorAll('th'),
);

const notification = document.createElement('div');

notification.classList.add('notification');

const description = document.createElement('p');

notification.append(description);
notification.style.visibility = 'hidden';
document.body.append(notification);

const inputFields = [
  {
    label: { text: 'Name: ' },
    input: { name: 'name', type: 'text' },
    validator: (field) => {
      return field.length >= 4;
    },
  },
  {
    label: { text: 'Position: ' },
    input: { name: 'position', type: 'text' },
  },
  {
    label: { text: 'Office: ' },
    input: {
      type: 'select',
      name: 'office',
      id: 'office-select',
      options: [
        { value: 'Tokyo', text: 'Tokyo' },
        { value: 'Singapore', text: 'Singapore' },
        { value: 'London', text: 'London' },
        { value: 'New York', text: 'New York' },
        { value: 'Edinburgh', text: 'Edinburgh' },
        { value: 'San Francisco', text: 'San Francisco' },
      ],
    },
  },
  {
    label: { text: 'Age: ' },
    input: { name: 'age', type: 'number' },
    validator: (field) => {
      return field >= 18 && field < 90;
    },
  },
  {
    label: { text: 'Salary: ' },
    input: { name: 'salary', type: 'number' },
  },
];

const tbody = document.querySelector('tbody');

const Sort = Object.freeze({
  ASC: 'asc',
  DESC: 'desc',
});

function sortRows(r, sortHeader, sort) {
  let srt;
  let cI;

  switch (sortHeader) {
    case 'Name':
      srt = (a, b) =>
        sort === Sort.ASC ? a.localeCompare(b) : b.localeCompare(a);
      cI = 0;
      break;
    case 'Position':
      srt = (a, b) =>
        sort === Sort.ASC ? a.localeCompare(b) : b.localeCompare(a);
      cI = 1;
      break;
    case 'Office':
      srt = (a, b) =>
        sort === Sort.ASC ? a.localeCompare(b) : b.localeCompare(a);
      cI = 2;
      break;
    case 'Age':
      srt = (a, b) => (sort === Sort.ASC ? a - b : b - a);
      cI = 3;
      break;
    case 'Salary':
      srt = (a, b) =>
        sort === Sort.ASC
          ? parseInt(a.replace('$', '').replace(',', '')) -
            parseInt(b.replace('$', '').replace(',', ''))
          : parseInt(b.replace('$', '').replace(',', '')) -
            parseInt(a.replace('$', '').replace(',', ''));
      cI = 4;
      break;
  }

  if (srt) {
    r.sort((a, b) => srt(a.cells[cI].innerText, b.cells[cI].innerText));
  }
}

tableHeader.forEach((th) => {
  th.addEventListener('click', (e) => {
    const rows = Array.from(document.querySelector('tbody').rows);

    tableHeader.forEach((thead) => {
      if (thead !== e.target) {
        thead.removeAttribute('data-sort');
      }
    });

    switch (e.target.getAttribute('data-sort')) {
      case Sort.ASC:
        sortRows(rows, e.target.textContent, Sort.DESC);
        e.target.setAttribute('data-sort', Sort.DESC);
        break;
      case Sort.DESC:
        sortRows(rows, e.target.textContent, Sort.ASC);
        e.target.setAttribute('data-sort', Sort.ASC);
        break;
      default:
        sortRows(rows, e.target.textContent, Sort.ASC);
        e.target.setAttribute('data-sort', Sort.ASC);
        break;
    }

    tbody.replaceChildren();
    rows.forEach((row) => tbody.appendChild(row));
  });
});

tbody.onclick = (e) => {
  tbody.querySelector('.active')?.classList.remove('active');
  e.target.closest('tr').classList.add('active');
};

function createForm() {
  const form = document.createElement('form');

  form.onsubmit = (e) => {
    e.preventDefault();

    if (!validateForm(form)) {
      return;
    }

    const tr = document.createElement('tr');

    for (const input of form.querySelectorAll('[data-qa]')) {
      const td = document.createElement('td');

      if (input.name !== 'salary') {
        td.innerText = input.value;
      } else {
        td.innerText = `$${Number(input.value).toLocaleString('en-US')}`;
      }
      tr.appendChild(td);
    }
    tbody.append(tr);
  };

  form.classList.add('new-employee-form');

  for (const elem of inputFields) {
    let inputField;
    const label = document.createElement('label');

    label.innerText = elem.label.text;

    if (elem.input.type === 'select') {
      inputField = document.createElement('select');
      inputField.setAttribute('name', elem.input.name);
      inputField.setAttribute('id', elem.input.id);

      for (const option of elem.input.options) {
        const opt = document.createElement('option');

        opt.setAttribute('value', option.value);
        opt.innerText = option.text;

        inputField.append(opt);
      }
    } else if (elem.input !== undefined) {
      inputField = document.createElement('input');
      inputField.setAttribute('name', elem.input.name);
    }

    inputField.setAttribute('data-qa', elem.input.name);
    inputField.setAttribute('required', '');

    label.append(inputField);
    form.append(label);
  }

  const saveButton = document.createElement('button');

  saveButton.setAttribute('type', 'submit');

  saveButton.innerText = 'Save to table';

  form.append(saveButton);

  document.querySelector('body').append(form);
}

function validateForm(form) {
  let success;
  const invalidFields = [];

  for (const input of inputFields) {
    if (input.validator) {
      if (
        !input.validator(
          form.querySelector(`input[data-qa='${input.input.name}']`).value,
        )
      ) {
        invalidFields.push(input.input.name);
      }
    }
  }

  if (invalidFields.length === 0) {
    pushNotification();
    success = true;
  } else {
    pushNotification('error', `Invalid fields: ${invalidFields.join(', ')}`);
    success = false;
  }

  return success;
}

function pushNotification(st = 'success', message = 'Success') {
  notification.style.visibility = 'visible';
  description.innerText = message;

  notification.classList.add(st);
  notification.setAttribute('data-qa', 'notification');

  setTimeout(() => {
    notification.style.visibility = 'hidden';
    notification.classList.remove(st);
  }, 2000);
}

tbody.ondblclick = (e) => {
  const tdInput = document.createElement('input');

  const initValue = e.target.innerText;

  tdInput.classList.add('cell-input');

  tdInput.onkeydown = (e2) => {
    if (e2.key === 'Enter') {
      const val = e2.target.value.length !== 0 ? e2.target.value : initValue;

      e2.target.parentNode.innerText = val;
    }
  };

  tdInput.addEventListener('blur', (e2) => {
    const val = e2.target.value.length !== 0 ? e2.target.value : initValue;

    e2.target.parentNode.innerText = val;
  });

  e.target.innerText = '';
  e.target.appendChild(tdInput);

  tdInput.focus();
};

createForm();

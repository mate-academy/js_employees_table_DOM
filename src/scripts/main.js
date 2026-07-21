'use strict';

const table = document.querySelector('table');
const tableTh = table.querySelectorAll('th');

const tbody = table.querySelector('tbody');

let isFirstState = true;
let lastClickedindex = null;

tableTh.forEach((th, index) => {
  th.addEventListener('click', () => {
    const bodyTr = document.querySelectorAll('tbody tr');
    const trArr = [...bodyTr];

    if (index !== lastClickedindex) {
      lastClickedindex = index;

      trArr.sort((rowA, rowB) => {
        const textA = rowA.children[index].textContent;
        const textB = rowB.children[index].textContent;

        const numA = parseFloat(textA.replaceAll('$', '').replaceAll(',', '.'));
        const numB = parseFloat(textB.replaceAll('$', '').replaceAll(',', '.'));

        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }

        return textA.localeCompare(textB);
      });

      tbody.append(...trArr);
    } else {
      if (isFirstState) {
        trArr.sort((rowA, rowB) => {
          const textA = rowA.children[index].textContent;
          const textB = rowB.children[index].textContent;

          const numA = parseFloat(
            textA.replaceAll('$', '').replaceAll(',', '.'),
          );
          const numB = parseFloat(
            textB.replaceAll('$', '').replaceAll(',', '.'),
          );

          if (!isNaN(numA) && !isNaN(numB)) {
            return numB - numA;
          }

          return textB.localeCompare(textA);
        });

        tbody.append(...trArr);

        isFirstState = false;
      } else {
        trArr.sort((rowA, rowB) => {
          const textA = rowA.children[index].textContent;
          const textB = rowB.children[index].textContent;

          const numA = parseFloat(
            textA.replaceAll('$', '').replaceAll(',', '.'),
          );
          const numB = parseFloat(
            textB.replaceAll('$', '').replaceAll(',', '.'),
          );

          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }

          return textA.localeCompare(textB);
        });

        tbody.append(...trArr);

        isFirstState = true;
      }
    }
  });
});

tbody.addEventListener('click', (evt) => {
  const clickedRow = evt.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  const currentActive = document.querySelector('tr.active');

  if (currentActive) {
    currentActive.classList.remove('active');
  }

  clickedRow.classList.add('active');
});

tbody.addEventListener('dblclick', (e) => {
  const targetCell = e.target;

  if (targetCell.tagName !== 'TD') {
    return;
  }

  const currentCellInput = document.querySelector('.cell-input');

  if (currentCellInput) {
    return;
  }

  const defaultText = targetCell.textContent;

  targetCell.textContent = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = defaultText;
  targetCell.append(input);
  input.focus();

  function saveCell() {
    const newValue = input.value.trim();

    if (newValue === '') {
      targetCell.textContent = defaultText;
    } else {
      targetCell.textContent = newValue;
    }
  }

  input.addEventListener('blur', () => {
    saveCell();
  });

  input.addEventListener('keydown', (et) => {
    if (et.key === 'Enter') {
      saveCell();
    }
  });
});

function createElement(tag, className, props = {}) {
  const el = document.createElement(tag);

  if (className) {
    el.classList.add(className);
  }

  Object.assign(el, props);

  return el;
}

const form = createElement('form', 'new-employee-form', { noValidate: true });
const nameLabel = createElement('label', '', { textContent: 'Name:' });
const nameInput = createElement('input', '', {
  type: 'text',
  name: 'name',
  required: true,
});

nameInput.dataset.qa = 'name';
nameLabel.append(nameInput);
form.append(nameLabel);

const posLabel = createElement('label', '', { textContent: 'Position:' });
const posInput = createElement('input', '', {
  type: 'text',
  name: 'position',
  required: true,
});

posInput.dataset.qa = 'position';
posLabel.append(posInput);
form.append(posLabel);

const officeLabel = createElement('label', '', { textContent: 'Office:' });
const select = createElement('select', '', { name: 'office', required: true });
const optionTokyo = createElement('option', '', {
  textContent: 'Tokyo',
  value: 'Tokyo',
});
const optionSingapore = createElement('option', '', {
  textContent: 'Singapore',
  value: 'Singapore',
});
const optionLondon = createElement('option', '', {
  textContent: 'London',
  value: 'London',
});
const optionNewYork = createElement('option', '', {
  textContent: 'New York',
  value: 'New York',
});
const optionEdinburgh = createElement('option', '', {
  textContent: 'Edinburgh',
  value: 'Edinburgh',
});
const optionSanFrancisco = createElement('option', '', {
  textContent: 'San Francisco',
  value: 'San Francisco',
});

select.append(
  optionTokyo,
  optionSingapore,
  optionLondon,
  optionNewYork,
  optionEdinburgh,
  optionSanFrancisco,
);
select.dataset.qa = 'office';
officeLabel.append(select);
form.append(officeLabel);

const ageLabel = createElement('label', '', { textContent: 'Age:' });
const ageInput = createElement('input', '', {
  type: 'number',
  name: 'age',
  required: true,
});

ageInput.dataset.qa = 'age';
ageLabel.append(ageInput);
form.append(ageLabel);

const salLabel = createElement('label', '', { textContent: 'Salary:' });
const salInput = createElement('input', '', {
  type: 'number',
  name: 'salary',
  required: true,
});

salInput.dataset.qa = 'salary';
salLabel.append(salInput);
form.append(salLabel);

const button = createElement('button', '', {
  type: 'submit',
  textContent: 'Save to table',
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const userName = formData.get('name');
  const position = formData.get('position');
  const office = formData.get('office');
  const age = formData.get('age');
  const salary = formData.get('salary');
  const cleanSalary = parseFloat(salary.replace(/[^0-9.-]/g, ''));
  const formatSalary = cleanSalary.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  if (userName.trim().length < 4) {
    pushNotification(
      10,
      10,
      'Error',
      'Message.\n ' + 'Please enter correct name.',
      'error',
    );

    return;
  }

  if (position.trim().length < 4) {
    pushNotification(
      10,
      10,
      'Error',
      'Message.\n ' + 'Please enter correct position.',
      'error',
    );

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification(
      10,
      10,
      'Error',
      'Message.\n ' + 'Please enter correct age.',
      'error',
    );

    return;
  }

  const addTr = document.createElement('tr');

  const tdName = document.createElement('td');
  const tdPosition = document.createElement('td');
  const tdOffice = document.createElement('td');
  const tdAge = document.createElement('td');
  const tdSalary = document.createElement('td');

  tdName.textContent = userName;
  tdPosition.textContent = position;
  tdOffice.textContent = office;
  tdAge.textContent = age;
  tdSalary.textContent = formatSalary;

  addTr.append(tdName, tdPosition, tdOffice, tdAge, tdSalary);
  tbody.append(addTr);

  pushNotification(
    10,
    10,
    'Success',
    'Message.\n ' + 'New employee added.',
    'success',
  );
});

form.append(button);

document.body.append(form);

function pushNotification(posTop, posRight, title, description, type) {
  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.classList.add('notification');
  notification.classList.add(type);

  const newTitle = document.createElement('h2');

  newTitle.classList.add('title');
  newTitle.textContent = title;
  notification.append(newTitle);

  const descr = document.createElement('p');

  descr.textContent = description;
  notification.append(descr);

  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  document.body.append(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
}

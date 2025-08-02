'use strict';

const th = document.querySelectorAll('th');
let currentSortIndex;
let currentSortDirection;

th.forEach((element) => {
  element.addEventListener('click', (e) => {
    const index = element.cellIndex;
    const tr = Array.from(document.querySelectorAll('tbody tr'));
    const tbody = document.querySelector('tbody');

    if (currentSortIndex === index) {
      if (currentSortDirection === 'desc') {
        tr.sort((a, b) => {
          const aItem = a.children[index].textContent.trim();
          const bItem = b.children[index].textContent.trim();

          const aNan = Number(aItem);
          const bNan = Number(bItem);

          if (!isNaN(aNan) && !isNaN(bNan)) {
            return bNan - aNan;
          } else {
            return bItem.localeCompare(aItem);
          }
        });
      } else if (currentSortDirection === 'asc') {
        tr.sort((a, b) => {
          const aItem = a.children[index].textContent.trim();
          const bItem = b.children[index].textContent.trim();

          const aNan = Number(aItem);
          const bNan = Number(bItem);

          if (!isNaN(aNan) && !isNaN(bNan)) {
            return aNan - bNan;
          } else {
            return aItem.localeCompare(bItem);
          }
        });
      }
      currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortIndex = index;
      currentSortDirection = 'asc';

      tr.sort((a, b) => {
        const aItem = a.children[index].textContent.trim();
        const bItem = b.children[index].textContent.trim();

        const aNan = Number(aItem);
        const bNan = Number(bItem);

        if (!isNaN(aNan) && !isNaN(bNan)) {
          return aNan - bNan;
        } else {
          return aItem.localeCompare(bItem);
        }
      });
    }

    tbody.innerHTML = '';

    tbody.append(...tr);
  });
});

const tBody = document.querySelector('tbody');

tBody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  tBody.querySelectorAll('tr').forEach((tr) => {
    tr.classList.remove('active');
  });

  clickedRow.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

const inputsData = [
  {
    labelText: 'Name',
    name: 'name',
    type: 'text',
    'data-qa': 'name',
  },
  {
    labelText: 'Position',
    name: 'position',
    type: 'text',
    'data-qa': 'position',
  },
  {
    labelText: 'Age',
    name: 'age',
    type: 'text',
    'data-qa': 'age',
  },
  {
    labelText: 'Salary',
    name: 'salary',
    type: 'text',
    'data-qa': 'salary',
  },
];

inputsData.forEach((inputData) => {
  const labelNew = document.createElement('label');

  labelNew.textContent = inputData.labelText;

  const input = document.createElement('input');

  for (const i in inputData) {
    if (i !== 'labelText') {
      input.setAttribute(i, inputData[i]);
    }
  }
  labelNew.appendChild(input);
  form.appendChild(labelNew);
});

const select = document.createElement('select');
const label = document.createElement('label');

label.textContent = 'Office';

const citys = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

citys.forEach((city) => {
  const option = document.createElement('option');

  option.value = city.toLowerCase();
  option.textContent = city;
  select.appendChild(option);
});
select.setAttribute('name', 'select');
label.appendChild(select);
form.appendChild(label);

const button = document.createElement('button');

button.textContent = 'Save to table';
button.setAttribute('type', 'submit');
form.appendChild(button);
document.body.appendChild(form);

form.addEventListener('submit', (s) => {
  s.preventDefault();

  const table = document.querySelector('table');
  const nameForm = form.querySelector('[name ="name"]').value;
  const position = form.querySelector('[name = "position"]').value;
  const age = form.querySelector('[name = "age"]').value;
  const salary = form.querySelector('[name = "salary"]').value;
  const selectForm = form.querySelector('[name="select"]');
  const selectText = selectForm.options[selectForm.selectedIndex].textContent;

  if (!nameForm || !position || !age || !salary || !selectForm.value) {
    showNotification('Усі поля повинні бути заповненні', 'error');

    return;
  }

  if (nameForm.length < 4) {
    showNotification("Ім'я повинно містити більше 4 символів", 'error');

    return;
  }

  if (Number(age) < 18 || Number(age) > 90 || isNaN(Number(age))) {
    showNotification('Некоректний вік', 'error');

    return;
  }

  if (isNaN(Number(salary)) || Number(salary) < 0) {
    showNotification('Некоректно введено зарплату', 'error');

    return;
  }

  const newTr = document.createElement('tr');

  const newName = document.createElement('td');

  newName.textContent = nameForm;

  const newPosition = document.createElement('td');

  newPosition.textContent = position;

  const newAge = document.createElement('td');

  newAge.textContent = age;

  const newSalary = document.createElement('td');

  newSalary.textContent = `$${Number(salary).toLocaleString('en-US')}`;

  const newSelect = document.createElement('td');

  newSelect.textContent = selectText;

  newTr.append(newName, newPosition, newSelect, newAge, newSalary);

  const tbody = table.querySelector('tbody');

  tbody.appendChild(newTr);

  showNotification('Співробітника додано', 'success');
});

function showNotification(text, type) {
  const div = document.createElement('div');

  div.classList.add('notification');
  div.classList.add(type);
  div.setAttribute('data-qa', 'notification');

  div.innerHTML = `
    <p>${text}</p>
  `;

  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 2000);
}

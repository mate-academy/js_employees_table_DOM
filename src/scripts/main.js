'use strict';

// write code here
const tHead = document.querySelector('thead');
const tBody = document.querySelector('tbody');
// Вивід повідомлень
const pushNotification = (title, description, type) => {
  const container = document.createElement('div');

  container.classList.add('notification', type);
  container.setAttribute('data-qa', 'notification');

  const textTitel = document.createElement('h2');

  textTitel.classList.add('title');
  textTitel.textContent = title;
  container.appendChild(textTitel);

  const textDescription = document.createElement('p');

  textDescription.textContent = description;
  container.appendChild(textDescription);

  document.body.appendChild(container);

  setTimeout(() => {
    container.style.display = 'none';
  }, 2000);
};

const state = {
  activeRow: null,
  sortByIndex: null,
  sortDir: 'asc',
};
const form = document.createElement('form');
const btn = document.createElement('button');

btn.type = 'submit';
btn.textContent = 'Save to table';

const selectOffice = document.createElement('select');
const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (let i = 0; i < offices.length; i++) {
  const opt = document.createElement('option');

  opt.value = offices[i];
  opt.textContent = offices[i];
  selectOffice.appendChild(opt);
}
selectOffice.name = 'office';
selectOffice.setAttribute('data-qa', 'office');

const inputName = document.createElement('input');

inputName.name = 'name';
inputName.setAttribute('data-qa', 'name');
inputName.type = 'text';
inputName.required = true;

const inputPosition = document.createElement('input');

inputPosition.name = 'position';
inputPosition.setAttribute('data-qa', 'position');
inputPosition.type = 'text';
inputPosition.required = true;

const inputAge = document.createElement('input');

inputAge.name = 'age';
inputAge.setAttribute('data-qa', 'age');
inputAge.type = 'number';
inputAge.required = true;

const inputSalary = document.createElement('input');

inputSalary.name = 'salary';
inputSalary.setAttribute('data-qa', 'salary');
inputSalary.type = 'number';
inputSalary.required = true;

const labelName = document.createElement('label');
const labelPosition = document.createElement('label');
const labelOffice = document.createElement('label');
const labelAge = document.createElement('label');
const labelSlary = document.createElement('label');

form.classList.add('new-employee-form');
labelName.textContent = 'Name: ';
labelName.appendChild(inputName);
form.appendChild(labelName);

labelPosition.textContent = 'Position: ';
labelPosition.appendChild(inputPosition);
form.appendChild(labelPosition);

labelOffice.textContent = 'Office: ';
labelOffice.appendChild(selectOffice);
form.appendChild(labelOffice);

labelAge.textContent = 'Age: ';
labelAge.appendChild(inputAge);
form.appendChild(labelAge);

labelSlary.textContent = 'Salary: ';
labelSlary.appendChild(inputSalary);
form.appendChild(labelSlary);
form.appendChild(btn);
form.setAttribute('novalidate', true);
document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    pushNotification('Error', 'somethings went bad', 'error');

    return;
  }

  const lengthName = inputName.value.trim();

  if (lengthName.length < 4) {
    pushNotification('Error', 'Name should be at least 4 characters', 'error');

    return;
  }

  const age = Number(inputAge.value);

  if (age < 18) {
    pushNotification('Error', 'Age must be more than 18', 'error');

    return;
  }

  if (age > 90) {
    pushNotification('Error', 'Age must be less than 90', 'error');

    return;
  }

  if (!inputSalary.value) {
    pushNotification('Error', 'Salary is required', 'error');

    return;
  }

  const value = Number(inputSalary.value);
  const formatted = value.toLocaleString('en-US');
  const salary = '$' + formatted;
  const tr = document.createElement('tr');
  const tdName = document.createElement('td');
  const tdPosition = document.createElement('td');
  const tdOffice = document.createElement('td');
  const tdAge = document.createElement('td');
  const tdSalary = document.createElement('td');

  tdName.textContent = lengthName;
  tr.appendChild(tdName);

  tdPosition.textContent = inputPosition.value.trim();
  tr.appendChild(tdPosition);

  tdOffice.textContent = selectOffice.value.trim();
  tr.appendChild(tdOffice);

  tdAge.textContent = inputAge.value.trim();
  tr.appendChild(tdAge);

  tdSalary.textContent = salary;
  tr.appendChild(tdSalary);
  tBody.appendChild(tr);
  pushNotification('Success', 'Add to the table', 'success');
  form.reset();
});

tBody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  if (!tr) {
    return;
  }

  if (state.activeRow && state.activeRow !== tr) {
    state.activeRow.classList.remove('active');
  }
  tr.classList.add('active');
  state.activeRow = tr;
});

tHead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const columnIndex = [...tHead.querySelectorAll('th')].indexOf(th);

  const rows = Array.from(tBody.querySelectorAll('tr'));

  if (state.sortByIndex === columnIndex) {
    state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    state.sortByIndex = columnIndex;
    state.sortDir = 'asc';
  }

  if (state.sortDir === 'asc') {
    rows.sort((a, b) => {
      const aText = a.children[columnIndex].textContent.trim();
      const bText = b.children[columnIndex].textContent.trim();

      if (aText.includes('$') && bText.includes('$')) {
        const aNewText = aText.slice(1).trim();
        const bNewText = bText.slice(1).trim();

        return (
          parseFloat(aNewText.replace(/,/g, '')) -
          parseFloat(bNewText.replace(/,/g, ''))
        );
      }

      if (isNaN(aText) && isNaN(bText)) {
        return aText.localeCompare(bText);
      } else {
        return parseFloat(aText) - parseFloat(bText);
      }
    });
  } else {
    rows.sort((a, b) => {
      const aText = a.children[columnIndex].textContent.trim();
      const bText = b.children[columnIndex].textContent.trim();

      if (aText.includes('$') && bText.includes('$')) {
        const aNewText = aText.slice(1).trim();
        const bNewText = bText.slice(1).trim();

        return (
          parseFloat(bNewText.replace(/,/g, '')) -
          parseFloat(aNewText.replace(/,/g, ''))
        );
      }

      if (isNaN(aText) && isNaN(bText)) {
        return bText.localeCompare(aText);
      } else {
        return parseFloat(bText) - parseFloat(aText);
      }
    });
  }

  rows.forEach((r) => tBody.appendChild(r));
});

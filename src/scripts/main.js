'use strict';
'use strict';

const tbody = document.querySelector('tbody');
const title = document.querySelector('thead');

const rows = [...tbody.querySelectorAll('tr')];
let revers = '';

title.addEventListener('click', (e) => {
  const value = e.target.closest('th').textContent.toLowerCase();

  const intex = e.target.cellIndex;
  const cells = [];

  tbody.querySelectorAll('tr').forEach((item) => {
    cells.push(item.cells[intex].textContent);
  });

  const newRows = rows.sort((a, b) => {
    const cellsA = a.cells[intex].textContent;
    const cellsB = b.cells[intex].textContent;

    switch (value) {
      case 'name':
      case 'position':
        return cellsA.localeCompare(cellsB);

      case 'age':
        return cellsA - cellsB;

      case 'salary':
        return (
          +cellsA.replace(',', '').slice(1) - +cellsB.replace(',', '').slice(1)
        );

      default:
        return null;
    }
  });

  if (value === revers) {
    newRows.reverse();
    revers = '';
  } else {
    revers = value;
  }

  tbody.innerHTML = '';

  newRows.forEach((item) => {
    tbody.appendChild(item);
  });
});

const handleActiveClas = () => {
  tbody.querySelectorAll('tr').forEach((item) => {
    item.addEventListener('click', (e) => {
      const isActive = document.querySelector('.active');

      if (isActive) {
        isActive.classList.remove('active');
      }

      e.currentTarget.classList.add('active');
    });
  });
};

handleActiveClas();

const form = document.createElement('form');

form.classList.add('new-employee-form');

const labelName = document.createElement('label');
const labelPosition = document.createElement('label');
const labelOffice = document.createElement('label');
const labelAge = document.createElement('label');
const labelSalary = document.createElement('label');

const inputName = document.createElement('input');
const inputPosition = document.createElement('input');
const selectOffice = document.createElement('select');
const inputAge = document.createElement('input');
const inputSalary = document.createElement('input');
const buttonSubmit = document.createElement('button');

labelName.textContent = 'Name:';
labelPosition.textContent = 'Position:';
labelOffice.textContent = 'Office:';
labelAge.textContent = 'Age:';
labelSalary.textContent = 'Salary:';

inputName.setAttribute('data-qa', 'name');
inputName.setAttribute('name', 'name');

inputName.setAttribute('type', 'text');
inputName.required = true;

labelName.appendChild(inputName);

inputPosition.setAttribute('data-qa', 'position');
inputPosition.setAttribute('name', 'position');

inputPosition.required = true;
inputPosition.setAttribute('type', 'text');
labelPosition.appendChild(inputPosition);

selectOffice.setAttribute('data-qa', 'office');
selectOffice.setAttribute('name', 'office');

const optionsTokyo = document.createElement('option');
const optionsSingapore = document.createElement('option');
const optionsLondon = document.createElement('option');
const optionsNewYork = document.createElement('option');
const optionsEdinburgh = document.createElement('option');
const optionsSanFrancisco = document.createElement('option');

optionsTokyo.textContent = 'Tokyo';
optionsTokyo.setAttribute('value', 'Tokyo');
optionsSingapore.textContent = 'Singapore';
optionsSingapore.setAttribute('value', 'Singapore');

optionsLondon.textContent = 'London';
optionsLondon.setAttribute('value', 'London');

optionsNewYork.textContent = 'New York';
optionsNewYork.setAttribute('value', 'New York');

optionsEdinburgh.textContent = 'Edinburgh';
optionsEdinburgh.setAttribute('value', 'Edinburgh');

optionsSanFrancisco.textContent = 'San Francisco';
optionsSanFrancisco.setAttribute('value', 'San Francisco');

selectOffice.append(
  optionsTokyo,
  optionsSingapore,
  optionsLondon,
  optionsNewYork,
  optionsEdinburgh,
  optionsSanFrancisco,
);

labelOffice.append(selectOffice);
selectOffice.required = true;

inputAge.setAttribute('data-qa', 'age');
inputAge.setAttribute('name', 'age');

inputAge.setAttribute('type', 'number');
labelAge.appendChild(inputAge);
inputAge.required = true;

inputSalary.setAttribute('data-qa', 'salary');
inputSalary.setAttribute('name', 'salary');
inputSalary.setAttribute('type', 'number');
inputSalary.required = true;
labelSalary.appendChild(inputSalary);

buttonSubmit.textContent = 'Save to table';
buttonSubmit.setAttribute('type', 'submit');
form.appendChild(labelName);
form.appendChild(labelPosition);
form.appendChild(labelOffice);
form.appendChild(labelAge);
form.appendChild(labelSalary);
form.appendChild(buttonSubmit);
form.setAttribute('type', 'submit');

document.body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newRows = document.createElement('tr');
  const newName = document.createElement('td');
  const newPosition = document.createElement('td');
  const newOffice = document.createElement('td');
  const newAge = document.createElement('td');
  const newSalary = document.createElement('td');
  const div = document.createElement('div');

  div.setAttribute('data-qa', 'notification');
  div.setAttribute('class', 'notification');

  div.style.position = 'absolute';

  if (inputName.value.length < 4) {
    const titleElement = document.createElement('h2');

    titleElement.style.fontWeight = '900';
    titleElement.style.fontSize = '20px';
    titleElement.textContent = 'Name should be at least 4';

    div.append(titleElement);
    div.classList.add('error');
  }

  if (inputAge.value < 18 || inputAge.value > 90) {
    const titleElement = document.createElement('h2');

    titleElement.style.fontWeight = '900';
    titleElement.style.fontSize = '20px';
    titleElement.textContent = 'Age should be between 18 and 90 y.o.';

    div.append(titleElement);
    div.classList.add('error');
  } else {
    const titleSuccess = document.createElement('h2');

    titleSuccess.style.fontWeight = '900';
    titleSuccess.style.fontSize = '20px';
    titleSuccess.textContent = 'Added successfully';
    div.style.background = 'rgba(10, 189, 0, 0.3)';
    div.classList.add('success');
    div.append(titleSuccess);
    document.body.append(div);
  }

  document.body.append(div);

  if (div.getAttribute('data-qa') === 'error') {
    div.style.background = 'rgb(153, 41, 26)';

    setTimeout(() => {
      div.style.display = 'none';
    }, 4000);

    return;
  }

  newName.textContent = inputName.value;
  newPosition.textContent = inputPosition.value;
  newOffice.textContent = selectOffice.value;
  newAge.textContent = inputAge.value;
  newSalary.textContent = `$${(+inputSalary.value).toLocaleString('en-US')}`;

  newRows.append(newName, newPosition, newOffice, newAge, newSalary);

  setTimeout(() => {
    div.style.display = 'none';
  }, 4000);

  if (
    inputAge.value > 18 &&
    inputAge.value < 90 &&
    inputName.value.length > 4
  ) {
    tbody.append(newRows);
    form.reset();
  }
});

const td = document.querySelectorAll('td');

td.forEach((item) => {
  item.addEventListener('dblclick', (e) => {
    const findInput = document.querySelector('.cell-input');
    const oldValue = e.target.textContent;

    if (findInput) {
      findInput.remove();
      e.target.textContent = oldValue;
    }

    const input = document.createElement('input');

    input.setAttribute('autofocus', true);
    input.setAttribute('class', 'cell-input');
    e.target.textContent = '';
    e.target.append(input);
    input.focus();

    input.onblur = () => {
      if (!input.value) {
        e.target.textContent = oldValue;
      } else {
        e.target.textContent = input.value;
      }

      input.remove();
    };

    input.onkeydown = (even) => {
      if (even.key === 'Enter') {
        if (!input.value) {
          e.target.textContent = oldValue;
        } else {
          e.target.textContent = input.value;
        }

        input.remove();
      }
    };
  });
});

'use strict';

const table = document.querySelector('table');
const tbody = table.tBodies[0];

table.addEventListener('click', (e) => {
  const nowTarget = e.target;

  if (nowTarget.tagName === 'TH' && nowTarget instanceof HTMLElement) {
    buttonWho(nowTarget);
  }
});

function buttonWho(buttonNow) {
  const rowArray = Array.from(table.tBodies[0].children);

  for (const th of table.tHead.rows[0].children) {
    if (th !== buttonNow) {
      th.classList.remove('APC');
    }
  }

  buttonNow.classList.toggle('APC');

  const number = buttonNow.cellIndex;
  const resultSort = rowArray.sort((firstRow, secondRow) => {
    if (buttonNow.textContent === 'Salary') {
      const firstRowChildrenSalary = firstRow.children[number].textContent
        .slice(1)
        .split(',')
        .join('');
      const secondRowChildrenSalary = secondRow.children[number].textContent
        .slice(1)
        .split(',')
        .join('');

      if (buttonNow.classList.contains('APC')) {
        return firstRowChildrenSalary - secondRowChildrenSalary;
      } else {
        return secondRowChildrenSalary - firstRowChildrenSalary;
      }
    }

    const firstRowChildren = firstRow.children[number].textContent;
    const secondRowChildren = secondRow.children[number].textContent;

    if (buttonNow.classList.contains('APC')) {
      return firstRowChildren.localeCompare(secondRowChildren);
    } else {
      return secondRowChildren.localeCompare(firstRowChildren);
    }
  });

  resultSort.forEach((newTr) => {
    tbody.append(newTr);
  });
}

tbody.addEventListener('click', (e) => {
  const nowTargetTr = e.target.closest('tr');

  if (!nowTargetTr) {
    return;
  }

  const lastElementActive = document.querySelector('.active');

  if (lastElementActive !== null) {
    lastElementActive.removeAttribute('class');
  }

  if (nowTargetTr instanceof HTMLElement) {
    nowTargetTr.classList.add('active');
  }
});

const body = document.querySelector('body');
const form = document.createElement('form');

if (form instanceof HTMLElement) {
  body.append(form);
  form.classList.add('new-employee-form');

  //  create inputName
  const labelName = document.createElement('label');
  const inputName = document.createElement('input');

  inputName.setAttribute('data-qa', 'name');
  inputName.required = true;
  inputName.setAttribute('name', 'name');
  inputName.setAttribute('autocomplete', 'name');
  inputName.setAttribute('type', 'text');
  form.append(labelName);
  labelName.textContent = 'Name:';
  labelName.append(inputName);

  //  create inputPosition
  const labelPosition = document.createElement('label');
  const inputPosition = document.createElement('input');

  inputPosition.setAttribute('data-qa', 'position');
  inputPosition.required = true;
  inputPosition.setAttribute('name', 'position');
  inputPosition.setAttribute('autocomplete', 'position');
  inputPosition.setAttribute('type', 'text');
  form.append(labelPosition);
  labelPosition.textContent = 'Position:';
  labelPosition.append(inputPosition);

  //  create inputOffice
  const labelOffice = document.createElement('label');
  const selectOffice = document.createElement('select');
  const optionTokyo = document.createElement('option');
  const optionSingapore = document.createElement('option');
  const optionLondon = document.createElement('option');
  const optionNewYork = document.createElement('option');
  const optionEdinburgh = document.createElement('option');
  const optionSanFrancisco = document.createElement('option');

  optionTokyo.setAttribute('value', 'Tokyo');
  optionTokyo.textContent = 'Tokyo';
  optionSingapore.setAttribute('value', 'Singapore');
  optionSingapore.textContent = 'Singapore';
  optionLondon.setAttribute('value', 'London');
  optionLondon.textContent = 'London';
  optionNewYork.setAttribute('value', 'New York');
  optionNewYork.textContent = 'New York';
  optionEdinburgh.setAttribute('value', 'Edinburgh');
  optionEdinburgh.textContent = 'Edinburgh';
  optionSanFrancisco.setAttribute('value', 'San Francisco');
  optionSanFrancisco.textContent = 'San Francisco';

  selectOffice.setAttribute('data-qa', 'office');
  selectOffice.setAttribute('name', 'office');
  selectOffice.setAttribute('autocomplete', 'office');
  form.append(labelOffice);
  labelOffice.textContent = 'Office:';
  labelOffice.append(selectOffice);
  selectOffice.append(optionTokyo);
  selectOffice.append(optionSingapore);
  selectOffice.append(optionLondon);
  selectOffice.append(optionNewYork);
  selectOffice.append(optionEdinburgh);
  selectOffice.append(optionSanFrancisco);

  //  create inputAge
  const labelAge = document.createElement('label');
  const inputAge = document.createElement('input');

  inputAge.setAttribute('data-qa', 'age');
  inputAge.required = true;
  inputAge.setAttribute('name', 'age');
  inputAge.setAttribute('autocomplete', 'age');
  inputAge.setAttribute('type', 'number');
  form.append(labelAge);
  labelAge.textContent = 'Age:';
  labelAge.append(inputAge);

  //  create inputSalary
  const labelSalary = document.createElement('label');
  const inputSalary = document.createElement('input');

  inputSalary.setAttribute('data-qa', 'salary');
  inputSalary.required = true;
  inputSalary.setAttribute('name', 'salary');
  inputSalary.setAttribute('autocomplete', 'salary');
  inputSalary.setAttribute('type', 'number');
  form.append(labelSalary);
  labelSalary.textContent = 'Salary:';
  labelSalary.append(inputSalary);

  //  create button
  const button = document.createElement('button');

  button.setAttribute('type', 'submit');
  button.textContent = 'Save to table';
  form.append(button);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const tr = document.createElement('tr');
  const tdName = document.createElement('td');
  const tdPosition = document.createElement('td');
  const tdOffice = document.createElement('td');
  const tdAge = document.createElement('td');
  const tdSal = document.createElement('td');
  const namePerson = document.querySelector('[data-qa="name"]');
  const position = document.querySelector('[data-qa="position"]');
  const office = document.querySelector('[data-qa="office"]');
  const age = document.querySelector('[data-qa="age"]');
  const salary = document.querySelector('[data-qa="salary"]');

  tdName.textContent = namePerson.value;
  tdPosition.textContent = position.value;
  tdOffice.textContent = office.value;
  tdAge.textContent = Number(age.value);
  tdSal.textContent = '$' + Number(salary.value).toLocaleString('en-US');

  const oldNotification = document.querySelector('.notification');

  if (oldNotification) {
    oldNotification.remove();
  }

  const newNotification = document.createElement('div');

  newNotification.setAttribute('data-qa', 'notification');
  newNotification.classList.add('notification');

  if (
    Number(age.value) < 18 ||
    Number(age.value) > 90 ||
    namePerson.value.length < 4 ||
    position.value === '' ||
    salary.value === ''
  ) {
    newNotification.classList.add('error');
    newNotification.textContent = 'Винникла помилка!';
    body.append(newNotification);
  } else {
    newNotification.classList.add('success');
    newNotification.textContent = 'Успішно додано!';
    body.append(newNotification);

    tr.append(tdName);
    tr.append(tdPosition);
    tr.append(tdOffice);
    tr.append(tdAge);
    tr.append(tdSal);
    tbody.append(tr);

    namePerson.value = '';
    position.value = '';
    office.value = '';
    age.value = '';
    salary.value = '';
  }
});

table.addEventListener('dblclick', (e) => {
  const nowTarget = e.target;
  const content = nowTarget.textContent;

  nowTarget.textContent = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.setAttribute('name', 'editing');
  nowTarget.append(input);

  input.addEventListener('blur', (eBlur) => {
    const valueInput = input.value;

    if (valueInput === '') {
      input.remove();
      nowTarget.textContent = content;

      return;
    }
    input.remove();
    nowTarget.textContent = valueInput;
  });

  input.addEventListener('keypress', (eKeypress) => {
    if (eKeypress.code === 'Enter') {
      const valueInput = input.value;

      if (valueInput === '') {
        input.remove();
        nowTarget.textContent = content;

        return;
      }
      input.remove();
      nowTarget.textContent = valueInput;
    }
  });
});

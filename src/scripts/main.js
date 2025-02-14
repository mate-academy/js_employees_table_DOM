'use strict';

const table = document.querySelector('table');
const tbody = document.body.querySelector('tbody');
const rows = [];
let l = tbody.children.length;
let nameClick = 0;
let positionClick = 0;
let officeClick = 0;
let ageClick = 0;
let salaryClick = 0;
let index;

for (let i = 0; i < l; i++) {
  rows[i] = tbody.children[i].cloneNode(true);
}

tbody.onclick = () => {
  const form = document.createElement('form');

  const labelName = document.createElement('label');

  labelName.textContent = 'Name:';

  const inputName = document.createElement('input');

  inputName.dataset.dataqa = 'name';
  inputName.name = 'name';
  inputName.type = 'text';
  inputName.required = true;

  const labelPosition = document.createElement('label');

  labelPosition.textContent = 'Position:';

  const inputPosition = document.createElement('input');

  inputPosition.dataset.dataqa = 'position';
  inputPosition.type = 'text';
  inputPosition.position = 'position';
  inputPosition.required = true;

  const labelOffice = document.createElement('label');

  labelOffice.textContent = 'Office:';

  const select = document.createElement('select');

  select.office = 'office';

  const option1 = document.createElement('option');

  option1.value = 'Tokyo';
  option1.textContent = 'Tokyo';

  const option2 = document.createElement('option');

  option2.value = 'Singapore';
  option2.textContent = 'Singapore';

  const option3 = document.createElement('option');

  option3.value = '	London';
  option3.textContent = '	London';

  const option4 = document.createElement('option');

  option4.value = 'New York';
  option4.textContent = 'New York';

  const option5 = document.createElement('option');

  option5.value = 'Edinburgh';
  option5.textContent = 'Edinburgh';

  const option6 = document.createElement('option');

  option6.value = 'San Francisco';
  option6.textContent = 'San Francisco';

  const labelAge = document.createElement('label');

  labelAge.textContent = 'Age:';

  const inputAge = document.createElement('input');

  inputAge.dataset.dataqa = 'age';
  inputAge.type = 'number';
  inputAge.age = 'age';
  inputAge.required = true;

  const labelSalary = document.createElement('label');

  labelSalary.textContent = 'Salary:';

  const inputSalary = document.createElement('input');

  inputSalary.dataset.dataqa = 'salary';
  inputSalary.type = 'text';
  inputSalary.Salary = 'salary';
  inputSalary.required = true;

  const button = document.createElement('button');

  button.textContent = 'Save to table';

  form.classList.add('new-employee-form');

  document.body.append(form);
  form.appendChild(labelName);
  form.appendChild(inputName);
  form.appendChild(labelPosition);
  form.appendChild(inputPosition);
  form.appendChild(labelOffice);
  form.appendChild(select);
  select.appendChild(option1);
  select.appendChild(option2);
  select.appendChild(option3);
  select.appendChild(option4);
  select.appendChild(option5);
  select.appendChild(option6);
  form.appendChild(labelAge);
  form.appendChild(inputAge);
  form.appendChild(labelSalary);
  form.appendChild(inputSalary);
  form.appendChild(button);

  button.onclick = () => {
    if (inputName.name.length < 4 || inputAge.age < 18 || inputAge.age > 90) {
      const notification = document.createElement('div');
      const h2 = document.createElement('h2');

      h2.textContent = 'Error';

      notification.classList.add('notification');
      notification.dataset.dataqa = 'notification';

      h2.classList.add('title');
      h2.classList.toggle('error');

      document.body.append(notification);
      notification.appendChild(h2);
    } else {
      tbody.children[tbody.children.length] = [
        inputName.name,
        inputPosition.position,
        select.office,
        inputAge.age,
        inputSalary.salary,
      ];

      tbody.children[tbody.children.length - 1].replaceWith(
        tbody.children[tbody.children.length - 1],
        tbody.children[tbody.children.length],
      );

      l++;
    }
  };
};

table.addEventListener('click', (e) => {
  if (e.target.textContent === 'Name' && nameClick === 0) {
    index = 0;

    rows.sort(sortText);

    nameClick = 1;

    for (let i = 0; i < l; i++) {
      tbody.children[i].replaceWith(rows[i]);
    }
  } else if (e.target.textContent === 'Name' && nameClick === 1) {
    nameClick = 0;

    rows.reverse();

    for (let i = 0; i < l; i++) {
      tbody.children[i].replaceWith(rows[i]);
    }
  }

  if (e.target.textContent === 'Position' && positionClick === 0) {
    index = 1;

    rows.sort(sortText);

    for (let i = 0; i < l; i++) {
      tbody.children[i].replaceWith(rows[i]);
    }

    positionClick = 1;
  } else if (e.target.textContent === 'Position' && positionClick === 1) {
    rows.reverse();

    for (let i = 0; i < l; i++) {
      tbody.children[i].replaceWith(rows[i]);
    }

    positionClick = 0;
  }

  if (e.target.textContent === 'Office' && officeClick === 0) {
    index = 2;

    rows.sort(sortText);

    for (let i = 0; i < l; i++) {
      tbody.children[i].replaceWith(rows[i]);
    }

    officeClick = 1;
  } else if (e.target.textContent === 'Office' && officeClick === 1) {
    rows.reverse();

    for (let i = 0; i < l; i++) {
      tbody.children[i].replaceWith(rows[i]);
    }

    officeClick = 0;
  }

  if (e.target.textContent === 'Age' && ageClick === 0) {
    rows.sort(
      (el1, el2) =>
        Number(el1.cells[3].textContent) - Number(el2.cells[3].textContent),
    );

    for (let i = 0; i < l; i++) {
      tbody.children[i].replaceWith(rows[i]);
    }

    ageClick = 1;
  } else if (e.target.textContent === 'Age' && ageClick === 1) {
    rows.reverse();

    for (let i = 0; i < l; i++) {
      tbody.children[i].replaceWith(rows[i]);
    }

    ageClick = 0;
  }

  if (e.target.textContent === 'Salary' && salaryClick === 0) {
    rows.sort(conversion);

    for (let i = 0; i < l; i++) {
      tbody.children[i].replaceWith(rows[i]);
    }

    salaryClick = 1;
  } else if (e.target.textContent === 'Salary' && salaryClick === 1) {
    rows.reverse();

    for (let i = 0; i < l; i++) {
      tbody.children[i].replaceWith(rows[i]);
    }

    salaryClick = 0;
  }
});

const sortText = (el1, el2) => {
  return el1.cells[index].textContent.localeCompare(
    el2.cells[index].textContent,
  );
};

const conversion = (el1, el2) => {
  const value1 = el1.cells[4].textContent
    .split('$')
    .join('')
    .split(',')
    .sort((el) => typeof +el !== 'number')
    .join('');
  const value2 = el2.cells[4].textContent
    .split('$')
    .join('')
    .split(',')
    .sort((el) => typeof +el !== 'number')
    .join('');

  if (value1 - value2 < 0) {
    return -1;
  } else if (value1 - value2 === 0) {
    return 0;
  } else {
    return 1;
  }
};

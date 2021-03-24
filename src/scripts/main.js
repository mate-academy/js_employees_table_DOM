'use strict';

// write code here
const body = document.querySelector('body');
const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
let curentTitleName;

tableHead.addEventListener('click', (e) => {
  const childArr = [...tableBody.children];
  const targetOnHead = e.target.innerText;
  const targetIndex = e.target.cellIndex;

  if (curentTitleName !== targetOnHead) {
    childArr.sort((a, b) => {
      const [A, B] = methodReverse(targetOnHead, targetIndex, a, b);

      if (Number.isInteger(A)) {
        return A - B;
      }

      return A.localeCompare(B);
    });
    curentTitleName = targetOnHead;
  } else {
    childArr.reverse();
    curentTitleName = '';
  }

  childArr.forEach(el => tableBody.append(el));
});

let targetTag;

tableBody.addEventListener('click', (e) => {
  if (targetTag) {
    targetTag.classList.remove('active');
  };

  targetTag = e.target.closest('tr');
  e.target.closest('tr').classList.add('active');
});

function createInput(title) {
  const label = document.createElement('label');
  const cities = [`Tokyo`, `Singapore`, `London`, `New York`,
    `Edinburgh`, `San Francisco`];

  label.innerText = title + ':';

  if (title !== 'Office') {
    const input = document.createElement('input');

    input.setAttribute('name', title.toLowerCase());
    input.setAttribute('data-qa', title.toLowerCase());

    title === 'Age' || title === 'Salary'
      ? input.setAttribute('type', 'number')
      : input.setAttribute('type', 'text');
    label.append(input);
  } else {
    const select = document.createElement('select');

    select.setAttribute('name', title.toLowerCase());
    select.setAttribute('data-qa', title.toLowerCase());

    cities.forEach(citie => {
      const option = document.createElement('option');

      option.innerText = citie;
      select.append(option);
    });
    label.append(select);
  }

  return label;
}

function createForm() {
  const form = document.createElement('form');
  const button = document.createElement('button');
  const th = tableHead.querySelectorAll('tr>th');

  form.classList.add(`new-employee-form`);
  button.innerText = 'Save to table';

  th.forEach(tag => {
    form.append(createInput(tag.innerText));
  });
  form.append(button);
  body.append(form);
}

createForm();

const tableForm = document.querySelector('form');

tableForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameValue = tableForm.children[0].firstElementChild.value;
  const positionValue = tableForm.children[1].firstElementChild.value;
  const ageValue = tableForm.children[3].firstElementChild.value;

  const result = validation(ageValue, nameValue, positionValue);

  if (result) {
    createEmployee(tableForm);
    showMessage(message, 'success');
  } else {
    showMessage(message, 'error');
  }
});

tableBody.addEventListener('dblclick', (e) => {
  const input = document.createElement('input');
  const targetTextContent = e.target.innerText;

  input.className = `cell-input`;
  input.value = e.target.innerText;

  e.target.innerText = '';
  e.target.append(input);

  input.focus();

  input.addEventListener('keydown', (push) => {
    if (push.code === 'Enter') {
      e.target.innerText = input.value || targetTextContent;
    }
  });

  input.addEventListener('blur', () => {
    e.target.innerText = input.value || targetTextContent;
  });
});

let message;

function methodReverse(targetText, index, elA, elB) {
  const firstElement = elA.cells[index].innerText;
  const secondElement = elB.cells[index].innerText;

  if (['Age', 'Salary'].includes(targetText)) {
    const A = +(firstElement.replace('$', '').replace(/,/g, ''));
    const B = +(secondElement.replace('$', '').replace(/,/g, ''));

    return [A, B];
  }

  return [firstElement, secondElement];
}

function validation(ageValue, nameValue, positionValue) {
  if (nameValue.length < 4 || ageValue > 90 || ageValue < 18) {
    message = nameValue.length < 4
      ? 'The name must contain no less than 4 letters'
      : 'The age must be more than 18 and less than 90 year';

    return false;
  }

  if (positionValue.length < 1) {
    message = 'Please, write your position';

    return false;
  } else {
    message = 'Employee is successfully added to the table';

    return true;
  }
}

function showMessage(info, statusInfo) {
  const container = document.createElement('div');
  const title = document.createElement('h2');
  const description = document.createElement('p');

  container.setAttribute('data-qa', 'notification');
  container.classList.add(`notification`, statusInfo);

  title.innerText = statusInfo.toUpperCase();

  description.innerText = info;
  container.append(title, description);
  body.append(container);

  setTimeout(() => {
    container.remove();
  }, 3000);
}

function createEmployee(formInputs) {
  const tr = document.createElement('tr');

  [...formInputs].forEach(input => {
    if (input.tagName !== 'BUTTON') {
      const td = document.createElement('td');

      td.innerText = input.value;

      if (input.name === 'salary') {
        td.innerText = input.value > 0
          ? '$' + (+input.value).toLocaleString('en')
          : '$' + 0;
      }

      if (input.name !== 'office') {
        input.value = '';
      }

      tr.append(td);
    }
  });

  tableBody.append(tr);
}

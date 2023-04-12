'use strict';

// write code here

function convertToNumber(str) {
  const numb = +str.replace(/\D/g, '');

  return numb;
}

const listElements = document.querySelector('tbody').children;

document.querySelector('tbody').addEventListener('click', (e) => {
  for (const element of listElements) {
    if (element.className === 'active') {
      element.className = '';
    }
  }

  e.target.parentNode.className = 'active';
});

let clickNumber0 = 0;
let clickNumber1 = 0;
let clickNumber2 = 0;
let clickNumber3 = 0;
let clickNumber4 = 0;

const sortAll = (e) => {
  switch (e.target) {
    case document.querySelectorAll('th')[0]:
      clickNumber0 += 1;
      clickNumber1 = 0;
      clickNumber2 = 0;
      clickNumber3 = 0;
      clickNumber4 = 0;
      break;

    case document.querySelectorAll('th')[1]:
      clickNumber0 = 0;
      clickNumber1 += 1;
      clickNumber2 = 0;
      clickNumber3 = 0;
      clickNumber4 = 0;
      break;

    case document.querySelectorAll('th')[2]:
      clickNumber0 = 0;
      clickNumber1 = 0;
      clickNumber2 += 1;
      clickNumber3 = 0;
      clickNumber4 = 0;
      break;

    case document.querySelectorAll('th')[3]:
      clickNumber0 = 0;
      clickNumber1 = 0;
      clickNumber2 = 0;
      clickNumber3 += 1;
      clickNumber4 = 0;
      break;

    case document.querySelectorAll('th')[4]:
      clickNumber0 = 0;
      clickNumber1 = 0;
      clickNumber2 = 0;
      clickNumber3 = 0;
      clickNumber4 += 1;
      break;
  }

  const arraySort = [...listElements].sort((a, b) => {
    switch (e.target) {
      case document.querySelectorAll('th')[0]:
        const strA1 = a.firstElementChild.textContent;
        const strB1 = b.firstElementChild.textContent;

        if (clickNumber0 % 2 !== 0) {
          return strA1.localeCompare(strB1);
        }

        return strB1.localeCompare(strA1);

      case document.querySelectorAll('th')[1]:
        const strA2 = a.firstElementChild.nextElementSibling.textContent;
        const strB2 = b.firstElementChild.nextElementSibling.textContent;

        if (clickNumber1 % 2 !== 0) {
          return strA2.localeCompare(strB2);
        }

        return strB2.localeCompare(strA2);

      case document.querySelectorAll('th')[2]:
        const strA3
        = a.firstElementChild.nextElementSibling.nextElementSibling.textContent;
        const strB3
        = b.firstElementChild.nextElementSibling.nextElementSibling.textContent;

        if (clickNumber2 % 2 !== 0) {
          return strA3.localeCompare(strB3);
        }

        return strB3.localeCompare(strA3);

      case document.querySelectorAll('th')[3]:
        if (clickNumber3 % 2 !== 0) {
          return a.lastElementChild.previousElementSibling.textContent
          - b.lastElementChild.previousElementSibling.textContent;
        }

        return b.lastElementChild.previousElementSibling.textContent
        - a.lastElementChild.previousElementSibling.textContent;

      case document.querySelectorAll('th')[4]:
        const salaryA = convertToNumber(a.lastElementChild.textContent);
        const salaryB = convertToNumber(b.lastElementChild.textContent);

        if (clickNumber4 % 2 !== 0) {
          return salaryA - salaryB;
        }

        return salaryB - salaryA;
    }
  });

  document.querySelector('tbody').innerHTML = '';

  for (const item of arraySort) {
    document.querySelector('tbody').innerHTML += `
      <tr>
      <td>${item.firstElementChild.textContent}</td>
      <td>${item.firstElementChild.nextElementSibling.textContent}</td>
      <td>${
  item.firstElementChild.nextElementSibling.nextElementSibling.textContent
}</td>
      <td>${item.lastElementChild.previousElementSibling.textContent}</td>
      <td>${item.lastElementChild.textContent}</td>
      </tr>
    `;
  }
};

document.querySelectorAll('th')[0].addEventListener('click', sortAll);

document.querySelectorAll('th')[1].addEventListener('click', sortAll);

document.querySelectorAll('th')[2].addEventListener('click', sortAll);

document.querySelectorAll('th')[3].addEventListener('click', sortAll);

document.querySelectorAll('th')[4].addEventListener('click', sortAll);

const formElement = document.createElement('form');

formElement.className = 'new-employee-form';

document.body.append(formElement);

formElement.innerHTML += `
<label>Name: <input name="name" type="text" data-qa="name" required></label>
<label>Position: <input name="position" type="text" data-qa="position">
</label>
<label>Office: <select name="office" data-qa="office" required>
<option value="Tokyo">Tokyo</option>
<option value="Singapore">Singapore</option>
<option value="London">London</option>
<option value="New York">New York</option>
<option value="Edinburgh">Edinburgh</option>
<option value="San Francisco">San Francisco</option>
</select></label>
<label>Age: <input name="age" type="number" data-qa="age" required></label>
<label>Salary: <input name="salary" type="number" data-qa="salary" required>
</label>
<button type="submit">Save to table</button>
`;

for (let i = 0; i < formElement.length - 1; i++) {
  formElement[i].addEventListener('keydown', (x) => {
    if (x.code === 'Enter') {
      x.preventDefault();
      formElement[i + 1].focus();
    }
  });
}

formElement.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(formElement);

  if (data.get('name').trim().length < 4
  || data.get('age') < 18
  || data.get('age') > 90
  || data.get('position').trim() === '') {
    pushNotification(150, 10, 'Error', 'Please correct the data', 'error');
  } else {
    const newEmployee = Object.fromEntries(data.entries());

    const salaryNumber = +newEmployee.salary;

    newEmployee.salary = '$' + salaryNumber.toLocaleString('en-US');

    const newRow = document.createElement('tr');

    for (const key in newEmployee) {
      const newCell = document.createElement('td');

      newCell.textContent = newEmployee[key];

      newRow.append(newCell);
    }

    document.querySelector('tbody').append(newRow);

    pushNotification(10, 10, 'Success', 'New employee was added.', 'success');
  }
});

document.querySelector('tbody').addEventListener('dblclick', (e) => {
  const inputData = document.createElement('input');

  inputData.className = 'cell-input';
  inputData.setAttribute('value', `${e.target.textContent}`);

  const initialValue = e.target.textContent;

  if (/^[0-9]+$/.test(e.target.textContent)) {
    inputData.setAttribute('type', `number`);
  }

  if (/[$]/.test(e.target.textContent)) {
    inputData.setAttribute('type', `number`);
  }

  e.target.textContent = '';

  e.target.append(inputData);

  const saveData = () => {
    if (/[$]/.test(initialValue)) {
      const salaryNumberCell = +inputData.value;

      e.target.textContent
      = '$' + salaryNumberCell.toLocaleString('en-US');
    } else {
      e.target.textContent = inputData.value.trim();
    }

    if (/^[0-9]+$/.test(initialValue)
    && (inputData.value < 18
    || inputData.value > 90)) {
      e.target.textContent = initialValue;
    }

    if (e.target.textContent === ''
    || e.target.textContent === '$0') {
      e.target.textContent = initialValue;
    }

    inputData.remove();
  };

  inputData.addEventListener('blur', saveData);

  inputData.addEventListener('keydown', (x) => {
    if (x.code === 'Enter') {
      saveData();
    }
  });
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const notif = document.createElement('div');
  const titleEl = document.createElement('h2');
  const descriptionEl = document.createElement('p');

  titleEl.textContent = title;
  descriptionEl.textContent = description;
  notif.style.top = `${posTop}px`;
  notif.style.right = `${posRight}px`;
  titleEl.className = 'title';
  notif.className = 'notification';

  if (type === 'success') {
    notif.className += ' success';
  }

  if (type === 'error') {
    notif.className += ' error';
  }

  if (type === 'warning') {
    notif.className += ' warning';
  }

  notif.setAttribute('data-qa', 'notification');

  notif.append(titleEl);
  notif.append(descriptionEl);
  document.body.append(notif);

  setTimeout(() => {
    notif.remove();
  }, 2000);
};

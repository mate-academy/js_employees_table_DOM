'use strict';

const header = document.querySelector('tr');
const tbody = document.querySelector('tbody');
const rowsArray = tbody.children;
let sorted;

document.body.children[0].style.alignSelf = 'flex-start';

[...header.children].forEach((item, i) => {
  let clickCounter = 0;

  item.addEventListener('click', (e) => {
    clickCounter++;

    sorted = [...rowsArray].sort((a, b) =>
      b.children[i].innerText.localeCompare(a.children[i].innerText));

    if (clickCounter % 2) {
      sorted = [...rowsArray].sort((a, b) =>
        a.children[i].innerText.localeCompare(b.children[i].innerText));
    }

    if (item.innerText === 'Salary') {
      sorted = [...rowsArray].sort((a, b) =>
        toNumber(b.children[i]) - toNumber(a.children[i]));

      if (clickCounter % 2) {
        sorted = [...rowsArray].sort((a, b) =>
          toNumber(a.children[i]) - toNumber(b.children[i]));
      }
    }

    tbody.prepend(...sorted);
  });
});

function toNumber(element) {
  return +element.innerText.slice(1).replaceAll(',', '');
};

[...rowsArray].forEach(row => {
  row.addEventListener('click', (e) => {
    const activeElement = document.querySelector('.active');

    if (activeElement) {
      activeElement.classList.remove('active');
    }
    row.classList.add('active');
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label> Name: 
      <input 
        name="name" 
        type="text" 
        data-qa="name"
        required
     ></label>
  <label>Position:
    <input 
      name="position" 
      type="text" 
      data-qa="position" 
      required
  ></label>
  <label>Office:
    <select name="office" data-qa="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New_York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San_Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: 
    <input 
      name="age" 
      type="number" 
      data-qa="age" 
      required
  ></label>
  <label>Salary:
    <input
    name="salary"
    type="number"
    data-qa="salary"
    required
  ></label>
  <button type="submit">Save to table</button>
`;
document.body.append(form);

form.addEventListener('submit', e => {
  e.preventDefault();

  const newPerson = document.createElement('tr');
  const data = new FormData(form);

  if (data.get('name').trim().length < 4) {
    pushNotification('Error', 'Write full name please', 'error');

    return;
  };

  if (data.get('age') < 18 || data.get('age') > 90) {
    pushNotification(
      'Warning', 'Your age must be between 18 and 90 years old', 'warning');

    return;
  };

  newPerson.innerHTML = `
    <th>${data.get('name').trim()}</th>
    <th>${data.get('position').trim()}</th>
    <th>${data.get('office').trim()}</th>
    <th>${data.get('age')}</th>
    <th>${formatNumber(data.get('salary'))}</th>
  `;
  tbody.prepend(newPerson);
});

function formatNumber(string) {
  let newString = string;

  if (string.length > 3) {
    newString = newString.split('').reverse();
    newString.splice(3, 0, ',');
    newString = newString.reverse().join('');
  }

  return `$${newString}`;
}

tbody.addEventListener('dblclick', d => {
  const field = d.target;
  const input = document.createElement('input');
  const cellAge = field.closest('tr').children[3];
  const cellSalary = field.closest('tr').children[4];
  const text = field.innerText;

  input.value = text;
  input.className = 'cell-input';

  if (field === cellAge) {
    input.type = 'number';
    input.min = '18';
    input.max = '99';
  }

  if (field === cellSalary) {
    input.value = +text.slice(1).replace(',', '');
    input.type = 'number';
  }

  field.innerText = '';

  field.append(input);

  input.addEventListener('blur', (b) => {
    const currentInput = b.target;
    const inputText = currentInput.value.trim();

    if (field === cellSalary) {
      (parseInt(inputText) > 0)
        ? input.replaceWith(formatNumber(inputText))
        : input.replaceWith(text);
    }

    if (field === cellAge) {
      ageValidation(inputText);

      inputText > 18 && inputText < 90
        ? input.replaceWith(formatNumber(inputText))
        : input.replaceWith(text);
    }

    textValidation(inputText);

    inputText.length > 4
      ? input.replaceWith(inputText)
      : input.replaceWith(text);
  });

  input.addEventListener('keypress', k => {
    const inputText = k.target.value.trim();

    if (k.key === 'Enter') {
      if (field === cellSalary) {
        inputText
          ? input.replaceWith(text)
          : input.replaceWith(formatNumber(inputText));
      }

      inputText
        ? input.replaceWith(text)
        : input.replaceWith(inputText);
    }
  });
});

function ageValidation(string) {
  if (string < 18 || string > 90) {
    pushNotification(
      'Warning', 'Your age must be between 18 and 90 years old', 'warning');
  };
}

function textValidation(string) {
  if (isNaN(string) && string.length < 4) {
    pushNotification('Error', 'Write full name please', 'error');
  };
}

function pushNotification(title, description, type) {
  const block = document.createElement('div');
  const head = document.createElement('h2');
  const massage = document.createElement('p');

  block.setAttribute('data-qa', 'notification');
  block.classList.add('notification', type);

  head.textContent = title;
  massage.textContent = description;

  block.append(head);
  block.append(massage);

  document.body.append(block);

  setTimeout(function() {
    block.remove();
  }, 3000);
};

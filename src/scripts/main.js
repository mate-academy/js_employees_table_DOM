'use strict';

const header = document.querySelector('tr');
const tbody = document.querySelector('tbody');
const rowsArray = tbody.children;
let sorted;
let clickCounter = 0;

document.body.children[0].style.alignSelf = 'flex-start';

for (let i = 0; i <= 2; i++) {
  const item = header.children[i];

  item.addEventListener('click', (e) => {
    clickCounter++;

    sorted = [...rowsArray].sort((a, b) =>
      a.children[i].innerText.localeCompare(b.children[i].innerText));

    if (clickCounter % 2) {
      sorted = [...rowsArray].sort((a, b) =>
        b.children[i].innerText.localeCompare(a.children[i].innerText));
    }

    tbody.prepend(...sorted);
  });
}

header.children[3].addEventListener('click', (e) => {
  clickCounter++;

  sorted = [...rowsArray].sort((a, b) =>
    a.children[3].innerText - b.children[3].innerText);

  if (clickCounter % 2) {
    sorted = [...rowsArray].sort((a, b) =>
      b.children[3].innerText - a.children[3].innerText);
  }
  tbody.prepend(...sorted);
});

header.children[4].addEventListener('click', (e) => {
  clickCounter++;

  sorted = [...rowsArray].sort((a, b) =>
    toNumber(a.children[4]) - toNumber(b.children[4]));

  if (clickCounter % 2) {
    sorted = [...rowsArray].sort((a, b) =>
      toNumber(b.children[4]) - toNumber(a.children[4]));
  }

  tbody.prepend(...sorted);
});

function toNumber(element) {
  return +element.innerText.slice(1).replaceAll(',', '');
};

for (let r = 0; r < rowsArray.length; r++) {
  const row = rowsArray[r];

  row.addEventListener('click', (e) => {
    clickCounter++;

    const activeElement = document.querySelector('.active');

    if (activeElement) {
      activeElement.classList.remove('active');
    }
    row.classList.add('active');
  });
}

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
    required"
  ></label>
  <button type="submit">Save to table</button>
`;
document.body.append(form);

form.addEventListener('submit', e => {
  e.preventDefault();

  const newPerson = document.createElement('tr');
  const data = new FormData(form);

  if (data.get('name').length < 4) {
    pushNotification('Error', 'Write full name please', 'error');

    return;
  };

  if (data.get('age') < 18 || data.get('age') > 90) {
    pushNotification(
      'Warning', 'Your age must be between 18 and 90 years old', 'warning');

    return;
  };

  newPerson.innerHTML = `
    <th>${data.get('name')}</th>
    <th>${data.get('position')}</th>
    <th>${data.get('office')}</th>
    <th>${data.get('age')}</th>
    <th>${formatNumber(data.get('salary'))}</th>
  `;
  tbody.prepend(newPerson);
});

function formatNumber(string) {
  let newString = string;

  newString = newString.split('').reverse();
  newString.splice(3, 0, ',');
  newString = newString.reverse().join('');

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
  }

  if (field === cellSalary) {
    input.value = +text.slice(1).replace(',', '');
    input.type = 'number';
  }

  field.innerText = '';
  field.append(input);

  input.addEventListener('blur', () => {
    const inputText = input.value;

    if (field === cellSalary) {
      inputText
        ? input.replaceWith(formatNumber(inputText))
        : input.replaceWith(text);
    }

    inputText
      ? input.replaceWith(inputText)
      : input.replaceWith(text);
  });

  input.addEventListener('keypress', k => {
    if (k.key === 'Enter') {
      const inputText = k.target.value;

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

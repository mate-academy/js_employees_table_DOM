'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const tr = tbody.querySelectorAll('tr');
const table = document.querySelector('table');

const form = document.createElement('form');

form.className = 'new-employee-form';

const mass = ['Name: ', 'Pozition: ', 'Office: ', 'Age: ', 'Salary: '];
const mass1 = ['name', 'pozition', 'office', 'age', 'salary'];

for (let i = 0; i < 5; i++) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  if (i === 2) {
    const select = document.createElement('select');
    const arr = ['Tokyo', 'Singapore', 'London', 'New York',
      'Edinburgh', 'San Francisco'];

    for (let j = 0; j < arr.length; j++) {
      const option = document.createElement('option');

      option.textContent = arr[j];
      option.value = arr[j];
      select.append(option);
    }
    select.name = mass1[2];
    select.required = true;
    label.textContent = mass[i];
    label.append(select);
    form.append(label);
  } else {
    input.name = mass1[i];
    input.required = true;
    input.dataset.qa = mass1[i];
    label.textContent = mass[i];
    label.append(input);
    form.append(label);
  }
}

const button = document.createElement('button');

button.textContent = 'Save to table';
form.append(button);
form.children[3].children[0].type = 'number';
form.children[4].children[0].type = 'number';
document.body.append(form);

const pushNotification = (title, description, type) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const content = document.createElement('p');

  div.className = `notification ${type}`;
  div.dataset.qa = 'notification';
  h2.className = 'title';
  h2.textContent = title;
  content.textContent = description;
  div.append(h2, content);
  document.body.append(div);
  setTimeout(() => div.remove(), 5000);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const er = 'Имя должно содержать более 4 символов и возраст должен быть';

  if ((data.get('name').length < 5) || (+data.get('age') > 90
    || +data.get('age') < 19)) {
      
    return (pushNotification('Ошибка',
      `${er} больше 18 и меньше 90 лет`, 'error'));
  }

  const newTr = document.createElement('tr');

  newTr.innerHTML = `
    <tr>
      <td>${data.get('name')}</td>
      <td>${data.get('pozition')}</td>
      <td>${Object.fromEntries(data.entries()).office}</td>
      <td>${data.get('age')}</td>
      <td>$${data.get('salary').toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
    </tr>`;
  tbody.append(newTr);
  pushNotification('Рядок додано', ')))))))))))))', 'success');
});

let thead1 = 1; let thead2 = 1; let thead3 = 1; let thead4 = 1; let thead5 = 1;

thead.children[0].children[0].addEventListener('click', (e) => {
  let qwe = [];

  if (thead1 % 2 !== 0) {
    qwe = [...tr].sort((a, b) =>
      a.children[0].textContent.localeCompare(b.children[0].textContent));
  } else {
    qwe = [...tr].sort((a, b) =>
      b.children[0].textContent.localeCompare(a.children[0].textContent));
  }

  for (const i of qwe) {
    tbody.append(i);
  }
  thead1++;
});

thead.children[0].children[1].addEventListener('click', (e) => {
  let qwe = [];

  if (thead2 % 2 !== 0) {
    qwe = [...tr].sort((a, b) =>
      a.children[1].textContent.localeCompare(b.children[1].textContent));
  } else {
    qwe = [...tr].sort((a, b) =>
      b.children[1].textContent.localeCompare(a.children[1].textContent));
  }

  for (const i of qwe) {
    tbody.append(i);
  }
  thead2++;
});

thead.children[0].children[2].addEventListener('click', (e) => {
  let qwe = [];

  if (thead3 % 2 !== 0) {
    qwe = [...tr].sort((a, b) =>
      a.children[2].textContent.localeCompare(b.children[2].textContent));
  } else {
    qwe = [...tr].sort((a, b) =>
      b.children[2].textContent.localeCompare(a.children[2].textContent));
  }

  for (const i of qwe) {
    tbody.append(i);
  }
  thead3++;
});

thead.children[0].children[3].addEventListener('click', (e) => {
  let qwe = [];

  if (thead4 % 2 !== 0) {
    qwe = [...tr].sort((a, b) =>
      a.children[3].textContent - b.children[3].textContent);
  } else {
    qwe = [...tr].sort((a, b) =>
      b.children[3].textContent - a.children[3].textContent);
  }

  for (const i of qwe) {
    tbody.append(i);
  }
  thead4++;
});

thead.children[0].children[4].addEventListener('click', (e) => {
  let qwe = [];

  if (thead5 % 2 !== 0) {
    qwe = [...tr].sort((a, b) =>
      parseFloat(a.children[4].textContent.replace(/^./, ''))
      - parseFloat(b.children[4].textContent.replace(/^./, '')));
  } else {
    qwe = [...tr].sort((a, b) =>
      parseFloat(b.children[4].textContent.replace(/^./, ''))
      - parseFloat(a.children[4].textContent.replace(/^./, '')));
  }

  for (const i of qwe) {
    tbody.append(i);
  }
  thead5++;
});

tbody.addEventListener('click', (e) => {
  const item = e.target.closest('tr');

  for (const i of tr) {
    i.classList.remove('active');
  }
  item.className = 'active';
});

function saveValue(td, input, defaultValue, headName) {
  switch (true) {
    case !input.value:
    case defaultValue.length === 2 && isNaN(+input.value):
    case defaultValue.length === 2
      && (+input.value < 18 || +input.value > 90):
    case isNaN(+defaultValue.replace(/(^\$)|,/g, ''))
    && input.value.length < 4:
    case !isNaN(+defaultValue.replace(/(^\$)|,/g, ''))
    && isNaN(+input.value.replace(/(^\$)|,/g, '')):
    case isNaN(+defaultValue.replace(/(^\$)|,/g, ''))
    && !isNaN(+input.value.replace(/(^\$)|,/g, '')):
      td.textContent = defaultValue;
      break;
    case (headName === 'Salary'):
      td.textContent = input.value.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      break;

    default:
      td.textContent = input.value;
  }
}

tbody.addEventListener('dblclick', (e) => {
  const td = e.target;
  const defaultValue = td.textContent;
  const headName = table.rows[0].cells[td.cellIndex].textContent;
  let oldData;
  let input;

  if (headName === 'Office') {
    input = document.createElement('select');

    oldData = td.innerHTML;
    td.innerHTML = '';

    input.insertAdjacentHTML('afterbegin', `
      <select data-qa="office" name="office">
        <option value = "Tokyo">Tokyo</option>
        <option value = "Singapore">Singapore</option>
        <option value = "London">London</option>
        <option value = "New York">New York</option>
        <option value = "Edinburgh">Edinburgh</option>
        <option value = "San Francisco">San Francisco</option>
      </select>
    `);
    input.style.width = window.getComputedStyle(e.target).width;
    input.classList.add('cell-input');
    input.value = oldData;
    td.append(input);
    input.focus();
  } else {
    input = document.createElement('input');

    input.style.width = window.getComputedStyle(e.target).width;
    oldData = td.innerHTML;
    input.classList.add('cell-input');
    td.innerHTML = '';
    input.value = oldData;
    td.append(input);
  }

  input.addEventListener('blur', () =>
    saveValue(td, input, defaultValue, headName));

  input.addEventListener('keydown', (ev) => {
    if (ev.code === 'Enter') {
      saveValue(td, input, defaultValue, headName);
    }
  });
});

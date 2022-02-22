'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const tr = tbody.querySelectorAll('tr');
const table = document.querySelector('table');

const form = document.createElement('form');

form.className = 'new-employee-form';

form.insertAdjacentHTML('beforeend', `
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Pozition:
    <input name="name" type="text" data-qa="pozition" required>
  </label>
  <label>Office:
    <select name="office" data-qa="office" required>
      <option value = "Tokyo">Tokyo</option>
      <option value = "Singapore">Singapore</option>
      <option value = "London">London</option>
      <option value = "New York">New York</option>
      <option value = "Edinburgh">Edinburgh</option>
      <option value = "San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age" required></label>
  <label>Salary:
    <input name="salary" type="number" data-qa="salary" required>
  </label>
  <button>Save to table</button>
`);

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
  const dataName = data.get('name');
  const dataAge = data.get('age');

  if ((dataName.length < 5) || (+dataAge > 90
    || +dataAge < 19)) {
    return (pushNotification('Ошибка', `Имя должно содержать более 4 
    символов и возраст должен быть больше 18 и меньше 90 лет`, 'error'));
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

let asc = false;

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th || !thead.contains(th)) {
    return;
  }

  asc = !asc;

  const indexCell = e.target.cellIndex;

  const sorted = [...tr].sort((a, b) => {
    const sortA = a.cells[indexCell].innerText.replace(/\$|,/g, '');
    const sortB = b.cells[indexCell].innerText.replace(/\$|,/g, '');

    if (asc) {
      if (isNaN(sortA)) {
        return sortA.localeCompare(sortB);
      } else {
        return sortA - sortB;
      }
    } else {
      if (isNaN(sortB)) {
        return sortB.localeCompare(sortA);
      } else {
        return sortB - sortA;
      }
    }
  });

  tbody.append(...sorted);
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

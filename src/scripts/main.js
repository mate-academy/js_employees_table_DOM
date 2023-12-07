'use strict';

const headerItems = document.querySelectorAll('thead th');
const table = document.querySelector('tbody');
let waySort = 1;
let topNotification = 500;

const pushNotification = (posTop, posRight, title, description, type) => {
  topNotification += 120;

  const message = document.createElement('div');
  const head = document.createElement('h2');
  const par = document.createElement('p');

  head.textContent = title;
  head.classList.toggle('title');

  par.textContent = description;

  message.appendChild(head);
  message.appendChild(par);
  message.classList.add('notification', type);
  message.setAttribute('data-qa', 'notification');
  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;

  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
    topNotification = 500;
  }, 2000);
};

headerItems.forEach(item => {
  item.addEventListener('click', (i) => {
    const tableRows = document.querySelectorAll('tbody tr');

    waySort++;

    const itemIndex = [...headerItems].indexOf(i.target);

    const sortedTable = [...tableRows].sort((row1, row2) => {
      let textRow1;
      let textRow2;

      if (waySort % 2 !== 0) {
        textRow1 = row1.children[itemIndex].innerText;
        textRow2 = row2.children[itemIndex].innerText;
      } else {
        textRow1 = row2.children[itemIndex].innerText;
        textRow2 = row1.children[itemIndex].innerText;
      }

      if (textRow1[0] === '$' || !isNaN(+textRow1)) {
        return parseInt(textRow1.replace(/\D/g, ''))
          - parseInt(textRow2.replace(/\D/g, ''));
      }

      return textRow1.localeCompare(textRow2);
    });

    table.append(...sortedTable);
  });
});

const tbody = document.querySelector('tbody');
let clickActive = tbody.querySelectorAll('tr');

for (const row of clickActive) {
  row.addEventListener('click', () => {
    clickActive.forEach(r => r.classList.remove('active'));
    row.classList.add('active');
  });
}

const form = document.createElement('form');
const body = document.querySelector('body');

form.classList.add('new-employee-form');
form.action = '#';
form.method = 'post';

form.innerHTML = `
<label>Name: <input data-qa="name" name="name" type="text" required></label>
<label>Position: <input
  data-qa="position" name="position" type="text" required></label>
<label>Office: <select data-qa="office" name="office">
  <option>Tokyo</option>
  <option>Singapore</option>
  <option>London</option>
  <option>New York</option>
  <option>Edinburgh</option>
  <option>San Francisco</option>
  </select>
</label>
<label>Age: <input
  data-qa="age" name="age" type="number" required></label>
<label>Salary:
  <input data-qa="salary" name="salary" type="number" required>
</label>
<button type="submit">Save to table</button>
`;

body.append(form);

form.addEventListener('click', e => {
  if (e.target.tagName === 'BUTTON') {
    e.preventDefault();

    const valueInputs = {
      name: document.querySelector('[data-qa="name"]'),
      position: document.querySelector('[data-qa="position"]'),
      office: document.querySelector('[data-qa="office"]'),
      age: document.querySelector('[data-qa="age"]'),
      salary: document.querySelector('[data-qa="salary"]'),
    };

    if (valueInputs.name.value.length < 4) {
      pushNotification(topNotification, 235, 'failure',
        'From the user\n '
      + 'the name is too short, must be at least 4 characters.', 'error');
    } else if (+valueInputs.age.value < 18) {
      pushNotification(topNotification, 235, 'failure',
        'From the user\n '
      + 'age too young must be at least 18 years old.', 'error');
    } else if (valueInputs.age.value.length === 0
      || valueInputs.name.value.length === 0
      || valueInputs.position.value.length === 0
      || valueInputs.salary.value.length === 0
    ) {
      pushNotification(topNotification, 235, 'failure',
        'All field\n '
      + 'should not be empty.', 'error');
    } else if (+valueInputs.age.value > 90) {
      pushNotification(topNotification, 235, 'failure',
        'From the user\n '
      + 'age too old should be no more than 90', 'error');
    } else {
      const newRow = document.createElement('tr');

      for (const [key, value] of Object.entries(valueInputs)) {
        const newCell = document.createElement('td');

        if (key === 'salary') {
          newCell.textContent = '$'
          + (+value.value).toLocaleString('en-US');
        } else {
          newCell.textContent = value.value;
        }

        newRow.appendChild(newCell);
      }

      tbody.append(newRow);
      form.reset();
      clickActive = tbody.querySelectorAll('tr');

      newRow.addEventListener('click', () => {
        clickActive.forEach(r => r.classList.remove('active'));
        newRow.classList.add('active');
      });

      pushNotification(topNotification, 235, 'succes',
        'The user\n '
      + 'add a table', 'succes');
    }
  }
});

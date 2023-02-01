'use strict';

let usersData = [
  {
    name: 'Airi Satou',
    position: 'Accountant',
    office: 'Tokyo',
    age: 33,
    salary: '$162,700',
  },
  {
    name: 'Michael Bruce',
    position: 'Javascript Developer',
    office: 'Singapore',
    age: 29,
    salary: '$162,700',
  },
  {
    name: 'Michael Silva',
    position: 'Marketing Designer',
    office: 'London',
    age: 66,
    salary: '$198,500',
  },
  {
    name: 'Prescott Bartlett',
    position: 'Technical Author',
    office: 'London',
    age: 27,
    salary: '$145,000',
  },
  {
    name: 'Thor Walton',
    position: 'Developer',
    office: 'New York',
    age: 61,
    salary: '$98,540',
  },
  {
    name: 'Rhona Davidson',
    position: 'Integration Specialist',
    office: 'Tokyo',
    age: 55,
    salary: '$327,900',
  },
  {
    name: 'Serge Baldwin',
    position: 'Data Coordinator',
    office: 'Singapore',
    age: 64,
    salary: '$138,575',
  },
  {
    name: 'Shad Decker',
    position: 'Regional Director',
    office: 'Edinburgh',
    age: 51,
    salary: '$183,000',
  },
  {
    name: 'Shou Itou',
    position: 'Regional Marketing',
    office: 'Tokyo',
    age: 20,
    salary: '$163,000',
  },
  {
    name: 'Vivian Harrell',
    position: 'Financial Controller',
    office: 'San Francisco',
    age: 62,
    salary: '$452,500',
  },
  {
    name: 'Zorita Serrano',
    position: 'Software Engineer',
    office: 'San Francisco',
    age: 56,
    salary: '$115,000',
  },
  {
    name: 'Colleen Hurst',
    position: 'Javascript Developer',
    office: 'San Francisco',
    age: 39,
    salary: '$205,500',
  },
];

function initTableBody() {
  tableBody.innerHTML = `
    <tbody>
      ${usersData.map(item => `
        <tr>
          <td>${item.name}</td>
          <td>${item.position}</td>
          <td>${item.office}</td>
          <td>${item.age}</td>
          <td>${item.salary}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

function initForm() {
  table.insertAdjacentHTML('afterend', `
    <form class="new-employee-form">
      <label>Name:
        <input name="name" type="text" data-qa="name" required>
      </label>
      <label>Position:
        <input name="position" type="text" data-qa="position" required>
      </label>
      <label>Office:
        <select name="office" data-qa="office" required>
          <option value="San Francisco">San Francisco</option>
          <option value="Tokyo">Tokyo</option>
          <option value="Singapore">Singapore</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
        </select>
      </label>
      <label>Age:
        <input name="age" type="number" data-qa="age" required>
      </label>
      <label>Salary:
        <input name="salary" type="number" data-qa="salary" required>
      </label>
      <button type="submit">Save to table</button>
    </form>
  `);
}

const table = document.querySelector('table');
const tableHead = table.querySelector('thead');
const tableBody = document.querySelector('tbody');

initTableBody();
initForm();

const form = document.querySelector('.new-employee-form');
const notification = document.querySelector('[data-qa="notification"]');

let index;
let count = 1;

tableHead.addEventListener('click', (e) => {
  const item = e.target.textContent.toLowerCase();

  const dir = count % 2 === 0 && item === index
    ? 'desc'
    : 'abs';

  usersData = usersData.sort((a, b) => {
    let prev = a[item];
    let curr = b[item];

    if (isFinite(prev)) {
      return dir === 'desc'
        ? curr - prev
        : prev - curr;
    }

    if (prev.includes('$')) {
      prev = prev.replace(/[$,]/g, '');
      curr = curr.replace(/[$,]/g, '');

      return dir === 'desc'
        ? curr - prev
        : prev - curr;
    }

    return dir === 'desc'
      ? curr.localeCompare(prev)
      : prev.localeCompare(curr);
  });

  count++;
  index = item;
  initTableBody(usersData);
});

tableBody.addEventListener('click', (e) => {
  for (const row of tableBody.children) {
    row.classList.toggle('active', row === e.target.closest('tr'));
  }
});

let validation;

function initNotification() {
  notification.classList.add('notification', `${validation
    ? 'error'
    : 'success'}`);

  notification.innerHTML = `
    <p class="title">
      ${validation
    ? 'Please fill out all fields!'
    : 'Congratulations! Your data has been entered into the table!'}
    </p>
  `;
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const userName = form.querySelector('[name="name"]');
  const userAge = form.querySelector('[name="age"]');
  const userOffice = form.querySelector('[name="office"]');
  const userPosition = form.querySelector('[name="position"]');
  const userSalary = form.querySelector('[name="salary"]');

  const salary
  = `$${userSalary.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

  validation
    = userName.value.length < 4 || (userAge.value < 18 || userAge.value > 90) || userPosition.value.length === 0;

  initNotification();

  if (validation) {
    return false;
  }

  usersData.push({
    name: userName.value,
    position: userPosition.value,
    office: userOffice.value,
    age: userAge.value,
    salary: salary,
  });

  initTableBody();
  e.target.reset();

  setTimeout(() => {
    notification.removeAttribute('class');
    // notification.className = '';
    // notification.innerHTML = '';
  }, 6000);
});

tableBody.addEventListener('dblclick', (e) => {
  const item = e.target.closest('td');

  if (!item) {
    return;
  }

  let val = item.innerHTML;
  const input = document.createElement('input');

  input.classList.add('cell-input');
  item.innerHTML = '';
  item.append(input);

  function changeCellValue() {
    if (input.value.length > 0) {
      val = input.value;
    }

    item.innerText = val;
  }

  input.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Enter') {
      return;
    }

    changeCellValue();
  });

  input.addEventListener('blur', () => {
    changeCellValue();
  });

  input.focus();
});

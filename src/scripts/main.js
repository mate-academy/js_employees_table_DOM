'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

// table sorting by clicking on the title (in two directions)
const nodeList = [...tbody.children].map((i) => i.innerText.split('\t'));
let sortType = 'asc';
let lastClikedTitle = '';

const th = {
  Name: 0,
  Position: 1,
  Office: 2,
  Age: 3,
  Salary: 4,
};

thead.onclick = (e) => {
  const sortBy = e.target.innerText;

  switch (sortBy) {
    case 'Name':
    case 'Position':
    case 'Office':
      if (lastClikedTitle !== sortBy || sortType === 'asc') {
        nodeList.sort((a, b) => a[th[sortBy]].localeCompare(b[th[sortBy]]));
        lastClikedTitle = sortBy;
        sortType = 'desc';
      } else {
        nodeList.sort((a, b) => b[th[sortBy]].localeCompare(a[th[sortBy]]));
        sortType = 'asc';
      }
      break;

    case 'Age':
      if (lastClikedTitle !== sortBy || sortType === 'asc') {
        nodeList.sort((a, b) => a[th[sortBy]] - b[th[sortBy]]);
        lastClikedTitle = sortBy;
        sortType = 'desc';
      } else {
        nodeList.sort((a, b) => b[th[sortBy]] - a[th[sortBy]]);
        sortType = 'asc';
      }
      break;

    case 'Salary':
      if (lastClikedTitle !== sortBy || sortType === 'asc') {
        nodeList.sort(
          (a, b) =>
            a[th[sortBy]].slice(1).split(',').join('') -
            b[th[sortBy]].slice(1).split(',').join(''),
        );
        lastClikedTitle = sortBy;
        sortType = 'desc';
      } else {
        nodeList.sort(
          (a, b) =>
            b[th[sortBy]].slice(1).split(',').join('') -
            a[th[sortBy]].slice(1).split(',').join(''),
        );
        sortType = 'asc';
      }
  }

  for (let i = 0; i < nodeList.length; i++) {
    // remove selected row when we sort the table
    tbody.children[i].classList.remove('active');

    tbody.children[i].innerHTML = `
        <td>${nodeList[i][0]}</td>
        <td>${nodeList[i][1]}</td>
        <td>${nodeList[i][2]}</td>
        <td>${nodeList[i][3]}</td>
        <td>${nodeList[i][4]}</td>
        `;
  }
};

// add active class to selected row
tbody.onclick = (e) => {
  const tr = e.target.parentNode;

  for (let i = 0; i < tbody.children.length; i++) {
    if (i === tr.sectionRowIndex) {
      tbody.children[i].classList.add('active');
    } else {
      tbody.children[i].classList.remove('active');
    }
  }
};

// add a form to the document
document.body.insertAdjacentHTML(
  'beforeend',
  `
  <form class="new-employee-form" novalidate>
    <label>Name: <input name="name" type="text" data-qa="name" required></label>
    <label>Position: <input name="position" type="text" data-qa="position" required></label>
    <label>Office:
      <select name="office" data-qa="office" required>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" data-qa="age" required></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
    <button type="submit">Save to table</button>
  </form>
  `,
);

const form = document.querySelector('.new-employee-form');

// add new employee to the table
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const userName = form.elements.name.value;
  const position = form.elements.position.value;
  const office = form.elements.office.value;
  const age = form.elements.age.value;
  const salary = '$' + (+form.elements.salary.value).toLocaleString('en-US');

  const createNotification = (type, msg) => {
    const notification = document.createElement('div');

    notification.className = `notification ${type}`;
    document.body.append(notification);

    const title = document.createElement('h3');

    title.className = 'title';
    title.textContent = `${msg}`;

    notification.append(title);

    setTimeout(() => notification.remove(), 3000);
  };

  // check if all inputs are filled
  if (userName.length < 4) {
    return createNotification('error', 'Name has less than 4 letters');
  }

  if (position.length === 0) {
    return createNotification('error', 'Position must be entered');
  }

  if (age < 18) {
    return createNotification('error', 'Age is less than 18');
  }

  if (age > 90) {
    return createNotification('error', 'Age is more than 90');
  }

  if (form.elements.salary.value <= 0) {
    return createNotification('error', 'Salary must be entered');
  }

  // insert new employee to the table
  tbody.insertAdjacentHTML(
    'beforeend',
    `
      <tr>
            <td>${userName}</td>
            <td>${position}</td>
            <td>${office}</td>
            <td>${age}</td>
            <td>${salary}</td>
      </tr>
      `,
  );

  nodeList.push([userName, position, office, age, salary]);

  createNotification(
    'success',
    'New employee is successfully added to the table',
  );

  // clear all inputs after submit
  form.elements.name.value = '';
  form.elements.position.value = '';
  form.elements.office.value = 'Tokyo';
  form.elements.age.value = '';
  form.elements.salary.value = '';
});

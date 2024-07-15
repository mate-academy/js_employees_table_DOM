'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

// table sorting by clicking on the title (in two directions)
const nodeList = [...tbody.children].map((i) => i.innerText.split('\t'));
let sortByName = 'asc';
let sortByPosition = 'asc';
let sortByOffice = 'asc';
let sortByAge = 'asc';
let sortBySalary = 'asc';

thead.onclick = (e) => {
  const sortBy = e.target.innerText;

  if (sortBy === 'Name') {
    if (sortByName === 'asc') {
      nodeList.sort((a, b) => a[0].localeCompare(b[0]));
      sortByName = 'decs';
    } else {
      nodeList.sort((a, b) => b[0].localeCompare(a[0]));
      sortByName = 'asc';
    }
    sortByPosition = 'asc';
    sortByOffice = 'asc';
    sortByAge = 'asc';
    sortBySalary = 'asc';
  }

  if (sortBy === 'Position') {
    if (sortByPosition === 'asc') {
      nodeList.sort((a, b) => a[1].localeCompare(b[1]));
      sortByPosition = 'decs';
    } else {
      nodeList.sort((a, b) => b[1].localeCompare(a[1]));
      sortByPosition = 'asc';
    }
    sortByName = 'asc';
    sortByOffice = 'asc';
    sortByAge = 'asc';
    sortBySalary = 'asc';
  }

  if (sortBy === 'Office') {
    if (sortByOffice === 'asc') {
      nodeList.sort((a, b) => a[2].localeCompare(b[2]));
      sortByOffice = 'decs';
    } else {
      nodeList.sort((a, b) => b[2].localeCompare(a[2]));
      sortByOffice = 'asc';
    }
    sortByName = 'asc';
    sortByPosition = 'asc';
    sortByAge = 'asc';
    sortBySalary = 'asc';
  }

  if (sortBy === 'Age') {
    if (sortByAge === 'asc') {
      nodeList.sort((a, b) => a[3] - b[3]);
      sortByAge = 'decs';
    } else {
      nodeList.sort((a, b) => b[3] - a[3]);
      sortByAge = 'asc';
    }
    sortByName = 'asc';
    sortByPosition = 'asc';
    sortByOffice = 'asc';
    sortBySalary = 'asc';
  }

  if (sortBy === 'Salary') {
    if (sortBySalary === 'asc') {
      nodeList.sort(
        (a, b) =>
          a[4].slice(1).split(',').join('') - b[4].slice(1).split(',').join(''),
      );
      sortBySalary = 'decs';
    } else {
      nodeList.sort(
        (a, b) =>
          b[4].slice(1).split(',').join('') - a[4].slice(1).split(',').join(''),
      );
      sortBySalary = 'asc';
    }
    sortByName = 'asc';
    sortByPosition = 'asc';
    sortByOffice = 'asc';
    sortByAge = 'asc';
  }

  for (let i = 0; i < nodeList.length; i++) {
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

  form.elements.name.value = '';
  form.elements.position.value = '';
  form.elements.office.value = 'Tokyo';
  form.elements.age.value = '';
  form.elements.salary.value = '';
});

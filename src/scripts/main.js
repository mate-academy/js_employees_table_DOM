'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const body = document.querySelector('body');
const headers = [...thead.querySelectorAll('th')];
const peopleArray = [];
const people = [...tbody.children];
let lastSortedBy = '';

headers.forEach((header) => {
  header.addEventListener('click', () => sortBy(header.innerText));
});

people.forEach((person) => {
  person.addEventListener('click', () => {
    const selected = document.querySelector('.active');

    if (selected) {
      selected.classList.remove('active');
    }

    person.classList.add('active');
  });

  const arrayPerson = [];

  [...person.children].forEach((td) => {
    arrayPerson.push(td.innerHTML);
  });

  peopleArray.push(arrayPerson);
});

function sortBy(headerText) {
  if (lastSortedBy === headerText) {
    renderSortedPeople(peopleArray.reverse());

    return;
  }

  switch (headerText) {
    case 'Name':
      peopleArray.sort((a, b) => a[0].localeCompare(b[0]));
      break;
    case 'Position':
      peopleArray.sort((a, b) => a[1].localeCompare(b[1]));
      break;
    case 'Office':
      peopleArray.sort((a, b) => a[2].localeCompare(b[2]));
      break;
    case 'Age':
      peopleArray.sort((a, b) => parseInt(a[3]) - parseInt(b[3]));
      break;
    case 'Salary':
      peopleArray.sort(
        (a, b) =>
          parseInt(a[4].replace(/[$,]/g, '')) -
          parseInt(b[4].replace(/[$,]/g, '')),
      );
      break;
    default:
      break;
  }

  lastSortedBy = headerText;
  renderSortedPeople(peopleArray);
}

function renderSortedPeople(sortedPeople) {
  [...tbody.children].forEach((person) => person.remove());

  sortedPeople.forEach((person) => {
    const tr = document.createElement('tr');

    person.forEach((field) => {
      const td = document.createElement('td');

      td.innerHTML = field;

      tr.insertAdjacentElement('beforeend', td);
    });

    tbody.insertAdjacentElement('beforeend', tr);
  });
}

function createForm() {
  const form = document.createElement('form');
  const button = document.createElement('button');

  button.classList.add('button');
  button.innerHTML = 'Save to table';
  button.addEventListener('click', (e) => createNewEmployer(e));

  const cities = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  form.classList.add('new-employee-form');

  headers.forEach((header) => {
    const label = document.createElement('label');

    label.innerText = header.innerText + ': ';

    switch (header.innerHTML) {
      case 'Name':
      case 'Position':
        const input = document.createElement('input');

        input.name = header.innerHTML.toLowerCase();
        input.dataset.qa = header.innerHTML.toLowerCase();
        input.type = 'text';

        label.appendChild(input);
        break;
      case 'Salary':
      case 'Age':
        const inputNum = document.createElement('input');

        inputNum.name = header.innerHTML.toLowerCase();
        inputNum.dataset.qa = header.innerHTML.toLowerCase();
        inputNum.type = 'number';

        label.appendChild(inputNum);

        break;
      case 'Office':
        const select = document.createElement('select');

        select.dataset.qa = header.innerHTML.toLowerCase();

        cities.forEach((city) => {
          const option = document.createElement('option');

          option.value = city;
          option.innerHTML = city;

          select.appendChild(option);
        });
        label.appendChild(select);
        break;

      default:
        break;
    }

    form.appendChild(label);
  });

  form.appendChild(button);
  body.appendChild(form);
}

function createNewEmployer(e) {
  e.preventDefault();

  const inputs = document.querySelectorAll('input');
  const select = document.querySelector('select');

  let error = false;

  const newPerson = {
    name: '',
    positon: '',
    office: '',
    age: 0,
    salary: 0,
  };

  inputs.forEach((input) => {
    switch (input.name) {
      case 'name':
        if (input.value.length < 4) {
          pushNotification(
            10,
            10,
            'Name should have more than 4 letters',
            'Please, type more letters',
            'error',
          );
          error = true;
        } else {
          newPerson.name = input.value;
        }
        break;
      case 'position':
        newPerson.positon = input.value;
        break;
      case 'age':
        if (input.value <= 18) {
          pushNotification(
            10,
            10,
            'Employee can`t be so young',
            'Please, do not take children to work',
            'error',
          );
          error = true;
        } else if (input.value >= 90) {
          pushNotification(
            10,
            10,
            'Employee can`t be so old',
            'Please, do not take so old people to work',
            'error',
          );
          error = true;
        } else {
          newPerson.age = input.value.toString();
        }
        break;
      case 'salary':
        const formattedValue = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
        }).format(input.value);

        newPerson.salary = formattedValue;
        break;

      default:
        break;
    }
  });

  newPerson.office = select.value;

  if (!error) {
    const tr = document.createElement('tr');

    Object.values(newPerson).forEach((value) => {
      const td = document.createElement('td');

      td.innerText = value;

      tr.appendChild(td);
    });

    tbody.appendChild(tr);

    pushNotification(
      10,
      10,
      'Employee added to table',
      'Someone else?',
      'success',
    );
  }
}

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');
  const elTitle = document.createElement('h2');
  const elDescription = document.createElement('p');

  const oldNotification = document.querySelector('.notification');

  if (oldNotification) {
    oldNotification.remove();
  }

  elTitle.innerText = title;
  elTitle.className = 'title';
  elDescription.innerText = description;
  notification.classList.add('notification', type);
  notification.insertAdjacentElement('beforeend', elTitle);
  notification.insertAdjacentElement('beforeend', elDescription);
  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';
  notification.dataset.qa = 'notification';
  body.insertAdjacentElement('afterbegin', notification);

  setTimeout(() => {
    notification.style.visibility = `hidden`;
  }, 2000);
};

createForm();

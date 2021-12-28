'use strict';

const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');

const pushNotification = (posTop, posRight, title, description, type) => {
  const body = document.querySelector('body');

  const message = document.createElement('message');

  message.insertAdjacentHTML('afterbegin', `
  <h2 class = title>${title}</h2>
  <p>${description}</p>
  `);

  message.className = `notification ${type}`;
  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;

  body.append(message);

  setTimeout(() => {
    message.remove();
  }, 2000);
}; // notifications

tbody.addEventListener('click', (eve) => {
  for (const tr of [...tbody.children]) {
    if (tr.className === 'active') {
      tr.classList.remove('active');
    }
  }

  const selected = eve.target.closest('tr');

  selected.classList.add('active');
}); // selecting rows

thead.addEventListener('click', (eve) => {
  const sort = (index) => {
    let sorted = null;

    if (index === 4) {
      sorted = [...tbody.rows].sort(
        (a, b) =>
          a.cells[index].innerHTML.replace(/[^0-9]/g, '')
          - b.cells[index].innerHTML.replace(/[^0-9]/g, ''));
    } else {
      sorted = [...tbody.rows].sort(
        (a, b) => a.cells[index].innerHTML > b.cells[index].innerHTML ? 1 : -1);
    }

    tbody.append(...sorted);
  };

  if (eve.target.innerText === 'Name') {
    sort(0);
  }

  if (eve.target.innerText === 'Position') {
    sort(1);
  }

  if (eve.target.innerText === 'Office') {
    sort(2);
  }

  if (eve.target.innerText === 'Age') {
    sort(3);
  }

  if (eve.target.innerText === 'Salary') {
    sort(4);
  }
}); // sorting

const form = document.createElement('form');

form.innerHTML = `
<label>Name: <input name="name" type="text" data-qa="name" required></label>
<label>Position:
<input name="position" type="text" data-qa="position" required></label>
<label>Office: <select name="office" data-qa="office" required>
  <option value="Tokyo">Tokyo</option>
  <option value="Singapore">Singapore</option>
  <option value="London">London</option>
  <option value="New York">New York</option>
  <option value="Edinburgh">Edinburgh</option>
  <option value="San Francisco">San Francisco</option>
</select></label>
<label>Age: <input name="age" type="number" data-qa="age" required></label>
<label>Salary:
<input name="salary" type="number" data-qa="salary" required></label>
<button name="button" type="submit">Save to table</button>
`; // form html

form.classList.add('new-employee-form');

document.querySelector('body').append(form);

const button = document.querySelector('button');

form.addEventListener('submit', (eve) => {
  eve.preventDefault();
}); // preventDefault for submit

button.addEventListener('click', (eve) => {
  const person = {
    name: form.querySelector('input[name="name"]').value,
    position: form.querySelector('input[name="position"]').value,
    office: form.querySelector('select').value,
    age: form.querySelector('input[name="age"]').value,
    salary: form.querySelector('input[name="salary"]').value,
  };

  person.salary = (+person.salary).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  if (person.name.length < 4) {
    pushNotification(150, 10, 'Error',
      'Name is too short.\n '
      + 'Your name should contain more than 3 symblos.', 'error');
  } else if (person.age < 18 || person.age > 90) {
    pushNotification(150, 10, 'Error',
      'Your age is too big or small.\n '
      + '', 'error');
  } else {
    const newPerson = document.createElement('tr');

    newPerson.innerHTML = `
    <td>${person.name}</td>
    <td>${person.position}</td>
    <td>${person.office}</td>
    <td>${person.age}</td>
    <td>${person.salary}</td>
    `;

    tbody.append(newPerson);

    form.querySelector('input[name="name"]').value = '';
    form.querySelector('input[name="position"]').value = '';
    form.querySelector('select').value = 'Tokyo';
    form.querySelector('input[name="age"]').value = '';
    form.querySelector('input[name="salary"]').value = '';

    pushNotification(150, 10, 'Success',
      'New person added successfully.\n '
      + '', 'Success');
  }
}); // add to table new person from form

tbody.addEventListener('dblclick', (eve) => {
  const initial = eve.target.innerText;
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.setAttribute('size', '4');

  eve.target.innerText = '';
  eve.target.append(input);

  input.focus();

  input.addEventListener('keyup', even => {
    if (even.key === 'Enter') {
      if (input.value.length > 0) {
        eve.target.innerText = input.value;
      } else {
        eve.target.innerText = initial;
      }
    }
  }); // enter input

  input.onblur = function() {
    if (input.value.length <= 0) {
      eve.target.innerText = initial;
    }
  }; // onblur input
}); // editing for dbclick

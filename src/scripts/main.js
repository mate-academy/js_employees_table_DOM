'use strict';

const form = document.createElement('form');

form.className = 'new-employee-form';

const formField = [
  {
    name: 'name',
    type: 'text',
  },
  {
    name: 'position',
    type: 'text',
  },
  {
    name: 'age',
    type: 'number',
  },
  {
    name: 'salary',
    type: 'number',
  },
];

const selectValues = ['Tokyo', 'Singapore', 'London', 'New York',
  'Edinburgh', 'San Francisco'];

form.innerHTML = formField.map(field => `
  <label>
    ${field.name[0].toUpperCase() + field.name.slice(1)}:
      <input
        name="${field.name}"
        type="${field.type}"
        data-qa="${field.name}"
        required
      >
  </label>
`).join('');

form.querySelector('[name="age"]').setAttribute('min', 18);
form.querySelector('[name="age"]').setAttribute('max', 90);

document.querySelector('table').insertAdjacentElement('afterend', form);

form.children[1].insertAdjacentHTML('afterend', `
  <label>Office:
    <select name="office" data-qa="office" required>
      ${selectValues.map(value => `
      <option value="${value}">
        ${value}
      </option>`)}
    </select>
  </label>
`);

form.insertAdjacentHTML('beforeend', `
  <button type="submit">
    Save to table
  </button>
`);

const button = document.querySelector('button');

button.addEventListener('click', (evt) => {
  evt.preventDefault();

  const fName = form.querySelector('[name="name"]');
  const fAge = form.querySelector('[name="age"]');

  if (fName.value.length < 4) {
    alert('Name minimum length is 4');
    fName.focus();

    return false;
  } else if (fAge.value > 90 || fAge.value < 18) {
    alert('Age value is less than 18 or more than 90');
    fName.focus();

    return false;
  } else {
    alert('New employee is successfully added to the table');

    const newEmployy = [...form.querySelectorAll('label')].map(person => {
      return person.children[0].value;
    });

    const salary = (Math.round(newEmployy[4] * 1000) / 1000).toFixed(3);

    newEmployy[4] = '$' + salary.toString().replace('.', ',');
    form.reset();

    const newPerson = document.createElement('tr');

    newPerson.innerHTML = newEmployy.map(el => `<td>${el}</td>`).join('');

    document.querySelector('tbody')
      .insertAdjacentElement('beforeend', newPerson);
  }
});

[...document.querySelectorAll('thead tr th')].forEach((element, index) => {
  element.addEventListener('click', (e) => {
    if (!element.hasAttribute('direction')
      || element.getAttribute('direction') === 'DESC') {
      element.setAttribute('direction', 'ASC');
    } else {
      element.setAttribute('direction', 'DESC');
    }

    const rows = document.querySelectorAll('tbody tr');

    const sortedRows = [...rows].sort((a, b) => {
      let compareA = a.querySelectorAll('td')[index].innerText;
      let compareB = b.querySelectorAll('td')[index].innerText;

      if (element.getAttribute('direction') === 'DESC') {
        compareA = b.querySelectorAll('td')[index].innerText;
        compareB = a.querySelectorAll('td')[index].innerText;
      }

      if (e.target.innerText === 'Salary') {
        return compareA.slice(1).split(',').join('.')
          - compareB.slice(1).split(',').join('.');
      }

      if (typeof (compareA) === 'string') {
        return compareA.localeCompare(compareB);
      }

      return compareA - compareB;
    });

    document.querySelector('tbody').replaceChildren(...rows, ...sortedRows);
  });
});

[...document.querySelectorAll('tbody tr')].map(element => {
  element.addEventListener('click', (e) => {
    const activeElement = document.getElementsByClassName('active')[0];

    if (activeElement) {
      activeElement.classList.remove('active');
    }

    e.target.closest('tr').classList.add('active');
  });
});

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

form.innerHTML = formField.map(field => `
  <label>
    ${field.name[0].toUpperCase() + field.name.slice(1)}:
      <input name="${field.name}" type="${field.type}" data-qa="${field.name}">
  </label>
`).join('');

document.querySelector('table').insertAdjacentElement('afterend', form);

document.querySelector('[name="age"]').setAttribute('min', 14);

const selectValues = ['Tokyo', 'Singapore', 'London', 'New York',
  'Edinburgh', 'San Francisco'];

form.children[1].insertAdjacentHTML('afterend', `
  <label>Office:
    <select name="office" data-qa="office" >
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

  const newEmployy = [...form.querySelectorAll('label')].map(person => {
    return person.children[0].value;
  });
  const salary = (Math.round(newEmployy[4] * 1000) / 1000).toFixed(3);

  newEmployy[4] = '$' + salary.toString().replace('.', ',');
  form.reset();

  const newPerson = document.createElement('tr');

  newPerson.innerHTML = newEmployy.map(el => `<td>${el}</td>`).join('');

  document.querySelector('tbody').insertAdjacentElement('beforeend', newPerson);
});

const header = document.querySelectorAll('thead tr th');
const rows = document.querySelectorAll('tbody tr');

[...header].forEach((element, index) => {
  element.addEventListener('click', (e) => {
    if (!element.hasAttribute('direction')
      || element.getAttribute('direction') === 'DESC') {
      element.setAttribute('direction', 'ASC');
    } else {
      element.setAttribute('direction', 'DESC');
    }

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

[...rows].forEach(element => {
  element.addEventListener('click', (e) => {
    const activeElement = document.getElementsByClassName('active')[0];

    if (activeElement) {
      activeElement.classList.remove('active');
    }

    e.target.closest('tr').classList.add('active');
  });
});

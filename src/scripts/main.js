'use strict';

const headers = [...document.querySelector('thead').firstElementChild.children];
const tbody = document.querySelector('tbody');
let people = [...document.querySelector('tbody').children];

headers.forEach(header => {
  header.setAttribute('Order', 'asc');

  header.addEventListener('click', (e) => {
    const copyHeaders = [...headers];

    copyHeaders.splice(e.target.cellIndex, 1);
    copyHeaders.forEach(head => head.setAttribute('Order', 'asc'));

    people.sort((person1, person2) => {
      let per1 = person1.children[e.target.cellIndex].textContent;
      let per2 = person2.children[e.target.cellIndex].textContent;

      if (header.getAttribute('Order') === 'dsc') {
        per1 = per2;
        per2 = person1.children[e.target.cellIndex].textContent;
      }

      if (e.target.cellIndex === 4) {
        per1 = +per1.slice(1).replaceAll(',', '');
        per2 = +per2.slice(1).replaceAll(',', '');

        return per1 - per2;
      };

      return per1.localeCompare(per2);
    });

    header.getAttribute('Order') === 'asc'
      ? header.setAttribute('Order', 'dsc')
      : header.setAttribute('Order', 'asc');

    tbody.append(...people);
  });
});

people.forEach(person => {
  person.addEventListener('click', (e) => {
    const copyPeople = [...people];

    copyPeople.splice(e.target.cellIndex, 0);
    copyPeople.forEach(employee => employee.classList.remove('active'));

    person.classList.add('active');
  });
});

document.body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form" action="/" method="GET">
    <label>
      Name: <input name="name" type="text"  data-qa="name">
    </label>

    <label>
      Position: <input name="position" type="text" data-qa="position">
    </label>

    <label>
      Office: <select name="office" data-qa="office">
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>

    <label>
      Age: <input name="age" data-qa="age" type="number">
    </label>

    <label>
      Salary: <input name="salary" type="number" data-qa="salary">
    </label>

    <button type="submit">Save to table</button>
  </form>
`);

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const salary = data.get('salary')
    .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const message = document.createElement('div');

  message.setAttribute('data-qa', 'notification');
  message.classList.add('notification');

  if (data.get('name').length < 4) {
    message.classList.add('error');

    message.insertAdjacentHTML('afterbegin', `
      <h2 class="title">INCORRECT NAME</h2>
      <span>
        Please type in correct name. Name should have at least 4 letters.
      </span>
    `);
  } else if (data.get('age') < 18 || data.get('age') > 90) {
    message.classList.add('error');

    message.insertAdjacentHTML('afterbegin', `
      <h2 class="title">INCORRECT AGE</h2>
      <span>
        Please type in correct age.
        Employee's age should be at least 18 and not more than 90.
      </span>
    `);
  } else if (data.get('position').length <= 5) {
    message.classList.add('error');

    message.insertAdjacentHTML('afterbegin', `
      <h2 class="title">INCORRECT POSITION</h2>
      <span>
        Please type in full name of your position.
      </span>
    `);
  } else {
    message.classList.add('success');

    message.insertAdjacentHTML('afterbegin', `
      <h2 class="title">SUCCESS</h2>
      <span>
        New employee was added!
      </span>
    `);

    tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${data.get('name')}</td>
      <td>${data.get('position')}</td>
      <td>${data.get('office')}</td>
      <td>${data.get('age')}</td>
      <td>$${salary}</td>
    </tr>
  `);

    people = [...tbody.children];

    form.reset();
  }

  document.body.append(message);

  setTimeout(() => {
    message.remove();
  }, 2000);
});

const cells = [...document.querySelectorAll('td')];

cells.forEach(cell => {
  const index = cells.indexOf(cell);

  cell.setAttribute('data-editing', 'yes');

  cell.addEventListener('dblclick', (e) => {
    const copyCells = [...cells];

    copyCells.splice(index, 1);
    copyCells.forEach(copyCell => copyCell.setAttribute('data-editing', 'no'));

    if (cell.getAttribute('data-editing') === 'yes') {
      const removedText = cell.textContent;

      cell.textContent = '';

      const input = document.createElement('input');

      input.value = removedText;
      input.type = 'text';
      input.classList.add('cell-input');

      cell.append(input);

      input.addEventListener('blur', () => {
        const savedText = input.value;

        input.remove();

        cell.textContent = savedText;

        cells.forEach(currentCell => currentCell
          .setAttribute('data-editing', 'yes'));
      });

      input.addEventListener('keypress', (ev) => {
        if (ev.key === 'Enter') {
          const savedText = input.value;

          input.remove();

          cell.textContent = savedText;

          cells.forEach(currentCell => currentCell
            .setAttribute('data-editing', 'yes'));
        }
      });
    };
  });
});

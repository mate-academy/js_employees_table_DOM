'use strict';

const head = document.querySelector('thead').querySelector('tr');
let nameSort = true;
let positionSort = true;
let officeSort = true;
let ageSort = true;
let salarySort = true;

head.addEventListener('click', (e) => {
  const body = document.querySelector('tbody');
  const sortedBody = [...body.querySelectorAll('tr')];
  const sortTarget = e.target.closest('th');

  if (sortTarget.textContent === 'Name' && nameSort) {
    sortedBody.sort((a, b) => {
      return a.children[0].textContent.localeCompare(b.children[0].textContent);
    });
    body.prepend(...sortedBody);
    nameSort = !nameSort;
  } else if (sortTarget.textContent === 'Name') {
    sortedBody.sort((a, b) => {
      return b.children[0].textContent.localeCompare(a.children[0].textContent);
    });
    body.prepend(...sortedBody);
    nameSort = !nameSort;
  }

  if (sortTarget.textContent === 'Position' && positionSort) {
    sortedBody.sort((a, b) => {
      return a.children[1].textContent.localeCompare(b.children[1].textContent);
    });
    body.prepend(...sortedBody);
    positionSort = !positionSort;
  } else if (sortTarget.textContent === 'Position') {
    sortedBody.sort((a, b) => {
      return b.children[1].textContent.localeCompare(a.children[1].textContent);
    });
    body.prepend(...sortedBody);
    positionSort = !positionSort;
  }

  if (sortTarget.textContent === 'Office' && officeSort) {
    sortedBody.sort((a, b) => {
      return a.children[2].textContent.localeCompare(b.children[2].textContent);
    });
    body.prepend(...sortedBody);
    officeSort = !officeSort;
  } else if (sortTarget.textContent === 'Office') {
    sortedBody.sort((a, b) => {
      return b.children[2].textContent.localeCompare(a.children[2].textContent);
    });
    body.prepend(...sortedBody);
    officeSort = !officeSort;
  }

  if (sortTarget.textContent === 'Age' && ageSort) {
    sortedBody.sort((a, b) => {
      return a.children[3].textContent - b.children[3].textContent;
    });
    body.prepend(...sortedBody);
    ageSort = !ageSort;
  } else if (sortTarget.textContent === 'Age') {
    sortedBody.sort((a, b) => {
      return b.children[3].textContent - a.children[3].textContent;
    });
    body.prepend(...sortedBody);
    ageSort = !ageSort;
  }

  if (sortTarget.textContent === 'Salary' && salarySort) {
    sortedBody.sort((a, b) => {
      const first = Number(a.children[4].textContent
        .slice(1).split(',').join(''));
      const second = Number(b.children[4].textContent
        .slice(1).split(',').join(''));

      return first - second;
    });
    body.prepend(...sortedBody);
    salarySort = !salarySort;
  } else if (sortTarget.textContent === 'Salary') {
    sortedBody.sort((a, b) => {
      const first = Number(a.children[4].textContent
        .slice(1).split(',').join(''));
      const second = Number(b.children[4].textContent
        .slice(1).split(',').join(''));

      return second - first;
    });
    body.prepend(...sortedBody);
    salarySort = !salarySort;
  }
});

const list = document.querySelector('tbody');
const table = document.querySelector('table');

table.insertAdjacentHTML('afterend', `
<form class="new-employee-form">
<label>Name: <input name="name" type="text" data-qa="name" required></label>
<label>Position: <input name="position" 
type="text" data-qa="position" required></label>
<label>Office: <select name="office" data-qa="office">
<option>Tokyo</option>
<option>Singapore</option>
<option>London</option>
<option>New York</option>
<option>Edinburgh</option>
<option>San Francisco</option>
</select>
</label>
<label>Age: <input name="age" type="number" data-qa="age" required></label>
<label>Salary: <input name="salary" 
type="number" data-qa="salary" required></label>
<button type="submit">Save to table</button>
</form>
`);

const form = document.querySelector('form');
const bodyNode = document.querySelector('body');

form.addEventListener('submit', (e) => {
  const data = new FormData(form);

  e.preventDefault();

  if (data.get('name').length < 4 || data.get('age') < 18
  || data.get('age') > 90) {
    bodyNode.insertAdjacentHTML('afterbegin', `
    <div class="notification error">
    <h2 class="title">Error!</h2>
    <p>Enter valid data, please</p>
  </div>
    `);

    setTimeout(() => {
      bodyNode.children[0].remove();
    }, 2000);
  } else {
    bodyNode.insertAdjacentHTML('afterbegin', `
    <div class="notification success">
    <h2 class="title">Success!</h2>
    <p>Congratulations, new employer has been added!</p>
  </div>
    `);

    setTimeout(() => {
      bodyNode.children[0].remove();
    }, 2000);

    list.insertAdjacentHTML('beforeend', `
  <tr>
    <td>${data.get('name')}</td>
    <td>${data.get('position')}</td>
    <td>${data.get('office')}</td>
    <td>${data.get('age')}</td>
    <td>$${data.get('salary').match(/.{1,3}/g).join(',')}</td>
  </tr>
  `);
    form.reset();
  }
});

const selectTr = document.querySelector('tbody');

selectTr.addEventListener('click', (e) => {
  if (document.querySelector('.active') !== null) {
    document.querySelector('.active').classList.remove('active');
  }

  e.target.closest('tr').classList.add('active');
});

selectTr.addEventListener('dblclick', (e) => {
  const td = e.target;
  const text = td.textContent;

  td.textContent = null;

  td.insertAdjacentHTML('afterbegin', `
  <input name="name" type="text" class="cell-input">
  `);

  td.querySelector('input').addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      td.textContent = (td.querySelector('input').value === '')
        ? text
        : td.querySelector('input').value;
    }
  });

  td.querySelector('input').addEventListener('blur', (ev) => {
    td.textContent = td.querySelector('input').value;
  });
});

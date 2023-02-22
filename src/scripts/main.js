'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
let buttonClick = null;

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>Name: 
    <input required name="name" type="text" data-qa="name">
  </label>
  <label>Position: 
    <input required name="position" type="text" data-qa="position">
  </label>
  <label>Office: 
    <select required data-qa="office">
      <option> Tokyo </option>
      <option> Singapore </option>
      <option> London </option>
      <option> New York </option>
      <option> Edinburgh </option>
      <option> San Francisco </option>
    </select>
  </label>
  <label>Age: 
    <input required name="age" type="number" data-qa="age">
  </label>
  <label>Salary: 
    <input required name="salary" type="number" data-qa="salary">
  </label>

  <button type='submit' class='js-button'>Save to table</button>
  `;
table.after(form);

table.addEventListener('click', sortPerson);
form.addEventListener('click', addPersonInTable);

function sortPerson(e) {
  if (e.target.closest('thead')) {
    sortTable(e, e.target);
    buttonClick = e.target.textContent;
  }

  if (e.target.closest('tbody')) {
    addActiveClass(e.target);
  }
}

function sortTable(el, tHeadElem) {
  const theadArray = [...tHeadElem.closest('tr').children];
  const index = theadArray.findIndex(td => {
    return td.textContent === tHeadElem.textContent;
  });

  const container = [...tbody.children];

  container.sort((a, b) => {
    let aSort = a.children[index].textContent;
    let bSort = b.children[index].textContent;
    const cSort = aSort;

    if (buttonClick === tHeadElem.textContent) {
      aSort = bSort;
      bSort = cSort;
    }

    if (index > 2) {
      aSort = +aSort.replace(',', '').replace('$', '');
      bSort = +bSort.replace(',', '').replace('$', '');

      return aSort - bSort;
    }

    return aSort.localeCompare(bSort);
  });

  container.forEach(person => tbody.append(person));
}

function addActiveClass(addClass) {
  [...tbody.children].forEach(elem => {
    if (elem.className.includes('active')) {
      elem.removeAttribute('class');
    }
  });

  addClass.closest('tr').className = 'active';
}

function addPersonInTable(elem) {
  elem.preventDefault();

  if (!elem.target.matches('.js-button')) {
    return;
  }

  const tr = document.createElement('tr');
  const [item, position, office, age, salary] = elem.currentTarget.children;

  if (
    !item.firstElementChild.value
    || !position.firstElementChild.value
    || !age.firstElementChild.value
    || !salary.firstElementChild.value
  ) {
    return;
  }

  tr.innerHTML = `
    <td>${item.firstElementChild.value}</td>
    <td>${position.firstElementChild.value}</td>
    <td>${office.firstElementChild.value}</td>
    <td>${age.firstElementChild.value}</td>
    <td>$${(+salary.firstElementChild.value).toLocaleString('en-US')}</td>
  `;

  tbody.append(tr);
}

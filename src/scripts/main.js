'use strict';

const panel = document.createElement('form');
const place = document.querySelector('body');

panel.className = 'new-employee-form';
panel.action = '#';
panel.method = 'post';

panel.innerHTML = `
  <label>Name: <input data-qa="name" name="name" type="text"></label>
  <label>Position: <input
    data-qa="position" name="position" type="text"></label>
  <label>Office: <select data-qa="office" name="office">
    <option>Tokyo</option>
    <option>Singapore</option>
    <option>London</option>
    <option>New York</option>
    <option>Edinburgh</option>
    <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input
    data-qa="age" name="age" type="number"></label>
  <label>Salary: <input data-qa="salary" name="salary" type="number"></label>
  <button type="submit">Save to table</button>
`;

place.append(panel);

function pushNotification(posTop, posRight, title, description, type = '') {
  const mesage = document.createElement('div');

  mesage.className = `notification ${type}`;
  mesage.dataset.qa = 'notification';
  mesage.style.top = `${posTop}px`;
  mesage.style.right = `${posRight}px`;

  mesage.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  place.append(mesage);

  setTimeout(() => {
    mesage.hidden = true;
  }, 2000);
}

function checkData(formData) {
  if (formData.name.length < 4) {
    pushNotification(500, 10, 'Error!',
      `Something went wrong!<br> `
      + `The name should contain at least 4 letters.!`, 'error');

    return false;
  }

  if (!formData.position) {
    pushNotification(500, 10, 'Error!',
      `Something went wrong!<br> `
      + `Position field cannot be empty!`, 'error');

    return false;
  }

  if (+formData.age < 18 || +formData.age > 90) {
    pushNotification(500, 10, 'Error!',
      `Something went wrong!<br> `
      + `Age must be more 18`, 'error');

    return false;
  }

  return true;
}

const listValue = document.querySelector('tbody');

panel.addEventListener('submit', e => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(panel).entries());

  const newRow = document.createElement('tr');

  const valueSalary = Number(data.salary).toLocaleString('en-US');

  newRow.innerHTML = `
    <td>${data.name}</td>
    <td>${data.position}</td>
    <td>${data.office}</td>
    <td>${data.age}</td>
    <td>${'$' + valueSalary}</td>
  `;

  if (checkData(data)) {
    pushNotification(500, 10, 'Success!',
      'Good!\n '
    + 'Employee has been added!', 'success');

    listValue.append(newRow);
    panel.reset();
  } else {
    checkData(data);
  }
});

function convertCurrencyToNumber(value) {
  return +value.slice(1).split(',').join('');
}

function sortList(list, index, sortMethod) {
  const result = [...list.children].sort((a, b) => {
    if (index === 4) {
      const valueA = convertCurrencyToNumber(a.children[index].innerText);
      const valueB = convertCurrencyToNumber(b.children[index].innerText);

      if (sortMethod === 'down') {
        return valueB - valueA;
      }

      return valueA - valueB;
    }

    const value1 = a.children[index].innerText;
    const value2 = b.children[index].innerText;

    if (sortMethod === 'down') {
      return value2.localeCompare(value1);
    }

    return value1.localeCompare(value2);
  });

  list.append(...result);
}

addEventListener('click', e => {
  const tableHeaders = document.querySelector('thead').children[0].children;
  const tableFooter = document.querySelector('tfoot');
  const i = [...tableHeaders].findIndex(
    element => element.innerText === e.target.innerText
    && !tableFooter.contains(e.target));

  let k;

  if (i === -1) {
    return;
  }

  for (const element of tableHeaders) {
    if (element.hasAttribute('data-status') && element !== tableHeaders[i]) {
      element.removeAttribute('data-status');
    }
  }

  if (tableHeaders[i].dataset.status === 'on') {
    tableHeaders[i].dataset.status = 'off';

    k = 'down';
  } else {
    tableHeaders[i].dataset.status = 'on';

    k = 'up';
  }

  const tableBody = document.querySelector('tbody');

  sortList(tableBody, i, k);
});

addEventListener('click', e => {
  const tableBody = document.querySelector('tbody');

  if (!tableBody.contains(e.target)) {
    return;
  };

  for (const element of tableBody.children) {
    if (element.classList.contains('active')) {
      element.classList.remove('active');
    }
  }

  e.target.parentElement.className = 'active';
});

let memory = null;

addEventListener('dblclick', e => {
  const tableBody = document.querySelector('tbody');

  if (!tableBody.contains(e.target)) {
    return;
  };

  if (document.querySelector('.cell-input')) {
    document.querySelector('.cell-input')
      .parentElement.innerText = memory.innerText;
  }

  const i = [...e.target.parentElement.children].findIndex(
    element => element === e.target);

  const plaseText = e.target;

  memory = e.target.cloneNode(true);

  plaseText.innerHTML = `<input
    class="cell-input" name="data" type="text" value="">`;

  if (i > 2) {
    plaseText.innerHTML = `<input
      class="cell-input" name="data" type="number" value="">`;
  }

  const input = document.querySelector('.cell-input');

  input.addEventListener('keypress', ev => {
    if (ev.key !== 'Enter') {
      return;
    };

    if (ev.target.value.length === 0) {
      plaseText.innerText = memory.innerText;
    }

    if (i === 0 && ev.target.value.length < 4) {
      input.reset();

      return;
    };

    if (i === 3
        && (Number(ev.target.value) < 18 || Number(ev.target.value) > 90)) {
      input.reset();

      return;
    };

    plaseText.innerText = ev.target.value;

    if (i === 4) {
      const valueSalary = Number(ev.target.value).toLocaleString('en-US');

      plaseText.innerText = `$${valueSalary}`;
    }
  });
});

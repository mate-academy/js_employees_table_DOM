'use strict';

const table = document.querySelector('table');
const headers = [...document.querySelectorAll('th')].slice(0, 5);

document.querySelector('table').addEventListener('click', ev => {
  if (headers.includes(ev.target)) {
    tableSorting(ev.target);
  } else {
    [...table.rows].slice(1, -1).forEach(element => {
      element.classList.remove('active');
    });

    ev.target.closest('tr').className = 'active';
  }
});

function tableSorting(header) {
  const index = header.cellIndex;
  let shift = 'happened';

  while (shift === 'happened') {
    shift = 'not happened';

    const list = [...document.querySelectorAll('tr')].slice(1, -1);

    for (let i = 0; i < list.length - 1; i++) {
      let a = list[i].cells[index].innerText;
      let b = list[i + 1].cells[index].innerText;

      if (header.innerText === 'Salary') {
        a = +a.replace(/,|\$/gi, '');
        b = +b.replace(/,|\$/gi, '');
      }

      if (((a > b)
        && (header.dataset.sortingOrder === 'descending'
        || header.dataset.sortingOrder === undefined))
      || ((a < b)
        && (header.dataset.sortingOrder === 'ascending'))) {
        list[i].parentNode.insertBefore(list[i + 1], list[i]);
        shift = 'happened';
      };
    }
  }

  if (header.dataset.sortingOrder === 'ascending') {
    header.dataset.sortingOrder = 'descending';
  } else {
    header.dataset.sortingOrder = 'ascending';
  }
}

const newForm = document.createElement('form');

newForm.className = 'new-employee-form';

newForm.innerHTML
  = `<label>Name: <input data-qa="name" name="name" type="text" required>
  </label>
  <label>Position: <input data-qa="position" name="position"
  type="text" required></label>
  <label>Office: 
  <select data-qa="office" name="office" id="cities" required>
  </select>
  </label>
  <label>Age: <input data-qa="age" name="age" type="number" required></label>
  <label>Salary: <input data-qa="salary" name="salary" type="number" required>
  </label>
  <button name="save_to_table">Save to table</button>`;

document.body.append(newForm);

const cities = ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh',
  'San Francisco'];
const select = document.querySelector('#cities');

for (let i = 0; i < cities.length; i++) {
  const option = document.createElement('option');

  option.value = option.innerText = cities[i];
  select.add(option);
}

const pushNotification = (posTop, posRight, title, description, type) => {
  const block = document.createElement('div');
  const text = document.createElement('p');
  const divTitle = document.createElement('h2');

  block.setAttribute('data-qa', 'notification');
  divTitle.className = 'title';
  divTitle.textContent = title;

  text.innerText = description;
  block.className = `notification ${type}`;
  block.style.top = `${posTop}px`;
  block.style.right = `${posRight}px`;
  block.append(divTitle);
  block.append(text);

  document.body.append(block);

  setTimeout(() => {
    block.remove();
  }, 2000);
};

document.body.querySelector('button').addEventListener('click', (evnt) => {
  evnt.preventDefault();

  const emplName = document.querySelector('[name = "name"]').value;
  const emplPosition = document.querySelector('[name = "position"]').value;
  const emplAge = document.querySelector('[name = "age"]').value;
  const emplOffice = document.querySelector('[name = "office"]').value;
  const newEmployee = document.createElement('tr');
  const emplMoney = '$' + Intl.NumberFormat('en-US')
    .format(document.querySelector('[name = "salary"]').value);

  if (!validateForm(emplName, emplPosition, emplAge)) {
    pushNotification(700, 10, 'Title of Error message',
      'Message example.\n '
        + 'Notification should contain title and description.', 'error');
  } else {
    newEmployee.innerHTML
      = `<td>${emplName}</td>
      <td>${emplPosition}</td>
      <td>${emplOffice}</td>
      <td>${emplAge}</td>
      <td>${emplMoney}</td>`;

    document.querySelector('table').lastElementChild
      .previousElementSibling.append(newEmployee);

    pushNotification(700, 10, 'Title of Succes message',
      'Message example.\n '
        + 'Notification should contain title and description.', 'success');
  }
});

function validateForm(name1, position, age) {
  // "name already declared in the upper scope", без понятия где,
  // но линтер не победить. По-этому пришлось name1 писать.
  if (name1.length < 4 || position.length < 4 || age < 18 || age > 90) {
    return false;
  } else {
    return true;
  }
}

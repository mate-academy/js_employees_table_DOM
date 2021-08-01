'use strict';

function salary(node) {
  return +node.cells[4].innerText.replace('$', '')
    .replace(/,/gi, '');
}

function sorting(action, header) {
  if (header.dataset.sortingOrder === 'descending'
    || header.dataset.sortingOrder === undefined) {
    let switching = 'happened';

    while (switching === 'happened') {
      switching = 'not happened';

      const list = Array.from(document
        .querySelectorAll('tr')).slice(1, -1);

      for (let i = 0; i < list.length - 1; i++) {
        if (action(list[i]) > action(list[i + 1])) {
          list[i].parentNode.insertBefore(list[i + 1], list[i]);
          switching = 'happened';
        };
      }
    }

    header.dataset.sortingOrder = 'ascending';
  } else {
    let switching = 'happened';

    while (switching === 'happened') {
      switching = 'not happened';

      const list = Array.from(document
        .querySelectorAll('tr')).slice(1, -1);

      for (let i = 0; i < list.length - 1; i++) {
        if (action(list[i]) < action(list[i + 1])) {
          list[i].parentNode.insertBefore(list[i + 1], list[i]);
          switching = 'happened';
        };
      }
    }

    header.dataset.sortingOrder = 'descending';
  }
}

const table = document.querySelector('table');

for (let i = 0; i < table.rows[0].cells.length; i++) {
  table.rows[0].cells[i].onclick = function() {
    const header = Array.from(document.querySelectorAll('th')).slice(0, 5)[i];

    if (this.cellIndex === 4) {
      sorting(salary, header);
    } else {
      sorting((node) => {
        return node.cells[this.cellIndex].innerText;
      }, header);
    };
  };
}

function ActiveRow() {
  [...table.rows].slice(1, -1).forEach((row) => {
    row.onclick = () => {
      [...table.rows].slice(1, -1).forEach(element => {
        element.classList.remove('active');
      });
      row.className = 'active';
    };
  });
}

ActiveRow();

function AddingEmployee() {
  const newForm = document.createElement('form');

  newForm.className = 'new-employee-form';

  newForm.innerHTML
  = `<label>Name: <input data-qa="name" name="name" type="text" required>
  </label>
  <label>Position: <input data-qa="position" name="position"
  type="text" required></label>
  <label>Office: 
  <select data-qa="office" name="office" id="pet-select" required>
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
  </select>
  </label>
  <label>Age: <input data-qa="age" name="age" type="number" required></label>
  <label>Salary: <input data-qa="salary" name="salary" type="number" required>
  </label>
  <button name="save_to_table">Save to table</button>`;

  document.body.append(newForm);

  document.body.querySelector('button').addEventListener('click', (evnt) => {
    evnt.preventDefault();

    const newEmployee = document.createElement('tr');
    const emplMoney = '$' + Intl.NumberFormat('en-US')
      .format(document.querySelector('[name = "salary"]').value);

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

      // setTimeout(() => {
      //   block.remove();
      // }, 2000);
    };

    if ((document.querySelector('[name = "name"]').value.length < 4)
    || (document.querySelector('[name = "position"]').value.length < 4)
    || (document.querySelector('[name = "age"]').value < 18)
    || (document.querySelector('[name = "age"]').value > 90)) {
      pushNotification(150, 10, 'Title of Error message',
        'Message example.\n '
        + 'Notification should contain title and description.', 'error');
    } else {
      newEmployee.innerHTML
      = `<td>${document.querySelector('[name = "name"]').value}</td>
      <td>${document.querySelector('[name = "position"]').value}</td>
      <td>${document.querySelector('[name = "office"]').value}</td>
      <td>${document.querySelector('[name = "age"]').value}</td>
      <td>${emplMoney}</td>`;

      document.querySelector('table').lastElementChild
        .previousElementSibling.append(newEmployee);

      pushNotification(150, 10, 'Title of Succes message',
        'Message example.\n '
        + 'Notification should contain title and description.', 'success');
    }
  });
}

AddingEmployee();

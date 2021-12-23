'use strict';

const table = document.querySelector('table');
const body = document.querySelector('body');

sortList();
highlight();
addForm();
replaceText();

function sortList() {
  let toggle = 1;

  table.addEventListener('click', (e) => {
    const item = e.target;

    if (!item.closest('thead')) {
      return;
    }

    sorted(item);
    toggle *= -1;

    function sorted(element) {
      const column = element.cellIndex;

      if (element.innerHTML.toLowerCase() !== 'salary'
        && element.innerHTML.toLowerCase() !== 'age') {
        const sortedRows = [...table.rows]
          .slice(1, table.rows.length - 1)
          .sort((rowA, rowB) => toggle * (rowA.cells[column]
            .innerHTML.localeCompare(rowB.cells[column]
              .innerHTML)));

        table.tBodies[0].append(...sortedRows);
      } else {
        const sortedRows = [...table.rows]
          .slice(1, table.rows.length - 1)
          .sort((rowA, rowB) => toggle * (+rowA.cells[column]
            .innerHTML.split('$').join('').split(',').join('')
            - (+rowB.cells[column]
              .innerHTML.split('$').join('').split(',').join(''))));

        table.tBodies[0].append(...sortedRows);
      }
    }
  });
}

function highlight() {
  let selectedTr;

  table.addEventListener('click', (e) => {
    const item = e.target.closest('tr');

    if (!item || !table.tBodies[0].contains(item)) {
      return;
    }

    highlightFunc(item);

    function highlightFunc(tr) {
      if (selectedTr) {
        selectedTr.classList.remove('active');
      }
      selectedTr = tr;
      selectedTr.classList.add('active');
    }
  });
}

function addForm() {
  const form = `<form class='new-employee-form'>
      <label>Name: <input
          name='name'
          type='text'
          data-qa='name'
          required
        ></label>
      <label>Position: <input
          name='position'
          type='text'
          data-qa='position'
          required
        ></label>
      <label>Office:
        <select
          name='office'
          type='select'
          data-qa='office'
          required
        >
          <option>Tokyo</option>
          <option>Singapore</option>
          <option>London</option>
          <option>New York</option>
          <option>Edinburgh</option>
          <option>San Francisco</option>
        </select>
      </label>
      <label>Age: <input
          name='age'
          type='number'
          data-qa='age'
          required
        ></label>
      <label>Salary: <input
          name='salary'
          type='number'
          data-qa='salary'
          required
        ></label>
      <button type='submit'>Save to table</button>
    </form>`;

  body.insertAdjacentHTML('beforeend', form);

  const formI = document.querySelector('.new-employee-form');

  formI.addEventListener('click', (e) => {
    const item = e.target.closest('[type = "submit"]');

    e.preventDefault();

    if (!item || !formI.contains(item)) {
      return;
    }

    const namePerson = document.querySelector('[name = "name"]').value;
    const positionPerson = document.querySelector('[name = "position"]').value;
    const officePerson = document.querySelector('[name = "office"]').value;
    const agePerson = document.querySelector('[name = "age"]').value;
    const salaryPerson = document.querySelector('[name = "salary"]').value;

    if (namePerson.length < 4 || agePerson < 18 || agePerson > 90
      || positionPerson.length < 2) {
      deleteNotification();

      pushNotification(150, 10, 'Error',
        'Please enter correct data', 'error');
    } else {
      table.insertAdjacentHTML('beforeend',
        `<tr>
      <td>${namePerson[0].toUpperCase() + namePerson.slice(1)}</td>
      <td>${positionPerson[0].toUpperCase() + positionPerson.slice(1)}</td>
      <td>${officePerson}</td>
      <td>${agePerson}</td>
      <td>$${parseInt(salaryPerson).toLocaleString('en-EN')}</td>
    </tr>`
      );
      deleteNotification();

      pushNotification(150, 10, 'Success',
        'The person was successfully added to the table', 'success');
    }
  });

  function deleteNotification() {
    const notifications = document.querySelectorAll('.notification');

    if (notifications.length > 0) {
      notifications[0].remove();
    }
  }
}

function pushNotification(posTop, posRight, title, description, type) {
  const titleMessage = document.createElement('h2');
  const descriptionText = document.createElement('p');
  const message = document.createElement('div');

  message.className = 'notification';
  message.classList.add(type);
  message.dataset.qa = 'notification';
  titleMessage.className = 'title';

  titleMessage.textContent = title;
  descriptionText.textContent = description;
  message.append(titleMessage);
  message.append(descriptionText);
  body.append(message);
  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;

  setTimeout(() => {
    message.remove();
  }, 2000);
};

function replaceText() {
  table.addEventListener('dblclick', (e) => {
    e.preventDefault();

    const item = e.target;

    if (item.tagName !== 'TD' || !table.contains(item)) {
      return;
    }

    editTd(item);
  });

  function editTd(td) {
    const tdText = td.textContent;

    if (td.cellIndex === 2) {
      const officePerson = document.querySelector('[name = "office"]');
      const select = officePerson.cloneNode(true);

      td.innerHTML = '';
      select.className = 'cell-input';
      td.append(select);
      select.focus();
      savedText(select);
    } else {
      const input = document.createElement('input');

      if (td.cellIndex === 3 || td.cellIndex === 4) {
        input.type = 'number';
      }
      input.className = 'cell-input';
      input.value = tdText;
      td.innerHTML = '';
      td.append(input);
      input.focus();
      savedText(input);
    }

    function savedText(tag) {
      tag.addEventListener('blur', () => {
        replaceValue(tag);
      });

      table.addEventListener('keypress', (e) => {
        if (e.code === 'Enter') {
          replaceValue(tag);
        }
      });
    }

    function replaceValue(tag) {
      if (tag.value.length === 0) {
        td.textContent = tdText;
      } else {
        if (td.cellIndex === 4) {
          td.textContent = `$${parseInt(tag.value).toLocaleString('en-EN')}`;
        } else {
          td.textContent = tag.value;
        }
      }
      tag.remove();
    }
  }
}

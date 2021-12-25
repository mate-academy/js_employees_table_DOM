'use strict';

const table = document.querySelector('table');
const body = document.querySelector('body');

const minNameChars = 4;
const minYear = 18;
const maxYear = 90;
const minPositionChars = 4;
const minSalary = 0;

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

  const formI = body.querySelector('.new-employee-form');

  formI.addEventListener('click', (e) => {
    deleteNotification();

    const item = e.target.closest('[type = "submit"]');

    e.preventDefault();

    if (!item || !formI.contains(item)) {
      return;
    }

    const namePerson = body.querySelector('[name = "name"]').value;
    const positionPerson = body.querySelector('[name = "position"]').value;
    const officePerson = body.querySelector('[name = "office"]').value;
    const agePerson = body.querySelector('[name = "age"]').value;
    const salaryPerson = body.querySelector('[name = "salary"]').value;

    switch (true) {
      case namePerson.length < minNameChars:

        pushNotification(150, 10, 'Error',
          `The name must contain at least ${minNameChars} letters`,
          'error');
        break;

      case positionPerson.length < minPositionChars:

        pushNotification(150, 10, 'Error',
          'The name of the position must be'
          + `contain at least ${minPositionChars} letters`,
          'error');
        break;

      case agePerson < minYear || agePerson > maxYear:

        pushNotification(150, 10, 'Error',
          `Age must be over ${maxYear} and no more than ${maxYear}`,
          'error');
        break;

      case salaryPerson < minSalary:

        pushNotification(150, 10, 'Error',
          `Salary cannot be less than ${minSalary}`,
          'error');
        break;

      default:
        table.insertAdjacentHTML('beforeend',
          `<tr>
      <td>${namePerson[0].toUpperCase() + namePerson.slice(1)}</td>
      <td>${positionPerson[0].toUpperCase() + positionPerson.slice(1)}</td>
      <td>${officePerson}</td>
      <td>${agePerson}</td>
      <td>$${parseInt(salaryPerson).toLocaleString('en-EN')}</td>
    </tr>`
        );

        pushNotification(150, 10, 'Success',
          'The person was successfully added to the table', 'success');
        break;
    }
  });
}

function deleteNotification() {
  const notifications = document.querySelectorAll('.notification');

  if (notifications.length > 0) {
    notifications[0].remove();
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

    const nameCell = td.cellIndex === 0;
    const positionCell = td.cellIndex === 1;
    const officeCell = td.cellIndex === 2;
    const ageCell = td.cellIndex === 3;
    const salaryCell = td.cellIndex === 4;

    if (officeCell) {
      const officePerson = body.querySelector('[name = "office"]');
      const select = officePerson.cloneNode(true);

      select.value = td.innerHTML;
      td.innerHTML = '';
      select.className = 'cell-input';
      td.append(select);

      select.focus();
      savedText(select);
    } else {
      const input = document.createElement('input');

      if (ageCell || salaryCell) {
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
        deleteNotification();
        replaceValue(tag);
      });

      table.addEventListener('keypress', (e) => {
        if (e.code === 'Enter') {
          deleteNotification();
          replaceValue(tag);
        }
      });
    }

    function replaceValue(tag) {
      const emptyValue = tag.value.length === 0;

      if (emptyValue) {
        td.textContent = tdText;

        pushNotification(150, 10, 'Error',
          'The cell must not be empty!!! '
          + 'The data are not changed!!!',
          'error');

        return;
      }

      switch (true) {
        case nameCell:
          if (tag.value.length < minNameChars) {
            td.textContent = tdText;

            pushNotification(150, 10, 'Error',
              `The name must contain at least ${minNameChars} letters`,
              'error');
          } else {
            pushNotification(150, 10, 'Success',
              'The person\'s age has been successfully changed', 'success');
            td.textContent = tag.value;
          }
          break;

        case positionCell:
          if (tag.value.length < minPositionChars) {
            td.textContent = tdText;

            pushNotification(150, 10, 'Error',
              'The name of the position must be'
              + `contain at least ${minPositionChars} letters`,
              'error');
          } else {
            pushNotification(150, 10, 'Success',
              'The person\'s position has been successfully changed',
              'success');
            td.textContent = `${tag.value}`;
          }
          break;

        case ageCell:
          if (tag.value < minYear || tag.value > maxYear) {
            td.textContent = tdText;

            pushNotification(150, 10, 'Error',
              `Age must be over ${minYear} and no more than ${maxYear}`,
              'error');
          } else {
            pushNotification(150, 10, 'Success',
              'the person\'s age has been successfully changed', 'success');
            td.textContent = `${tag.value}`;
          }
          break;

        case salaryCell:
          if (parseInt(tag.value) < minSalary) {
            td.textContent = tdText;

            pushNotification(150, 10, 'Error',
              `Salary cannot be less than ${minSalary}`,
              'error');
          } else {
            pushNotification(150, 10, 'Success',
              'a person\'s salary has been successfully changed', 'success');
            td.textContent = `$${parseInt(tag.value).toLocaleString('en-EN')}`;
          }
          break;

        case officeCell:
          pushNotification(150, 10, 'Success',
            'The person\'s offoce has been successfully changed',
            'success');
          td.textContent = `${tag.value}`;
          break;

        default:
          td.textContent = tag.value;
          break;
      }
      tag.remove();
    }
  }
}

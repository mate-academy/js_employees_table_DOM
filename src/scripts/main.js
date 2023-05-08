'use strict';

const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const tableRows = tableBody.querySelectorAll('tr');
const users = [];

tableHead.addEventListener('click', e => {
  const element = e.target;

  if (element.tagName === 'TH') {
    if (!element.getAttribute('data-sort')) {
      const dataSorts = document.querySelectorAll('[data-sort]');

      dataSorts.forEach(dataSort => {
        dataSort.removeAttribute('data-sort');
      });
    }

    if (element.getAttribute('data-sort') === 'ASC') {
      sortTable(users, element.innerText, 'DESC');
      createTable(users);
      element.setAttribute('data-sort', 'DESC');
    } else {
      sortTable(users, element.innerText, 'ASC');
      createTable(users);
      element.setAttribute('data-sort', 'ASC');
    }
  }
});

tableRows.forEach(tr => {
  users.push(
    {
      Name: tr.children[0].innerText,
      Position: tr.children[1].innerText,
      Office: tr.children[2].innerText,
      Age: Number(tr.children[3].innerText),
      Salary: Number(tr.children[4].innerText.replace(/[$,]/g, '')),
    }
  );
});

const sortTable = (table, value, order) => {
  switch (order) {
    case 'ASC': {
      table.sort((a, b) => {
        if (typeof a[value] === 'number') {
          return a[value] - b[value];
        } else if (typeof a[value] === 'string') {
          return a[value].localeCompare(b[value]);
        }

        throw new Error('wrong typeof value');
      });

      break;
    }

    case 'DESC': {
      table.sort((a, b) => {
        if (typeof a[value] === 'number') {
          return b[value] - a[value];
        } else if (typeof a[value] === 'string') {
          return b[value].localeCompare(a[value]);
        }

        throw new Error('wrong typeof value');
      });
      break;
    }

    default: {
      throw new Error('wrong order');
    }
  }
};

const createTable = (table) => {
  tableBody.innerHTML = '';

  table.forEach(element => {
    const tableElement = document.createElement('tr');
    const salary = element.Salary.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    tableElement.innerHTML = (
      `<td>${element.Name}</td>
      <td>${element.Position}</td>
      <td>${element.Office}</td>
      <td>${element.Age}</td>
      <td>${salary}</td>`
    );

    tableBody.appendChild(tableElement);
  });
};

tableRows.forEach(element => {
  element.addEventListener('click', () => {
    const actives = document.querySelectorAll('.active');

    actives.forEach(active => {
      active.classList.remove('active');
    });

    element.classList.toggle('active');
  });
});

const createForm = () => {
  const newForm = document.createElement('form');

  newForm.classList.add('new-employee-form');

  newForm.innerHTML = (
    `<label>
      Name:
      <input name="name" type="text" data-qa="name" required>
    </label>
    <label>
      Position:
      <input name="position" type="text" data-qa="position" required>
    </label>
    <label>
      Office:
      <select name='office' data-qa="office" required>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>
      Age:
      <input name="age" type="number" data-qa="age" required>
    </label>
    <label>
      Salary:
      <input name="salary" type="number" data-qa="salary" required>
    </label>
    <button type='button' class='add-to-table'>Save to table</button>`
  );

  document.body.appendChild(newForm);
};

createForm();

const addTableButton = document.querySelector('.add-to-table');
const addForm = document.querySelector('.new-employee-form');

addTableButton.addEventListener('click', () => {
  const formValues = {
    Name: addForm.querySelector('input[name="name"]').value,
    Position: addForm.querySelector('input[name="position"]').value,
    Office: addForm.querySelector('select[name="office"]').value,
    Age: Number(addForm.querySelector('input[name="age"]').value),
    Salary: Number(addForm.querySelector('input[name="salary"]').value),
  };

  if (formValues.Name.length < 4) {
    pushNotification(
      10,
      10,
      `Wrong name: ${formValues.Name}`,
      'Your name is to short',
      'error'
    );
  } else if (formValues.Age < 18 || formValues.Age > 90) {
    pushNotification(
      10,
      10,
      `Wrong Age: ${formValues.Age}`,
      'Your age should be between 18 - 90',
      'error'
    );
  } else if (Object.values(formValues).every(value => (
    String(value).length > 0
  ))) {
    users.push(formValues);
    createTable(users);

    pushNotification(
      10,
      10,
      `Success`,
      'New employee added to table',
      'success'
    );
  } else {
    pushNotification(10, 10, `Error`, 'all inputs must be filled', 'error');
  }
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.classList.add(`notification`);
  notification.classList.add(type);
  notification.setAttribute('data-qa', 'notification');

  notification.innerHTML = (
    `<h2 class='title'>${title}</h2>
    <p>${description}</p>`
  );

  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 2000);
};

let currentValue;

tableBody.addEventListener('dblclick', (clickEvent) => {
  const target = clickEvent.target;
  const tds = tableBody.querySelectorAll('td');

  tds.forEach(td => {
    if (td.innerHTML.includes('input')) {
      const input = td.querySelector('input');

      if (input.value) {
        td.innerHTML = input.value;
      } else {
        td.innerHTML = currentValue;
      }
    }
  });

  if (target.tagName === 'TD') {
    currentValue = target.innerText;
    target.innerHTML = '<input type="text">';
  }

  if (target.tagName === 'INPUT') {
    target.addEventListener('blur', () => {
      if (target.value.length <= 0) {
        target.parentElement.innerHTML = currentValue;
      } else {
        target.parentElement.innerHTML = target.value;
      }
    });

    target.addEventListener('keydown', (keyEvent) => {
      if (keyEvent.keyCode === 13) {
        if (target.value.length <= 0) {
          target.parentElement.innerHTML = currentValue;
        } else {
          target.parentElement.innerHTML = target.value;
        }
      }
    });
  }
});

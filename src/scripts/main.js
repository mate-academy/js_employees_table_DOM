'use strict';

const table = document.querySelector('table');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const rows = document.querySelectorAll('tr');
const rowsWithData = [];

[...rows].forEach(i => {
  if (tbody.contains(i)) {
    rowsWithData.push(i);
  }
});

table.addEventListener('click', (e) => {
  if (!thead.contains(e.target)) {
    return;
  };

  const element = e.target;
  const index = element.cellIndex;

  if (element.className === '') {
    element.className = 'ASC';
  }

  if (element.className === 'ASC') {
    element.className = 'DESC';

    const sortAscOrder = rowsWithData.sort((row1, row2) => {
      const cell1 = row1.children[index].textContent.replace(/[$,]/g, '');
      const cell2 = row2.children[index].textContent.replace(/[$,]/g, '');

      if (isNaN(cell1)) {
        return cell1.localeCompare(cell2);
      } else {
        return (cell1 - cell2);
      };
    });

    tbody.append(...sortAscOrder);
  } else {
    element.className = 'ASC';

    const sortDescOrder = rowsWithData.sort((row1, row2) => {
      const cell1 = row1.children[index].textContent.replace(/[$,]/g, '');
      const cell2 = row2.children[index].textContent.replace(/[$,]/g, '');

      if (isNaN(cell1)) {
        return cell2.localeCompare(cell1);
      } else {
        return (cell2 - cell1);
      };
    });

    tbody.append(...sortDescOrder);
  }
});

tbody.addEventListener('click', (e) => {
  const currentRow = e.target.closest('tr');
  const activeRow = document.querySelector('.active');

  if (activeRow && activeRow !== currentRow) {
    activeRow.classList.remove('active');
  };

  currentRow.classList.toggle('active');
});

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>
    Name:
    <input
      name="name"
      type="text"
      data-qa="name"
    >
  </label>

  <label>
    Position:
    <input
      name="position"
      type="text"
      data-qa="position"
    >
  </label>

  <label>
    Office:
    <select name="office" data-qa="office">
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
    <input
      name="age"
      type="number"
      data-qa="age"
    >
  </label>

  <label>
    Salary:
    <input
      name="salary"
      type="number"
      data-qa="salary"
    >
  </label>

  <button type="submit">Save to table</button>
`;

document.body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const dataObject = Object.fromEntries(data.entries());
  const salary = Number(dataObject.salary);
  const newEmployee = document.createElement('tr');

  if (dataObject.name.length < 4 || !isNaN(Number(dataObject.name))) {
    createNotification(
      'error',
      '&#9997; Please, write your name',
      'Name must be more than 4 letters'
    );

    return;
  }

  if (!isNaN(Number(dataObject.position)) || dataObject.position === '') {
    createNotification(
      'error',
      '&#10060; Position haven`t digit',
      'Position must contains only letters'
    );

    return;
  }

  if (dataObject.age < 18 || dataObject.age > 90) {
    createNotification(
      'error',
      '&#10084; Save your life!',
      'Age must be from 18 to 90'
    );

    return;
  }

  if (isNaN(Number(dataObject.salary)) || dataObject.salary <= 0) {
    createNotification(
      'error',
      '&#128184; Salary it isn`t number',
      'Salary must be counting'
    );

    return;
  }

  newEmployee.insertAdjacentHTML('afterbegin', `
    <td>${dataObject.name}</td>
    <td>${dataObject.position}</td>
    <td>${dataObject.office}</td>
    <td>${dataObject.age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `);

  tbody.append(newEmployee);

  createNotification(
    'success',
    '&#127881; Congratulation!',
    'New employee added'
  );

  [...form.children].forEach(label => {
    if (label.children.length && label.firstElementChild.tagName === 'INPUT') {
      label.firstElementChild.value = '';
    }
  });
});

function createNotification(type, result, message) {
  const notification = document.createElement('div');

  notification.className = type;
  notification.dataset.qa = 'notification';

  notification.insertAdjacentHTML('afterbegin', `
    <h3 style="margin: 10px">${result}</h3>
    <p style="margin: 4px">${message}</p>
  `);

  notification.style.position = 'fixed';
  notification.style.display = 'flex';
  notification.style.flexDirection = 'column';
  notification.style.justifyContent = 'center';
  notification.style.alignItems = 'center';
  notification.style.top = 10 + 'px';
  notification.style.background = '#FBEFF5';
  notification.style.borderRadius = '10px';
  notification.style.color = '#FF8000';

  document.body.append(notification);
  setTimeout(() => notification.remove(), 2000);
}

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target;
  const cellWidth = cell.offsetWidth;
  const cellText = cell.textContent;
  const index = e.target.cellIndex;
  const currentRow = e.target.closest('tr');

  currentRow.classList.add('active');

  const newInput = document.createElement('input');

  newInput.className = 'cell-input';
  newInput.name = 'cel-info';
  newInput.type = 'text';
  newInput.style.width = cellWidth + 'px';

  cell.textContent = '';
  cell.append(newInput);

  newInput.focus();

  newInput.addEventListener('keydown', (nextEvent) => {
    if (nextEvent.key === 'Enter' && index === 0
      && (newInput.value.length < 4 || !isNaN(Number(newInput.value)))) {
      createNotification(
        'error',
        '&#9997; Please, write your name',
        'Name must be more than 4 letters'
      );

      return;
    }

    if (nextEvent.key === 'Enter' && index === 1
    && (!isNaN(Number(newInput.value)))) {
      createNotification(
        'error',
        '&#10060; Position haven`t digit',
        'Position must contains only letters'
      );

      return;
    }

    const optionsFromSelect = [...document.querySelectorAll('option')]
      .map(option => option.value);

    if (nextEvent.key === 'Enter' && index === 2
    && !(optionsFromSelect.includes(newInput.value))) {
      createNotification(
        'error',
        '&#127970; Choose other city',
        'We don`t have office in this city'
      );

      return;
    }

    if (nextEvent.key === 'Enter' && index === 3 && isNaN(newInput.value)) {
      createNotification(
        'error',
        '&#9312; &#9313; &#9314; ...',
        'Age must be digit!');

      return;
    }

    if (nextEvent.key === 'Enter' && index === 3
    && (newInput.value < 18 || newInput.value > 90)) {
      createNotification(
        'error',
        '&#10084; Save your life!',
        'Age must be from 18 to 90'
      );

      return;
    }

    if (nextEvent.key === 'Enter' && index === 4
    && (isNaN(newInput.value) || newInput.value <= 0)) {
      createNotification('error', '&#128184;', 'Salary must be counting');

      return;
    }

    if (nextEvent.key === 'Enter') {
      if (newInput.value !== '') {
        if (index === 4) {
          cell.textContent = '$' + (+newInput.value).toLocaleString('en-US');
        } else {
          cell.textContent = newInput.value;
        }
      } else {
        cell.textContent = cellText;
      };
    }
  });

  newInput.addEventListener('blur', () => {
    currentRow.classList.remove('active');

    if (index === 0
      && (newInput.value.length < 4 || !isNaN(Number(newInput.value)))) {
      createNotification(
        'error',
        '&#9997; Please, write your name',
        'Name must be more than 4 letters'
      );

      cell.textContent = cellText;

      return;
    };

    if (index === 1 && (!isNaN(Number(newInput.value)))) {
      createNotification(
        'error',
        '&#10060; Position haven`t digit',
        'Position must contains only letters'
      );

      cell.textContent = cellText;

      return;
    }

    const optionsFromSelect = [...document.querySelectorAll('option')]
      .map(option => option.value);

    if (index === 2 && !(optionsFromSelect.includes(newInput.value))) {
      createNotification(
        'error',
        '&#127970; Choose other city',
        'We don`t have office in this city'
      );

      cell.textContent = cellText;

      return;
    }

    if (index === 3 && isNaN(newInput.value)) {
      createNotification(
        'error',
        '&#9312; &#9313; &#9314; ...',
        'Age must be digit!'
      );

      cell.textContent = cellText;

      return;
    }

    if (index === 3 && (newInput.value < 18 || newInput.value > 90)) {
      createNotification(
        'error',
        '&#10084; Save your life!',
        'Age must be from 18 to 90'
      );

      cell.textContent = cellText;

      return;
    }

    if (index === 4 && (isNaN(newInput.value) || newInput.value <= 0)) {
      createNotification('error', '&#128184;', 'Salary must be counting');

      cell.textContent = cellText;

      return;
    };

    if (index === 4 && newInput.value !== '') {
      cell.textContent = '$' + Number(newInput.value).toLocaleString('en-US');
    } else {
      cell.textContent = newInput.value;
    };
  });
});

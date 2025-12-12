'use strict';

const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');
const th = thead.querySelectorAll('th');

th.forEach((item, index) => {
  item.dataset.sortOrder = 'asc';

  item.addEventListener('click', () => {
    const tr = Array.from(tbody.querySelectorAll('tr'));

    tr.sort((rowA, rowB) => {
      const cellA = rowA.children[index].textContent.trim();
      const cellB = rowB.children[index].textContent.trim();

      if (index === 3) {
        if (item.dataset.sortOrder === 'asc') {
          return Number(cellA) - Number(cellB);
        } else {
          return Number(cellB) - Number(cellA);
        }
      }

      if (index === 4) {
        const numA = Number(cellA.replace(/,/g, '').replace('$', ''));
        const numB = Number(cellB.replace(/,/g, '').replace('$', ''));

        if (item.dataset.sortOrder === 'asc') {
          return numA - numB;
        } else {
          return numB - numA;
        }
      }

      if (item.dataset.sortOrder === 'asc') {
        return cellA.localeCompare(cellB);
      } else {
        return cellB.localeCompare(cellA);
      }
    });

    tr.forEach((row) => tbody.append(row));

    if (item.dataset.sortOrder === 'asc') {
      item.dataset.sortOrder = 'desc';
    } else {
      item.dataset.sortOrder = 'asc';
    }
  });
});

tbody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  const currentActive = tbody.querySelector('tr.active');

  if (currentActive) {
    currentActive.classList.remove('active');
  }

  clickedRow.classList.add('active');
});

const form = document.createElement('form');

form.classList = 'new-employee-form';

const fields = [
  {
    label: 'Name:',
    name: 'name',
    type: 'text',
    data: 'name',
  },
  {
    label: 'Position:',
    name: 'position',
    type: 'text',
    data: 'position',
  },
  {
    label: 'Office:',
    name: 'office',
    data: 'office',
  },
  {
    label: 'Age:',
    name: 'age',
    type: 'number',
    data: 'age',
  },
  {
    label: 'Salary:',
    name: 'salary',
    type: 'number',
    data: 'salary',
  },
];

fields.forEach((field, index) => {
  const label = document.createElement('label');

  label.textContent = field.label;

  if (index === 2) {
    const select = document.createElement('select');
    const cities = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    cities.forEach((city) => {
      const option = document.createElement('option');

      option.value = city;
      option.textContent = city;
      select.appendChild(option);
    });
    select.name = field.name;
    select.setAttribute('data-qa', field.data);
    label.appendChild(select);
    form.append(label);

    return;
  }

  const input = document.createElement('input');

  input.name = field.name;
  input.type = field.type;
  input.setAttribute('data-qa', field.data);

  label.appendChild(input);
  form.appendChild(label);
});

function showNotification(type, title, description) {
  const notification = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  notification.className = 'notification';
  notification.setAttribute('data-qa', 'notification');
  notification.classList.add(type);
  h2.className = 'title';
  h2.textContent = title;
  notification.appendChild(h2);
  p.textContent = description;
  notification.appendChild(p);
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 2000);
}

const button = document.createElement('button');

button.textContent = 'Save to table';
form.appendChild(button);

button.addEventListener('click', (e) => {
  e.preventDefault();

  const data = new FormData(form);

  if (data.get('position').length === 0) {
    showNotification('error', 'Error', 'Position cannot be empty');

    return;
  }

  if (data.get('name').length < 4) {
    showNotification('error', 'Error', 'Name has fewer than 4 letters');

    return;
  }

  if (data.get('age') < 18) {
    showNotification('error', 'Error', 'Age is less than 18');

    return;
  }

  if (data.get('age') > 90) {
    showNotification('error', 'Error', 'Age is more than 90');

    return;
  }

  const newTr = document.createElement('tr');

  fields.forEach((field, index) => {
    const td = document.createElement('td');
    let value = data.get(field.name);

    if (index === 4 && !isNaN(value)) {
      value = '$' + Number(value).toLocaleString('en-US');
    }

    td.textContent = value;
    newTr.appendChild(td);
  });

  tbody.prepend(newTr);
  showNotification('success', 'Success', 'The data entered is correct');
});

tbody.addEventListener('dblclick', (e) => {
  const dblclickedItem = e.target.closest('td');

  if (!dblclickedItem) {
    return;
  }

  const currentCellInput = tbody.querySelector('tbody.cell-input');

  if (currentCellInput) {
    const parentTd = currentCellInput.closest('td');

    parentTd.textContent = currentCellInput.value;

    currentCellInput.remove();
  }

  const cellInput = document.createElement('input');

  cellInput.value = dblclickedItem.textContent;
  dblclickedItem.textContent = '';
  cellInput.classList.add('cell-input');
  dblclickedItem.appendChild(cellInput);

  cellInput.focus();

  cellInput.addEventListener('blur', () => {
    if (cellInput.value.length === 0) {
      showNotification('error', 'Error', 'Input is empty');
    } else {
      dblclickedItem.textContent = cellInput.value;
      cellInput.remove();
    }
  });

  cellInput.addEventListener('keydown', (eKey) => {
    if (cellInput.value.length === 0) {
      showNotification('error', 'Error', 'Input is empty');
    } else {
      if (eKey.key === 'Enter') {
        dblclickedItem.textContent = cellInput.value;
        cellInput.remove();
      }
    }
  });
});

document.body.appendChild(form);

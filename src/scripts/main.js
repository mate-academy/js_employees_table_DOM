'use strict';

// write code here
const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');
let prevColumn;
let prevRow;
let prevOrder;
const inputs = ['name', 'position', 'office', 'age', 'salary'];
const officeOptions = [
  { value: 'Tokyo', text: 'Tokyo' },
  { value: 'Singapore', text: 'Singapore' },
  { value: 'London', text: 'London' },
  { value: 'New York', text: 'New York' },
  { value: 'Edinburgh', text: 'Edinburgh' },
  { value: 'San Francisco', text: 'San Francisco' },
];

const parseSalary = (srt) => {
  return +srt.split('').slice(1).join('').split(',').join('');
};

const toSalary = (salary) => {
  return (
    '$' +
    salary
      .toString()
      .split('')
      .reverse()
      .map((x, i) => {
        return i % 3 === 0 && i !== 0 ? x + ',' : x;
      })
      .reverse()
      .join('')
  );
};

const sortColumn = (column, order) => {
  const sorted = [...tbody.children].sort((tr1, tr2) => {
    let a = tr1.cells[column.cellIndex].innerText;
    let b = tr2.cells[column.cellIndex].innerText;

    if (column.innerText === 'Salary') {
      a = parseSalary(a);
      b = parseSalary(b);
    }

    if (column.innerText === 'Age') {
      a = +a;
      b = +b;
    }

    if (typeof a === 'number') {
      if (order === 'ASC') {
        return a - b;
      }

      if (order === 'DESC') {
        return b - a;
      }
    }

    if (order === 'ASC') {
      return a.localeCompare(b);
    }

    if (order === 'DESC') {
      return b.localeCompare(a);
    }
  });

  return sorted.forEach((tr) => tbody.appendChild(tr));
};

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (th === prevColumn && prevOrder === 'DESC') {
    sortColumn(th, 'ASC');
    prevOrder = 'ASC';
  } else if (th === prevColumn) {
    sortColumn(th, 'DESC');
    prevOrder = 'DESC';
  } else {
    sortColumn(th, 'ASC');
    prevOrder = 'ASC';
  }

  prevColumn = th;
});

tbody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  if (prevRow) {
    prevRow.className = '';
  }

  tr.className = 'active';
  prevRow = tr;
});

const form = document.createElement('form');
const button = document.createElement('button');

const showNotification = (text, type) => {
  const notification = document.createElement('div');
  const title = document.createElement('p');

  notification.setAttribute('data-qa', 'notification');
  notification.append(title);
  notification.classList.add('notification', type);
  title.textContent = text;
  title.classList.add('title');
  form.after(notification);
  setTimeout(() => notification.remove(), 2000);
};

inputs.forEach((el) => {
  const label = document.createElement('label');
  let element;

  if (el === 'office') {
    element = document.createElement('select');

    officeOptions.forEach((data) => {
      const option = document.createElement('option');

      option.value = data.value;
      option.textContent = data.text;
      element.appendChild(option);
    });
  } else {
    element = document.createElement('input');

    if (el === 'age' || el === 'salary') {
      element.type = 'number';
    } else {
      element.type = 'text';
    }
  }

  label.textContent = `${el[0].toUpperCase()}${el.slice(1)}:  `;
  label.appendChild(element);
  label.lastChild.setAttribute('name', el);
  // label.lastChild.setAttribute('required', '');
  label.lastChild.setAttribute('data-qa', el);

  form.append(label);
});

button.textContent = 'Save to table';
button.setAttribute('type', 'submit');
form.append(button);
form.className = 'new-employee-form';
form.setAttribute('method', 'post');
form.setAttribute('action', '/login');
table.after(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);

  if (
    data.get('name').length < 4 ||
    data.get('salary').length < 1 ||
    data.get('position').length < 4 ||
    data.get('age') < 18 ||
    data.get('age') > 90
  ) {
    showNotification('Error', 'error');
  } else {
    const tr = document.createElement('tr');

    inputs.forEach((element) => {
      const td = document.createElement('td');

      if (element === 'salary') {
        td.textContent = toSalary(data.get(element));
      } else {
        td.textContent = data.get(element);
      }

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
    form.reset();

    showNotification('Success', 'success');
  }
});

const editSell = (e) => {
  const td = e.target.closest('td');
  const input = document.createElement('input');
  const prevText = td.textContent;
  const addValueToCell = () => {
    if (input.value.length === 0) {
      td.textContent = prevText;
    } else {
      td.textContent = input.value;
    }

    input.remove();
  };

  td.textContent = '';
  input.classList.add('cell-input');
  td.append(input);

  input.addEventListener('blur', () => {
    addValueToCell();
  });

  input.addEventListener('keydown', (eventInput) => {
    if (eventInput.key === 'Enter') {
      addValueToCell();
    }
  });
};

tbody.addEventListener('dblclick', (e) => {
  editSell(e);
});

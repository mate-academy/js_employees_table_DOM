'use strict';

const table = document.querySelector('tbody');
const titles = document.querySelector('thead');

const form = document.createElement('form');
const formSubmit = document.createElement('button');

const inputs = ['Name', 'Position', 'Office', 'Age', 'Salary'];
const employees = [];

let currentOrder = 'asc';
let currentTitle = '';
let activeLine;
let editing;

const formatter = new Intl.NumberFormat('en-US');

Array.from(table.children).forEach((el) => {
  employees.push({
    Name: el.children[0].textContent,
    Position: el.children[1].textContent,
    Office: el.children[2].textContent,
    Age: el.children[3].textContent,
    Salary: el.children[4].textContent.replace(',', '').replace('$', ''),
  });
});

titles.addEventListener('click', (e) => {
  const sortValue = e.target.textContent;

  employees.sort((a, b) => sortTable(a, b, sortValue));

  if (currentTitle !== sortValue) {
    currentTitle = sortValue;
    currentOrder = 'asc';
  }

  if (currentTitle === sortValue && currentOrder === 'desc') {
    currentOrder = 'asc';
  } else if (currentTitle === sortValue && currentOrder === 'asc') {
    currentOrder = 'desc';
    employees.reverse();
  }

  render(table, employees);
});

table.addEventListener('click', (e) => {
  if (activeLine && activeLine !== e.target.parentNode) {
    activeLine.classList.remove('active');
  }

  activeLine = e.target.parentNode;
  activeLine.classList.add('active');
});

form.classList.add('new-employee-form');

inputs.forEach((input) => {
  if (input !== 'Office') {
    const inputType = input === 'Age' || input === 'Salary' ? 'number' : 'text';

    form.insertAdjacentHTML(
      'beforeend',
      `<label>
        ${input}:
        <input
          name="${input.toLowerCase()}"
          type="${inputType}"
          data-qa="${input.toLowerCase()}"
        >
      </label>`,
    );
  } else {
    const offices = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    const selection = offices.map(
      (office) => `<option name=${office}>${office}</option>`,
    );

    form.insertAdjacentHTML(
      'beforeend',
      `<label>
        ${input}:
        <select
          name="${input.toLowerCase()}"
          type="text"
          data-qa="${input.toLowerCase()}"
          required
        >
          ${selection}
        </select>
      </label>`,
    );
  }
});

formSubmit.textContent = 'Save to table';
form.append(formSubmit);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const notification = document.createElement('div');
  const notiTitle = document.createElement('h2');
  const notiDescription = document.createElement('p');

  notification.setAttribute('data-qa', 'notification');
  notification.className = 'notification';
  notification.append(notiTitle);
  notification.append(notiDescription);

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  const isError = dataCaution(data, notiDescription);

  if (!isError) {
    employees.push({
      Name: data['name'],
      Position: data['position'],
      Office: data['office'],
      Age: +data['age'],
      Salary: +data['salary'],
    });

    notification.classList.add('success');
    notiTitle.textContent = 'Success';
    notiDescription.text = 'Data successfully added';

    render(table, employees);
    e.target.reset();
  } else {
    notiTitle.textContent = 'Error';
    notification.classList.add('error');
  }
  document.body.append(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
});

document.body.append(form);

table.addEventListener('dblclick', (e) => {
  editing = e.target.textContent;

  e.target.innerHTML = `<input class="cell-input" value="${editing}">`;
  e.target.firstChild.focus();
});

document.addEventListener(
  'blur',
  (e) => {
    const target = e.target;

    if (target.classList.contains('cell-input')) {
      const newText = target.value;

      if (newText.trim() !== '') {
        target.parentNode.textContent = newText;
      } else {
        target.parentNode.textContent = editing;
      }
    }
  },
  true,
);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const target = e.target;

    if (target.classList.contains('cell-input')) {
      const newText = target.value;

      if (newText.trim() !== '') {
        target.parentNode.textContent = newText;
      } else {
        target.parentNode.textContent = editing;
      }
    }
  }
});

function sortTable(a, b, title) {
  const current = a[title];
  const next = b[title];

  if (title === 'Name' || title === 'Position' || title === 'Office') {
    return current.localeCompare(next);
  }

  return current - next;
}

function render(field, content) {
  field.innerHTML = '';

  content.forEach((employee) => {
    const row = document.createElement('tr');

    for (const [key, data] of Object.entries(employee)) {
      const column = document.createElement('td');

      column.textContent = data;

      if (key === 'Salary') {
        const salary = `$${formatter.format(data).toLocaleString()}`;

        column.textContent = salary;
      }

      row.append(column);
    }
    field.append(row);
  });
}

function dataCaution(data, text) {
  if (data['name'].trim().length < 4) {
    text.textContent = 'Please, enter a correct name';

    return true;
  }

  if (data['position'].trim() === '') {
    text.textContent = 'Position is required';

    return true;
  }

  if (data['age'] < 18 || data['age'] > 90) {
    text.textContent = 'Age must be between 18 and 90';

    return true;
  }

  if (data['salary'] <= '0' || data['salary'].trim() === '') {
    text.textContent = 'Salary required';

    return true;
  }
}

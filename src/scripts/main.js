'use strict';

// write code here
const thead = document.querySelectorAll('thead th');
const tbody = document.querySelector('tbody');

thead.forEach((header, index) => {
  header.addEventListener('click', () => {
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const isAscending = header.dataset.order === 'asc';
    const direction = isAscending ? -1 : 1;

    rows.sort((a, b) => {
      const cellA = a.children[index].textContent.trim();
      const cellB = b.children[index].textContent.trim();

      const parseValue = (val) => {
        const clean = val.replace(/[$,]/g, '');

        return isNaN(clean) ? val : parseFloat(clean);
      };

      const valA = parseValue(cellA);
      const valB = parseValue(cellB);

      let result;

      if (typeof valA === 'number' && typeof valB === 'number') {
        result = valA - valB;
      } else {
        result = valA.localeCompare(valB, 'en', { numeric: true });
      }

      return result * direction;
    });

    tbody.append(...rows);

    header.dataset.order = isAscending ? 'desc' : 'asc';

    thead.forEach((el) => {
      if (el !== header) {
        delete el.dataset.order;
      }
    });
  });
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const currentActive = tbody.querySelector('tr.active');

  if (currentActive) {
    currentActive.classList.remove('active');
  }

  row.classList.add('active');
});

// create form
const form = document.createElement('form');

form.classList.add('new-employee-form');

const fieldConfig = [
  {
    label: 'Name:',
    type: 'text',
    qa: 'name',
  },
  {
    label: 'Position:',
    type: 'text',
    qa: 'position',
  },
  {
    label: 'Office:',
    type: 'options',
    qa: 'office',
    options: [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
  },
  {
    label: 'Age:',
    type: 'number',
    qa: 'age',
  },
  {
    label: 'Salary:',
    type: 'number',
    qa: 'salary',
  },
];

fieldConfig.forEach((field) => {
  const wraper = document.createElement('div');
  const label = document.createElement('label');

  label.textContent = field.label;

  let element;

  if (field.type === 'options') {
    element = document.createElement('select');

    field.options.forEach((city) => {
      const option = document.createElement('option');

      option.value = city.toLowerCase();
      option.textContent = city;
      element.appendChild(option);
    });
  } else {
    element = document.createElement('input');
    element.type = field.type;
  }

  element.dataset.qa = field.qa;

  label.appendChild(element);
  wraper.appendChild(label);
  form.appendChild(wraper);
});

const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';

// add new employee
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameE = form.querySelector('[data-qa="name"]').value;
  const position = form.querySelector('[data-qa="position"]').value;
  const officeSelect = form.querySelector('[data-qa="office"]');
  const officeText = officeSelect.options[officeSelect.selectedIndex].text;
  const age = form.querySelector('[data-qa="age"]').value;
  const salary = form.querySelector('[data-qa="salary"]').value;
  const row = document.createElement('tr');

  if (nameE.trim().length < 4) {
    pushNatification(
      'error',
      'Invalid Name',
      'Name must be at least 4 characters long.',
    );

    return;
  }

  if (position.trim() === '') {
    pushNatification('error', 'Invalid Position', 'Position must requirad.');

    return;
  }

  if (!officeSelect.value || officeSelect.selectedIndex === -1) {
    pushNatification('error', 'Error', 'Please select an office.');

    return;
  }

  Number(age);

  if (age < 18 || age > 90) {
    pushNatification('error', 'Invalid Age', 'Age must be between 18 and 90.');

    return;
  }

  row.innerHTML = `
        <td>${nameE}</td>
        <td>${position}</td>
        <td>${officeText}</td>
        <td>${age}</td>
        <td>$${Number(salary).toLocaleString('en-US')}</td>
  `;

  tbody.appendChild(row);
  pushNatification('success', 'Success!', 'New employee has been added.');
  form.reset();
});

const pushNatification = (type, titleText, descText) => {
  const notification = document.createElement('div');
  const title = document.createElement('h2');
  const description = document.createElement('p');

  notification.dataset.qa = 'notification';

  notification.classList.add('notification', type);
  title.textContent = titleText;
  description.textContent = descText;

  notification.append(title, description);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 4000);
};

form.appendChild(button);

document.body.appendChild(form);

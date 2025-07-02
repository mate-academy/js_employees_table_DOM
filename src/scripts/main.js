'use strict';

window.addEventListener('DOMContentLoaded', () => {
  const headers = document.querySelectorAll('thead th');
  const tbody = document.querySelector('tbody');
  const table = document.getElementById('employee-table');

  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  const labelsName = ['name', 'position', 'office', 'age', 'salary'];
  const optionLabels = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  let selectedLine = null;
  let sortState = {};

  labelsName.forEach((label) => {
    const labelEl = document.createElement('label');

    labelEl.textContent = label[0].toUpperCase() + label.slice(1) + ': ';

    let input;

    if (label === 'office') {
      input = document.createElement('select');

      optionLabels.forEach((city) => {
        const option = document.createElement('option');

        option.value = option.textContent = city;
        input.appendChild(option);
      });
    } else {
      input = document.createElement('input');
      input.type = label === 'age' || label === 'salary' ? 'number' : 'text';
    }
    input.name = label;
    input.setAttribute('data-qa', label);
    labelEl.appendChild(input);
    form.appendChild(labelEl);
  });

  const submitBtn = document.createElement('button');

  submitBtn.type = 'submit';
  submitBtn.textContent = 'Save to table';
  form.appendChild(submitBtn);

  table.after(form);

  headers.forEach((th, i) => {
    th.addEventListener('click', () => {
      const key = labelsName[i];
      const d = sortState.key === key && sortState.d === 'asc' ? 'desc' : 'asc';

      sortState = { key, d };

      const rows = Array.from(tbody.querySelectorAll('tr'));

      rows.sort((a, b) => {
        let aVal = a.children[i].textContent.trim();

        let bVal = b.children[i].textContent.trim();

        if (key === 'salary') {
          aVal = aVal.replace(/[$,]/g, '');
          bVal = bVal.replace(/[$,]/g, '');
        }

        const isNumeric = !isNaN(parseFloat(aVal)) && !isNaN(parseFloat(bVal));

        if (isNumeric) {
          aVal = parseFloat(aVal);
          bVal = parseFloat(bVal);
        }

        if (aVal === bVal) {
          return 0;
        }

        return d === 'asc' ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
      });

      rows.forEach((row) => tbody.appendChild(row));
    });
  });

  tbody.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');

    if (!tr) {
      return;
    }

    if (selectedLine instanceof HTMLElement && selectedLine !== tr) {
      selectedLine.classList.remove('active');
    }

    tr.classList.add('active');
    selectedLine = tr;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form));

    data.age = parseInt(data.age);
    data.salary = parseFloat(data.salary);

    const errors = [];

    if (!data.name || data.name.length < 4) {
      errors.push('Name must be at least 4 letters');
    }

    if (!data.age || data.age < 18 || data.age > 90) {
      errors.push('Age must be between 18 and 90');
    }

    if (
      !data.position ||
      !data.office ||
      isNaN(data.salary) ||
      data.salary <= 0
    ) {
      errors.push('All fields must be filled correctly and salary must be >0');
    }

    showNotification(
      errors.length ? 'error' : 'success',
      errors.length ? 'Validation Error' : 'Success',
      errors.length ? errors.join(', ') : `${data.name} was added`,
    );

    if (!errors.length) {
      const tr = document.createElement('tr');

      labelsName.forEach((key) => {
        const td = document.createElement('td');

        if (key === 'salary') {
          td.textContent = `$${data[key].toLocaleString('en-US')}`;
        } else {
          td.textContent = data[key];
        }
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
      form.reset();
    }
  });

  function showNotification(type, title, message) {
    const notif = document.createElement('div');

    notif.className = type;
    notif.setAttribute('data-qa', 'notification');
    notif.innerHTML = `<strong>${title}</strong><p>${message}</p>`;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
  }
});

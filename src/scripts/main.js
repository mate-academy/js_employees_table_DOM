'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body');
  const table = document.querySelector('table');

  if (!table) {
    return;
  }

  const tbody = table.querySelector('tbody');
  const titles = table.querySelector('thead tr');
  const form = document.createElement('form');
  let lastColumn = null;
  let direction = 'asc';

  function toUsd(num) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  }

  function classAddActive(target) {
    const row = target.closest('tr');

    if (!row) {
      return;
    }

    [...tbody.querySelectorAll('tr')].forEach((tr) => {
      tr.classList.remove('active');
    });

    row.classList.add('active');
  }

  function converToNumber(str) {
    return Number(str.replace(/[^\d.-]/g, '').trim());
  }

  function sortColumn(columnIndex) {
    if (typeof columnIndex !== 'number') {
      return;
    }

    if (lastColumn === columnIndex) {
      direction = direction === 'asc' ? 'desc' : 'asc';
    } else {
      direction = 'asc';
    }
    lastColumn = columnIndex;

    const rows = [...tbody.querySelectorAll('tr')];

    rows.sort((tr1, tr2) => {
      if (columnIndex > 2) {
        const td1 = converToNumber(tr1.children[columnIndex].textContent);
        const td2 = converToNumber(tr2.children[columnIndex].textContent);

        return direction === 'asc' ? td1 - td2 : td2 - td1;
      }

      const clmn1 = tr1.children[columnIndex].textContent.trim();
      const clmn2 = tr2.children[columnIndex].textContent.trim();

      return direction === 'asc'
        ? clmn1.localeCompare(clmn2)
        : clmn2.localeCompare(clmn1);
    });

    rows.forEach((row) => tbody.append(row));
  }

  function notification(type) {
    const messages = {
      error: {
        title: 'Error!',
        text: 'Please enter a valid name and age!',
      },
      success: {
        title: 'Success!',
        text: 'Your data has been saved to the table!',
      },
      warning: {
        title: 'Warning!',
        text: 'This employee is already in the table!',
      },
    };

    const message = messages[type];

    if (!message) {
      return;
    }

    const div = document.createElement('div');

    div.classList.add('notification', type);
    div.setAttribute('data-qa', 'notification');

    div.innerHTML = `
    <h2 class="title">${message.title}</h2>
    <p>${message.text}</p>
  `;

    body.append(div);

    setTimeout(() => {
      div.remove();
    }, 3000);
  }

  function addForm() {
    form.classList.add('new-employee-form');
    form.name = 'new_employee';
    body.append(form);

    const button = document.createElement('button');

    button.type = 'submit';
    button.textContent = 'Save to table';

    const allowed = ['Name', 'Position', 'Office', 'Age', 'Salary'];
    const cities = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    allowed.forEach((row) => {
      const attribute = row.toLocaleLowerCase();
      const label = document.createElement('label');

      label.textContent = row;

      if (row === 'Office') {
        const select = document.createElement('select');

        select.name = attribute;
        select.setAttribute('data-qa', attribute);
        select.required = true;

        cities.forEach((city) => {
          const option = document.createElement('option');

          option.value = city;
          option.textContent = city;
          select.append(option);
        });

        select.selectedIndex = -1;
        label.append(select);
      } else {
        const input = document.createElement('input');

        input.name = attribute;
        input.type = row === 'Age' || row === 'Salary' ? 'number' : 'text';
        input.required = true;
        input.setAttribute('data-qa', attribute);

        label.append(input);
      }

      form.append(label);
    });

    form.append(button);
  }

  addForm();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = [...new FormData(form).values()];
    const tr = document.createElement('tr');
    const rows = [...tbody.querySelectorAll('tr')];
    const columnName = rows.map((row) => row.children[0].textContent);

    data.forEach((value, index) => {
      const clmn = document.createElement('td');

      clmn.textContent = value;

      if (index === 4) {
        clmn.textContent = toUsd(value);
      }
      tr.append(clmn);
    });

    if (data[0].length < 4 || data[3] < 18 || data[3] > 90) {
      return notification('error');
    }

    if (columnName.includes(data[0])) {
      return notification('warning');
    } else {
      tbody.append(tr);
      notification('success');
    }
  });

  titles.addEventListener('click', (e) => {
    sortColumn([...titles.children].indexOf(e.target));
  });

  tbody.addEventListener('click', (e) => {
    classAddActive(e.target);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  const fields = [
    { label: 'Name', type: 'text', qa: 'name' },
    { label: 'Position', type: 'text', qa: 'position' },
    {
      label: 'Office',
      type: 'select',
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
    { label: 'Age', type: 'number', qa: 'age' },
    { label: 'Salary', type: 'number', qa: 'salary' },
  ];

  fields.forEach((field) => {
    const label = document.createElement('label');

    label.textContent = `${field.label}: `;

    let input;

    if (field.type === 'select') {
      input = document.createElement('select');

      field.options.forEach((option) => {
        const opt = document.createElement('option');

        opt.value = option;
        opt.textContent = option;
        input.appendChild(opt);
      });
    } else {
      input = document.createElement('input');
      input.type = field.type;
    }

    input.name = field.qa;
    input.setAttribute('data-qa', field.qa);

    label.appendChild(input);
    form.appendChild(label);
  });

  const submitButton = document.createElement('button');

  submitButton.type = 'button';
  submitButton.textContent = 'Save to table';
  submitButton.setAttribute('data-qa', 'save');

  form.appendChild(submitButton);
  document.querySelector('table').insertAdjacentElement('afterend', form);

  const tbody = document.querySelector('tbody');

  const pushNotification = (title, description, type) => {
    const element = document.createElement('div');
    const h2Element = document.createElement('h2');
    const pElement = document.createElement('p');

    element.classList.add('notification', type);
    element.setAttribute('data-qa', 'notification');
    h2Element.classList.add('title');

    h2Element.textContent = title;
    pElement.textContent = description;

    element.appendChild(h2Element);
    element.appendChild(pElement);

    document.body.appendChild(element);

    setTimeout(() => {
      element.remove();
    }, 3000);
  };

  submitButton.addEventListener('click', () => {
    const employeeName = form.querySelector('[data-qa="name"]').value.trim();
    const position = form.querySelector('[data-qa="position"]').value.trim();
    const office = form.querySelector('[data-qa="office"]').value;
    const age = form.querySelector('[data-qa="age"]').value.trim();
    const salary = form.querySelector('[data-qa="salary"]').value.trim();

    if (employeeName.length < 4) {
      pushNotification(
        'Error',
        'Name must be at least 4 characters long.',
        'error',
      );

      return;
    }

    if (age < 18 || age > 90) {
      pushNotification('Error', 'Age must be between 18 and 90.', 'error');

      return;
    }

    if (!employeeName || !position || !office || !age || !salary) {
      pushNotification('Error', 'All fields are required.', 'error');

      return;
    }

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
          <td>${employeeName}</td>
          <td>${position}</td>
          <td>${office}</td>
          <td>${age}</td>
          <td>$${parseInt(salary).toLocaleString()}</td>
      `;

    tbody.appendChild(newRow);
    pushNotification('Success', 'New employee added to the table.', 'success');
    form.reset();
  });

  const theadElem = document.querySelector('thead');
  const thList = Array.from(theadElem.querySelectorAll('th'));
  let sortOrder = 'asc';
  let lastSortedColumnIndex = -1;

  const sortTable = (rows, column, isNumber = false, order = 'asc') => {
    return rows.sort((rowA, rowB) => {
      let cellA = rowA.cells[column].innerText.trim();
      let cellB = rowB.cells[column].innerText.trim();

      if (isNumber) {
        cellA = parseInt(cellA.replace(/[$,]/g, ''));
        cellB = parseInt(cellB.replace(/[$,]/g, ''));
      }

      if (order === 'asc') {
        return isNumber ? cellA - cellB : cellA.localeCompare(cellB);
      } else {
        return isNumber ? cellB - cellA : cellB.localeCompare(cellA);
      }
    });
  };

  thList.forEach((thElement, index) => {
    thElement.addEventListener('click', () => {
      const rows = Array.from(tbody.querySelectorAll('tr'));

      const isNumber = index === 3 || index === 4;
      let order = 'asc';

      if (lastSortedColumnIndex === index) {
        order = sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        lastSortedColumnIndex = index;
      }

      sortOrder = order;

      const sortedRows = sortTable(rows, index, isNumber, sortOrder);

      tbody.innerHTML = '';
      sortedRows.forEach((row) => tbody.appendChild(row));
    });
  });

  let activeRow = null;

  tbody.addEventListener('click', (ev) => {
    const targetRow = ev.target.closest('tr');

    if (!targetRow) {
      return;
    }

    if (activeRow) {
      activeRow.classList.remove('active');
    }

    if (activeRow !== targetRow) {
      targetRow.classList.add('active');
      activeRow = targetRow;
    } else {
      activeRow = null;
    }
  });
});

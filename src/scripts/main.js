'use strict';

const table = document.querySelector('table');
const tbody = table ? table.querySelector('tbody') : null;
const thead = table ? table.querySelector('thead') : null;

if (table && tbody && thead) {
  let currentSortColumn = -1;
  let isAscending = true;

  const parseCellValue = (text, columnIndex) => {
    if (columnIndex === 3) {
      return parseInt(text, 10) || 0;
    }

    if (columnIndex === 4) {
      return parseFloat(text.replace(/[^0-9.-]+/g, '')) || 0;
    }

    return text.toLowerCase();
  };

  thead.addEventListener('click', (e) => {
    const th = e.target.closest('th');

    if (!th) {
      return;
    }

    const columnIndex = Array.from(th.parentNode.children).indexOf(th);

    if (currentSortColumn === columnIndex) {
      isAscending = !isAscending;
    } else {
      currentSortColumn = columnIndex;
      isAscending = true;
    }

    const rowsArray = Array.from(tbody.rows);

    rowsArray.sort((rowA, rowB) => {
      const valA = parseCellValue(
        rowA.cells[columnIndex].textContent.trim(),
        columnIndex,
      );

      const valB = parseCellValue(
        rowB.cells[columnIndex].textContent.trim(),
        columnIndex,
      );

      if (valA < valB) {
        return isAscending ? -1 : 1;
      }

      if (valA > valB) {
        return isAscending ? 1 : -1;
      }

      return 0;
    });

    tbody.append(...rowsArray);
  });

  // single row selecting

  tbody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (!row || e.target.tagName === 'INPUT') {
      return;
    }

    const currentActive = tbody.querySelector('tr.active');

    if (currentActive && currentActive !== row) {
      currentActive.classList.remove('active');
    }
    row.classList.toggle('active');
  });

  // Notification

  const showNotification = (titleText, descriptionText, type) => {
    const existingNotif = document.querySelector('[data-qa="notification"]');

    if (existingNotif) {
      existingNotif.remove();
    }

    const notification = document.createElement('div');

    notification.className = `notification ${type}`;
    notification.setAttribute('data-qa', 'notification');

    const title = document.createElement('h4');

    title.className = 'notification-title';
    title.textContent = titleText;

    const description = document.createElement('p');

    description.className = 'notification-desc';
    description.textContent = descriptionText;

    notification.append(title, description);
    document.body.append(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 4000);
  };

  // form create & handling

  const createEmployeeForm = () => {
    const form = document.createElement('form');

    form.className = 'new-employee-form';

    const createInputField = (labelText, inputName, inputType, qaAttr) => {
      const label = document.createElement('label');

      label.textContent = labelText;

      const input = document.createElement('input');

      input.name = inputName;
      input.type = inputType;
      input.setAttribute('data-qa', qaAttr);

      label.append(input);

      return label;
    };

    const nameLabel = createInputField('Name: ', 'name', 'text', 'name');

    const positionLabel = createInputField(
      'Position: ',
      'position',
      'text',
      'position',
    );

    const officeLabel = document.createElement('label');

    officeLabel.textContent = 'Office: ';

    const select = document.createElement('select');

    select.name = 'office';
    select.setAttribute('data-qa', 'office');

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
      select.append(option);
    });

    officeLabel.append(select);

    const ageLabel = createInputField('Age: ', 'age', 'number', 'age');
    const salaryLabel = createInputField(
      'Salary: ',
      'salary',
      'number',
      'salary',
    );

    const submitBtn = document.createElement('button');

    submitBtn.type = 'submit';
    submitBtn.textContent = 'Save to table';

    form.append(
      nameLabel,
      positionLabel,
      officeLabel,
      ageLabel,
      salaryLabel,
      submitBtn,
    );

    // form sending

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const employeeName = formData.get('name').trim();
      const position = formData.get('position').trim();
      const office = formData.get('office');
      const ageStr = formData.get('age').trim();
      const salaryStr = formData.get('salary').trim();

      const age = parseInt(ageStr, 10);
      const salaryNum = parseFloat(salaryStr);

      // form fields validation

      if (!employeeName || !position || !office || !ageStr || !salaryStr) {
        showNotification(
          'Validation error',
          'All fields are required',
          'error',
        );

        return;
      }

      if (employeeName.length < 4) {
        showNotification(
          'Validation error',
          'Name must be at least 4 characters long',
          'error',
        );

        return;
      }

      if (isNaN(age) || age < 18 || age > 90) {
        showNotification(
          'Validation error',
          'Age must be a number between 18 and 90',
          'error',
        );

        return;
      }

      const formattedSalary = `$${salaryNum.toLocaleString('en-US')}`;

      const newRow = document.createElement('tr');
      const rowValues = [employeeName, position, office, age, formattedSalary];

      rowValues.forEach((value) => {
        const cell = document.createElement('td');

        cell.textContent = value;
        newRow.append(cell);
      });

      tbody.append(newRow);
      form.reset();

      showNotification(
        'Success',
        'New employee added successfully!',
        'success',
      );
    });

    table.after(form);
  };

  createEmployeeForm();

  // double click cell edition

  tbody.addEventListener('dblclick', (e) => {
    const cell = e.target.closest('td');

    if (!cell || cell.querySelector('input')) {
      return;
    }

    const activeInput = tbody.querySelector('.cell-input');

    if (activeInput) {
      activeInput.blur();
    }

    const initialText = cell.textContent.trim();

    cell.textContent = '';

    const input = document.createElement('input');

    input.type = 'text';
    input.className = 'cell-input';
    input.value = initialText;

    cell.append(input);
    input.focus();

    const saveChanges = () => {
      const newValue = input.value.trim();

      cell.textContent = newValue.length > 0 ? newValue : initialText;
    };

    input.addEventListener('blur', () => {
      saveChanges();
    });

    input.addEventListener('keydown', (evt) => {
      if (evt.key === 'Enter') {
        saveChanges();
      }
    });
  });
}

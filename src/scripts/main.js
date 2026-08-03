'use strict';

const sortState = {
  lastTarget: null,
  lastType: 'asc',
};

const activeState = {
  activeTarget: null,
};

const editState = {
  activeCell: null,
};

function employeesTable() {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const th = table.querySelector('thead').querySelectorAll('th');

  th.forEach((header) => {
    header.addEventListener('click', () => handleSort(header));
  });

  tbody.addEventListener('click', (evt) => {
    checkActiveStateInput(evt);
  });

  tbody.addEventListener('dblclick', (evt) => {
    handleCellEdit(evt);
  });

  addingNewEmployee();
}

const checkActiveStateInput = (evt) => {
  const targetRow = evt.target.closest('tr');

  if (!targetRow) {
    return;
  }

  if (activeState.activeTarget === targetRow) {
    targetRow.classList.remove('active');
    activeState.activeTarget = null;

    return;
  }

  if (activeState.activeTarget) {
    activeState.activeTarget.classList.remove('active');
  }

  targetRow.classList.add('active');
  activeState.activeTarget = targetRow;
};

const handleCellEdit = (evt) => {
  const cell = evt.target.closest('td');

  if (!cell) {
    return;
  }

  if (editState.activeCell) {
    return;
  }

  editState.activeCell = cell;

  const oldValue = cell.textContent;

  const input = document.createElement('input');

  input.type = 'text';
  input.value = oldValue;
  input.classList.add('cell-input');

  cell.textContent = '';
  cell.append(input);

  input.focus();

  const save = () => {
    const newValue = input.value.trim();

    cell.textContent = newValue || oldValue;

    editState.activeCell = null;
  };

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      input.blur();
    }
  });
};

const addingNewEmployee = () => {
  const form = document.createElement('form');

  form.action = '/';
  form.method = 'POST';
  form.dataset.qa = 'new-employee-form';
  form.classList.add('new-employee-form');

  form.innerHTML = `
      <label>Name:
        <input name="name" type="text" data-qa="name" />
      </label>
      <label>Position:
        <input name="position" type="text" data-qa="position" />
      </label>
      <label>Office:
        <select name="office" data-qa="office">
          <option value="Tokyo" selected>Tokyo</option>
          <option value="Singapore">Singapore</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="San Francisco">San Francisco</option>
        </select>
      </label>
      <label>Age:
        <input name="age" type="number" data-qa="age" />
      </label>
      <label>Salary:
        <input name="salary" type="number" data-qa="salary" />
      </label>
      <button type="submit">Save to table</button>
  `;

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    handleFormSubmit(form);
  });

  document.body.appendChild(form);

  return form;
};

const validateFormData = (data) => {
  if (!data.name) {
    return {
      valid: false,
      field: 'name',
      title: 'Error',
      message: 'Name is required.',
    };
  }

  if (!data.position) {
    return {
      valid: false,
      field: 'position',
      title: 'Error',
      message: 'Position is required.',
    };
  }

  if (data?.name.length < 4) {
    return {
      valid: false,
      title: 'Invalid Name',
      message: 'Name must have at least 4 letters.',
    };
  }

  if (!data.office) {
    return {
      valid: false,
      field: 'office',
      title: 'Error',
      message: 'Office is required.',
    };
  }

  if (isNaN(data.age)) {
    return {
      valid: false,
      field: 'age',
      title: 'Error',
      message: 'Age is required.',
    };
  }

  if (isNaN(data.salary)) {
    return {
      valid: false,
      field: 'salary',
      title: 'Error',
      message: 'Salary is required.',
    };
  }

  if (data?.age < 18 || data?.age > 90) {
    return {
      valid: false,
      title: 'Invalid Age',
      message: 'Age must be between 18 and 90.',
    };
  }

  return {
    valid: true,
  };
};

const handleFormSubmit = (form) => {
  const inputs = form.querySelectorAll('input, select');

  inputs.forEach((input) => {
    input.style.borderColor = '';
    input.style.outline = 'none';
  });

  const formData = {
    name: form?.name?.value.trim(),
    position: form?.position?.value.trim(),
    office: form?.office?.value,
    age: parseInt(form?.age?.value, 10),
    salary: parseInt(form?.salary?.value, 10),
  };

  const validation = validateFormData(formData);

  if (!validation.valid) {
    showNotification(
      10,
      10,
      validation.title,
      validation.message,
      'error',
      3000,
    );

    const invalidInput = form.querySelector(`[name="${validation.field}"]`);

    if (invalidInput) {
      invalidInput.style.borderColor = 'red';

      invalidInput.focus();
    }

    return;
  }

  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');

  const newRow = document.createElement('tr');

  const formattedSalary = `$${formData.salary.toLocaleString('en-US')}`;

  newRow.innerHTML = `
    <td>${formData.name}</td>
    <td>${formData.position}</td>
    <td>${formData.office}</td>
    <td>${formData.age}</td>
    <td>${formattedSalary}</td>
  `;

  tbody.appendChild(newRow);

  showNotification(
    10,
    10,
    'Success',
    'Employee added successfully.',
    'success',
    3000,
  );

  form.reset();
};

const getDataType = (value) => {
  if (/^\$[\d,]+/.test(value)) {
    return 'currency';
  }

  if (/^\d+$/.test(value)) {
    return 'number';
  }

  return 'text';
};

const getNumericValue = (value) => {
  return parseInt(value.replace(/[^\d]/g, ''));
};

const handleSort = (header) => {
  const { lastTarget, lastType } = sortState;
  const tbody = document.querySelector('tbody');
  const tr = Array.from(tbody.children);
  const currentIndex = Array.from(header.parentElement.children).indexOf(
    header,
  );

  if (lastTarget === header) {
    sortState.lastType = lastType === 'asc' ? 'desc' : 'asc';
  } else {
    sortState.lastType = 'asc';
  }

  sortState.lastTarget = header;

  tr.sort((left, right) => {
    const leftValue = left.children[currentIndex].textContent.trim();
    const rightValue = right.children[currentIndex].textContent.trim();
    const dataType = getDataType(leftValue);
    let temp = 0;

    if (dataType === 'number' || dataType === 'currency') {
      temp = getNumericValue(leftValue) - getNumericValue(rightValue);
    } else {
      temp = leftValue.localeCompare(rightValue);
    }

    return sortState.lastType === 'desc' ? -temp : temp;
  });

  tr.forEach((row) => tbody.appendChild(row));
};

const showNotification = (
  posTop,
  posRight,
  title,
  description,
  type = 'success',
  duration = 3000,
) => {
  const oldNotification = document.querySelector('[data-qa="notification"]');

  if (oldNotification) {
    oldNotification.remove();
  }

  const notification = document.createElement('div');

  notification.classList = `notification ${type}`;
  notification.dataset.qa = 'notification';
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  notification.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
  `;

  document.body.append(notification);

  if (duration > 0) {
    setTimeout(() => {
      notification.remove();
    }, duration);
  }
};

employeesTable();

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table tbody');

  const getCellValue = (row, index) => {
    if (row.children[index].innerText !== undefined) {
      return row.children[index].innerText;
    } else {
      return row.children[index].textContent;
    }
  };

  const sortFilter = (index, order) => (rowA, rowB) => {
    const valueA = getCellValue(rowA, index);
    const valueB = getCellValue(rowB, index);

    let numberA;
    let numberB;

    if (valueA.charCodeAt(0) === 36) {
      const arrA = Array.from(valueA);
      const arrB = Array.from(valueB);

      arrA.shift();
      arrB.shift();

      numberA = arrA.join('');
      numberB = arrB.join('');
    } else {
      numberA = valueA;
      numberB = valueB;
    }

    const numA = parseFloat(numberA);
    const numB = parseFloat(numberB);

    if (order === 'ASC') {
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }

      return valueA.localeCompare(valueB);
    } else {
      if (!isNaN(numA) && !isNaN(numB)) {
        return numB - numA;
      }

      return valueB.localeCompare(valueA);
    }
  };

  document.querySelectorAll('th').forEach((header, index) => {
    let sortOrder = null;

    header.addEventListener('click', () => {
      // const table = header.closest('table');
      const tbody = header.closest('table').querySelector('tbody');
      // const table = header.closest('table');
      // const tbody = table.querySelector('tbody');
      const rowsArr = Array.from(tbody.querySelectorAll('tr'));

      if (sortOrder === 'ASC') {
        sortOrder = 'DESC';
      } else {
        sortOrder = 'ASC';
      }

      rowsArr.sort(sortFilter(index, sortOrder));

      tbody.append(...rowsArr);
    });
  });

  document.querySelectorAll('tbody tr').forEach((row) => {
    row.addEventListener('click', () => {
      document.querySelectorAll('tbody tr').forEach((r) => {
        r.classList.remove('active');
        r.style.backgroundColor = '';
        r.style.color = '';
      });

      row.classList.add('active');
      row.style.backgroundColor = 'rgb(208, 208, 208)';
      row.style.color = 'black';
    });
  });

  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  const nameLabel = document.createElement('label');
  const nameInput = document.createElement('input');

  nameLabel.textContent = 'Name:';
  nameInput.type = 'text';
  nameInput.name = 'name';
  nameInput.dataset.qa = 'name';
  nameInput.required = true;
  nameInput.setAttribute('data-qa', 'name');
  nameLabel.appendChild(nameInput);

  const positionLabel = document.createElement('label');
  const positionInput = document.createElement('input');

  positionLabel.textContent = 'Position:';
  positionInput.type = 'text';
  positionInput.name = 'position';
  positionInput.dataset.qa = 'position';
  positionInput.required = true;
  positionInput.setAttribute('data-qa', 'position');
  positionLabel.appendChild(positionInput);

  const ageLabel = document.createElement('label');
  const ageInput = document.createElement('input');

  ageLabel.textContent = 'Age:';
  ageInput.type = 'number';
  ageInput.name = 'age';
  ageInput.dataset.qa = 'age';
  ageInput.required = true;
  ageInput.setAttribute('data-qa', 'age');
  ageLabel.appendChild(ageInput);

  const salaryLabel = document.createElement('label');
  const salaryInput = document.createElement('input');

  salaryLabel.textContent = 'Salary:';
  salaryInput.type = 'number';
  salaryInput.name = 'salary';
  salaryInput.dataset.qa = 'salary';
  salaryInput.required = true;
  salaryInput.setAttribute('data-qa', 'salary');
  salaryLabel.appendChild(salaryInput);

  const countryLabel = document.createElement('label');
  const countrySelect = document.createElement('select');

  countryLabel.textContent = 'Office:';
  countrySelect.name = 'office';
  countrySelect.dataset.qa = 'office';
  countrySelect.required = true;
  countrySelect.setAttribute('data-qa', 'office');

  const countries = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  countries.forEach((country) => {
    const option = document.createElement('option');

    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });

  countryLabel.appendChild(countrySelect);

  const submitButton = document.createElement('button');

  submitButton.type = 'button';
  submitButton.name = 'submit';
  submitButton.textContent = 'Save to table';

  form.appendChild(nameLabel);
  form.appendChild(positionLabel);
  form.appendChild(countryLabel);
  form.appendChild(ageLabel);
  form.appendChild(salaryLabel);
  form.appendChild(submitButton);

  document.body.appendChild(form);

  const notification = document.createElement('div');

  function showNotification(message, isSuccess) {
    clearNotifications();

    notification.id = 'notification';
    notification.setAttribute('data-qa', 'notification');
    notification.style.padding = '8px';
    form.appendChild(notification);

    notification.textContent = message;
    notification.className = isSuccess ? 'success' : 'error';
    notification.style.color = isSuccess ? 'green' : '#e25644';
    notification.style.display = 'block';
  }

  const clearNotifications = () => {
    notification.innerHTML = '';
  };

  function validateForm() {
    let valid = true;
    const nameVal = nameInput.value.trim();
    const ageVal = ageInput.value;
    const positVal = positionInput.value;

    if (nameVal.length < 4) {
      showNotification('Name must have at least 4 letters.', false);
      valid = false;
    }

    if (ageVal < 18 || ageVal > 90) {
      showNotification('Age must be between 18 and 90.', false);
      valid = false;
    }

    if (positVal < 1) {
      showNotification('Position cant` be empty', false);
      valid = false;
    }

    return valid;
  }

  submitButton.addEventListener('click', () => {
    if (validateForm()) {
      const newRow = table.insertRow(table.rows.length);
      const cell1 = newRow.insertCell(0);
      const cell2 = newRow.insertCell(1);
      const cell3 = newRow.insertCell(2);
      const cell4 = newRow.insertCell(3);
      const cell5 = newRow.insertCell(4);

      let salary = salaryInput.value;
      let finalSalary;

      if (salary < 1000) {
        salary = salary * 1000;
      }

      if (salary % 1000 === 0) {
        const thousands = salary / 1000;
        const arr = [thousands, '000'];

        finalSalary = '$' + arr.join(',');
      } else if (salary > 100) {
        const thousands = Math.floor(salary / 1000);
        const remainder = salary % 1000;
        const arr = [thousands, remainder.toString().padStart(3, '0')];

        finalSalary = '$' + arr.join(',');
      }

      cell1.textContent = nameInput.value;
      cell2.textContent = positionInput.value;
      cell3.textContent = countrySelect.value;
      cell4.textContent = ageInput.value;
      cell5.textContent = finalSalary;

      const employee = {
        name: nameInput.value,
        position: positionInput.value,
        country: countrySelect.value,
        age: ageInput.value,
        salary: finalSalary,
      };

      const id = `employee_${Date.now()}`;

      localStorage.setItem(id, JSON.stringify(employee));

      showNotification('New employee successfully added!', true);
      nameInput.value = '';
      positionInput.value = '';
      countrySelect.selectedIndex = 0;
      ageInput.value = '';
      salaryInput.value = '';
    }
  });

  let activeInput = null;

  table.addEventListener('dblclick', (even) => {
    const cell = even.target;

    if (cell.tagName !== 'TD' || activeInput) {
      return;
    }

    const initialText = cell.textContent;

    cell.textContent = '';

    const input = document.createElement('input');

    input.type = 'text';
    input.className = 'cell-input';
    input.value = initialText;
    cell.appendChild(input);
    input.focus();
    activeInput = input;

    const saveChanges = () => {
      const newText = input.value.trim() || initialText;

      cell.textContent = newText;
      activeInput = null;
    };

    input.addEventListener('blur', saveChanges);

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        saveChanges();
      }
    });
  });
});

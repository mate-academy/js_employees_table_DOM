'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const headers = table.querySelectorAll('thead th');
  const tbody = table.querySelector('tbody');

  let currentSortColumn = null;
  let sortDirection = 'asc';
  const numericColumnIndexes = [3, 4];

  headers.forEach((header) => {
    header.addEventListener('click', () => {
      const columnIndex = Array.from(headers).indexOf(header);

      if (currentSortColumn === columnIndex) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        sortDirection = 'asc';
        currentSortColumn = columnIndex;
      }

      const rows = Array.from(tbody.querySelectorAll('tr'));
      const isColumnNumeric = numericColumnIndexes.includes(columnIndex);

      rows.sort((rowA, rowB) => {
        const cellA = rowA.children[columnIndex].textContent.trim();
        const cellB = rowB.children[columnIndex].textContent.trim();

        let comparison = 0;

        if (isColumnNumeric) {
          const numA = parseFloat(cellA.replace(/[^0-9.-]/g, '')) || 0;
          const numB = parseFloat(cellB.replace(/[^0-9.-]/g, '')) || 0;

          comparison = numA - numB;
        } else {
          comparison = cellA.localeCompare(cellB);
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });

      while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
      }
      rows.forEach((row) => tbody.appendChild(row));

      headers.forEach((h) => h.classList.remove('asc', 'desc'));
      header.classList.add(sortDirection);
    });

    const allRow = table.querySelectorAll('tbody tr');

    allRow.forEach((row) => {
      row.addEventListener('click', () => {
        allRow.forEach((r) => r.classList.remove('active'));
        row.classList.add('active');
      });
    });
  });

  const body = document.querySelector('body');
  const form = document.createElement('form');

  form.classList.add('new-employee-form');
  form.action = '#';
  form.method = 'POST';

  let currentNotificationTop = 10;
  const notificationGap = 10;

  const createAndShowNotification = (title, description, type) => {
    const notificationElement = document.createElement('div');
    const notificationTitle = document.createElement('h2');
    const notificationText = document.createElement('p');

    notificationElement.className = 'notification';
    notificationElement.classList.add(type);
    notificationElement.setAttribute('data-qa', 'notification');

    notificationTitle.className = 'title';
    notificationTitle.innerText = title;

    notificationText.innerHTML = description;

    notificationElement.append(notificationTitle);
    notificationElement.append(notificationText);

    notificationElement.style.top = currentNotificationTop + 'px';
    notificationElement.style.right = '10px';
    notificationElement.style.position = 'absolute';

    document.body.appendChild(notificationElement);

    const notificationHeight = notificationElement.offsetHeight;

    currentNotificationTop += notificationHeight + notificationGap;

    setTimeout(() => {
      notificationElement.remove();
    }, 4500);
  };

  function createFormGroup(
    labelText,
    inputType,
    inputName,
    qaAttribute,
    options = [],
  ) {
    const label = document.createElement('label');

    label.textContent = labelText;

    let inputElement;

    if (inputType === 'select') {
      inputElement = document.createElement('select');

      options.forEach((optionText) => {
        const option = document.createElement('option');

        option.value = optionText;
        option.textContent = optionText;
        inputElement.appendChild(option);
      });
    } else {
      inputElement = document.createElement('input');
      inputElement.type = inputType;
    }

    inputElement.id = inputName;
    inputElement.name = inputName;
    inputElement.setAttribute('data-qa', qaAttribute);
    label.appendChild(inputElement);

    const formGroup = document.createElement('div');

    formGroup.classList.add('form-group');
    formGroup.appendChild(label);

    return formGroup;
  }

  function capitalizeEachWord(string) {
    if (typeof string !== 'string' || string.length === 0) {
      return string;
    }

    return string
      .split(' ')
      .map((word) => {
        if (word.length === 0) {
          return '';
        }

        if (word === word.toUpperCase() && word.length > 1) {
          return word;
        }

        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }

  form.appendChild(createFormGroup('Name:', 'text', 'employeeName', 'name'));

  form.appendChild(
    createFormGroup('Position:', 'text', 'employeePosition', 'position'),
  );

  form.appendChild(
    createFormGroup('Office:', 'select', 'employeeOffice', 'office', [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ]),
  );
  form.appendChild(createFormGroup('Age:', 'number', 'employeeAge', 'age'));

  form.appendChild(
    createFormGroup('Salary:', 'number', 'employeeSalary', 'salary'),
  );

  const submitButton = document.createElement('button');

  submitButton.type = 'submit';
  submitButton.textContent = 'Save to table';
  form.appendChild(submitButton);

  body.appendChild(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      name: form.elements.employeeName.value,
      position: form.elements.employeePosition.value,
      office: form.elements.employeeOffice.value,
      age: form.elements.employeeAge.value,
      salary: form.elements.employeeSalary.value,
    };

    let hasValidation = false;

    if (formData.name.length < 4) {
      hasValidation = true;

      createAndShowNotification(
        'Name input error',
        'Name must contain at least 4 letters.',
        'error',
      );
    }

    if (isNaN(formData.age) || formData.age < 18 || formData.age > 90) {
      hasValidation = true;

      createAndShowNotification(
        'Age input error',
        'Age must be between 18 and 90 years old.',
        'error',
      );
    }

    if (formData.position.trim().length === 0) {
      hasValidation = true;

      createAndShowNotification(
        'Position input error',
        'Position field cannot be empty.',
        'error',
      );
    }

    const invalidCharsRegex = /[^a-zA-Zа-яА-ЯіІїЇєЄґҐ\s'-_0-9]/;

    if (invalidCharsRegex.test(formData.name)) {
      hasValidation = true;

      createAndShowNotification(
        'Invalid characters in name',
        'The name contains invalid characters.',
        'warning',
      );
    }

    if (invalidCharsRegex.test(formData.position)) {
      hasValidation = true;

      createAndShowNotification(
        'Invalid characters in job title',
        'The job title contains invalid characters.',
        'warning',
      );
    }

    if (hasValidation) {
      currentNotificationTop = 10;

      return;
    }

    if (tbody) {
      const newRow = document.createElement('tr');

      for (const key in formData) {
        const cell = document.createElement('td');

        if (key === 'salary') {
          const salaryValue = parseFloat(formData[key]);

          if (!isNaN(salaryValue)) {
            cell.textContent = '$' + salaryValue.toLocaleString('en-US');
          } else {
            cell.textContent = '$0';
          }
        } else {
          if (key === 'name' || key === 'position' || key === 'office') {
            cell.textContent = capitalizeEachWord(formData[key]);
          } else {
            cell.textContent = formData[key];
          }
        }
        newRow.appendChild(cell);
      }
      tbody.appendChild(newRow);

      if (tbody) {
        createAndShowNotification(
          'Success!',
          'Employee successfully added to the table.',
          'success',
        );
      }
      form.reset();
    }
  });
});

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const tableContainer = document.querySelector('body');
  const formContainer = document.createElement('div');

  formContainer.classList.add('new-employee-form-container');

  // Создание формы
  const form = document.createElement('form');

  form.classList.add('new-employee-form');
  form.id = 'newEmployeeForm';

  // Создание полей формы
  const fields = [
    {
      label: 'Name',
      id: 'name',
      type: 'text',
      required: true,
      dataQa: 'name',
      minLength: 4,
    },
    {
      label: 'Position',
      id: 'position',
      type: 'text',
      dataQa: 'position',
      minLength: 4,
    },
    {
      label: 'Office',
      id: 'office',
      type: 'select',
      required: true,
      dataQa: 'office',
    },
    {
      label: 'Age',
      id: 'age',
      type: 'number',
      required: true,
      dataQa: 'age',
    },
    {
      label: 'Salary',
      id: 'salary',
      type: 'number',
      dataQa: 'salary',
    },
  ];

  // Заполнение полей формы
  fields.forEach((field) => {
    const label = document.createElement('label');

    label.setAttribute('for', field.id);
    label.textContent = `${field.label}:`;

    let input;

    if (field.type === 'select') {
      input = document.createElement('select');
      input.setAttribute('id', field.id);
      input.setAttribute('name', field.id);
      input.setAttribute('required', field.required);
      input.setAttribute('data-qa', field.dataQa);

      const options = [
        'Tokyo',
        'Singapore',
        'London',
        'New York',
        'Edinburgh',
        'San Francisco',
      ];

      options.forEach((optionText) => {
        const option = document.createElement('option');

        option.value = optionText;
        option.textContent = optionText;
        input.appendChild(option);
      });
    } else {
      input = document.createElement('input');
      input.setAttribute('type', field.type);
      input.setAttribute('id', field.id);
      input.setAttribute('name', field.id);
      input.setAttribute('data-qa', field.dataQa);
    }

    label.appendChild(input);
    form.appendChild(label);
  });

  // Кнопка для отправки формы
  const submitButton = document.createElement('button');

  submitButton.type = 'submit';
  submitButton.textContent = 'Save to table';
  form.appendChild(submitButton);

  // Добавляем форму в контейнер
  formContainer.appendChild(form);
  tableContainer.appendChild(formContainer);

  // Обработчик события для добавления нового сотрудника
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Получаем данные из формы
    const nam = document.getElementById('name').value.trim();
    const position = document.getElementById('position').value.trim();
    const office = document.getElementById('office').value;
    const age = parseInt(document.getElementById('age').value);
    const salary = parseInt(document.getElementById('salary').value);

    // Валидация данных
    let isValid = true;

    clearNotifications(); // Очистка предыдущих уведомлений

    if (nam.length < 4) {
      showNotification('error', 'Name must have at least 4 characters.');
      isValid = false;
    }

    if (!/^[a-zA-Zа-яА-ЯёЁ]+$/.test(nam)) {
      showNotification('error', 'Name must contain only letters.');
      isValid = false;
    }

    if (position === '' || position.length < 4) {
      showNotification('error', 'Position must have at least 4 characters.');
      isValid = false;
    }

    if (isNaN(age)) {
      showNotification('Age is not a valid number');
      isValid = false;
      // здесь можно отобразить уведомление об ошибке
    } else if (age < 18 || age > 90) {
      showNotification('Age must be between 18 and 90');
      isValid = false;
      // здесь можно отобразить уведомление об ошибке
    } else {
      showNotification('Age is valid:', age);
      // дальнейшие действия с корректным значением возраста
    }

    if (isNaN(salary)) {
      showNotification('error', 'Salary must be a number.');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    // Создаем строку таблицы для нового сотрудника
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${nam}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${salary.toLocaleString()}</td>
    `;

    // Добавляем строку в таблицу
    document.querySelector('tbody').appendChild(row);

    // Очищаем форму после добавления сотрудника
    document.getElementById('newEmployeeForm').reset();
    showNotification('success', 'New employee added successfully');
  });

  // Функция для показа уведомлений
  function showNotification(type, message) {
    const notification = document.createElement('div');

    notification.classList.add(type === 'success' ? 'success' : 'error');
    notification.setAttribute('data-qa', 'notification');
    notification.textContent = message;
    document.body.prepend(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  // Функция для очистки уведомлений
  function clearNotifications() {
    const notifications = document.querySelectorAll('[data-qa="notification"]');

    notifications.forEach((notification) => notification.remove());
  }

  // Сортировка таблицы при клике на заголовки
  const table = document.querySelector('table');
  const headers = table.querySelectorAll('thead th');
  let sortOrder = 'asc';

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      sortTable(index);
    });
  });

  function sortTable(columnIndex) {
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const column = headers[columnIndex].textContent.trim().toLowerCase();
    const isSalaryColumn = column === 'salary';

    rows.sort((rowA, rowB) => {
      let cellA = rowA.cells[columnIndex].textContent;
      let cellB = rowB.cells[columnIndex].textContent;

      if (isSalaryColumn) {
        cellA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
        cellB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));
      }

      const direction = sortOrder === 'asc' ? 1 : -1;

      return (cellA > cellB ? 1 : -1) * direction;
    });

    rows.forEach((row) => {
      table.querySelector('tbody').appendChild(row);
    });

    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  }

  // Добавление класса 'active' при клике на строку
  table.addEventListener('click', (ev) => {
    if (ev.target.tagName === 'TD') {
      const rows = table.querySelectorAll('tbody tr');

      rows.forEach((row) => row.classList.remove('active'));

      const clickedRow = ev.target.closest('tr');

      clickedRow.classList.add('active');
    }
  });
});

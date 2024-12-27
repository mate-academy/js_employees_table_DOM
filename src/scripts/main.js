'use strict';

const thead = document.querySelectorAll('thead tr th');
const tbody = document.querySelector('tbody');
let tbodyArray = Array.from(tbody.querySelectorAll('tr'));
const sortStates = [];
const buttonSubmit = document.querySelector('button');
const inputName = document.querySelector('[data-qa="name"]');
const inputPosition = document.querySelector('[data-qa="position"]');
const inputOffice = document.querySelector('[data-qa="office"]');
const inputAge = document.querySelector('[data-qa="age"]');
const inputSalary = document.querySelector('[data-qa="salary"]');

thead.forEach((item) => {
  sortStates[item] = 'asc';

  item.addEventListener('click', (e) => {
    const columnIndex = [...thead].indexOf(e.target);

    sortStates[columnIndex] =
      sortStates[columnIndex] === 'asc' ? 'desc' : 'asc';

    tbodyArray.sort((a, b) => {
      const valueA = a.cells[columnIndex].textContent.trim();
      const valueB = b.cells[columnIndex].textContent.trim();

      // Check if the value is a number
      const numA = parseFloat(valueA.replace(/[^0-9.-]+/g, '')) || valueA;
      const numB = parseFloat(valueB.replace(/[^0-9.-]+/g, '')) || valueB;

      // Sort the values
      if (sortStates[columnIndex] === 'asc') {
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }

        return numA.localeCompare(numB);
      }

      if (sortStates[columnIndex] === 'desc') {
        if (!isNaN(numB) && !isNaN(numA)) {
          return numB - numA;
        }

        return numB.localeCompare(numA);
      }
    });

    tbody.innerHTML = '';
    tbody.append(...tbodyArray);
  });
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr'); // Знаходимо найближчий рядок

  if (!row) {
    return;
  } // Якщо не клікнули на рядок, нічого не робимо

  // eslint-disable-next-line max-len
  tbodyArray.forEach((r) => r.classList.remove('active')); // Знімаємо клас active з усіх рядків

  row.classList.add('active'); // Додаємо клас active на поточний рядок
});

buttonSubmit.addEventListener('click', (e) => {
  e.preventDefault();

  const employeeName = inputName.value.trim();
  const position = inputPosition.value.trim();
  const office = inputOffice.value;
  const age = Number(inputAge.value);
  const salary = Number(inputSalary.value);

  if (!employeeName || !position || !office || !age || !salary) {
    pushNotification(
      100,
      10,
      'Validation Error',
      'All fields are required.',
      'error',
    );

    return;
  }

  if (employeeName.length < 4 || age < 18 || age > 90) {
    pushNotification(
      100,
      10,
      'Validation Error',
      'Invalid name or age.',
      'error',
    );

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `;

  tbody.append(newRow);
  tbodyArray.push(newRow);

  tbodyArray = Array.from(tbody.querySelectorAll('tr'));

  [inputName, inputPosition, inputOffice, inputAge, inputSalary].forEach(
    (input) => {
      input.value = '';
    },
  );

  pushNotification(100, 10, 'Success', 'Employee added.', 'success');
});

// notification
const pushNotification = (posTop, posRight, title, description, type) => {
  const messageBlock = document.createElement('div');

  messageBlock.classList.add('notification', type);
  messageBlock.setAttribute('data-qa', 'notification');

  const header = document.createElement('h2');

  header.classList.add('title');
  header.textContent = title;

  const paragrath = document.createElement('p');

  paragrath.textContent = description;

  messageBlock.append(header, paragrath);

  messageBlock.style.position = 'fixed';
  messageBlock.style.top = posTop + 'px';
  messageBlock.style.right = posRight + 'px';

  document.body.append(messageBlock);

  setTimeout(() => {
    messageBlock.remove();
  }, 2000);
};

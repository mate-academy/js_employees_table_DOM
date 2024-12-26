'use strict';

const thead = document.querySelectorAll('thead tr th');
const tbody = document.querySelector('tbody');
const tbodyArray = Array.from(tbody.querySelectorAll('tr'));
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

  tbodyArray.forEach((row) => {
    row.addEventListener('click', () => {
      tbodyArray.forEach((r) => {
        r.classList.remove('active');
      });

      row.classList.add('active');
    });
  });
});

buttonSubmit.addEventListener('click', (e) => {
  e.preventDefault();

  const newRow = document.createElement('tr');
  const employeeName = inputName.value.trim();
  const position = inputPosition.value.trim();
  const office = inputOffice.value;
  const age = inputAge.value;
  const salary = inputSalary.value;

  if (employeeName.length < 4 || age < 18 || age > 90) {
    pushNotification(
      100,
      10,
      'Title of Error message',
      'Message example.\n ' +
        'Notification should contain title and description.',
      'error',
    );
  }

  newRow.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${salary}</td>
  `;

  tbody.append(newRow);
  tbodyArray.push(newRow);

  newRow.addEventListener('click', () => {
    tbodyArray.forEach((r) => r.classList.remove('active'));
    newRow.classList.add('active');
  });

  [inputName, inputPosition, inputOffice, inputAge, inputSalary].forEach(
    (input) => {
      input.value = '';
    },
  );
});

// notification
const pushNotification = (posTop, posRight, title, description, type) => {
  const messageBlock = document.createElement('div');

  messageBlock.classList.add('notification', type);

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

'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tBody = table.querySelector('tbody');
const form = document.querySelector('form');
const collect = form.querySelector('button');

collect.addEventListener('click', (e) => {
  e.preventDefault();

  const inputs = document.querySelectorAll('[data-qa]');
  const data = Array.from(inputs).reduce((acc, input) => {
    const key = input.getAttribute('data-qa');
    const value = input.value;
    const obj = {};

    obj[key] = value;

    return { ...acc, ...obj };
  }, {});

  if (validation(data)) {
    data.salary = `$${parseFloat(data.salary).toLocaleString('en-US')}`;

    inputs.forEach((input) => {
      input.value = '';
    });

    tBody.insertAdjacentHTML(
      'afterBegin',
      `<tr>${Object.values(data)
        .map((el) => {
          return `<td>${el}</td>`;
        })
        .join('')}</tr>`,
    );
  }
});

tBody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (row) {
    tBody.querySelectorAll('tr').forEach((r) => {
      r.classList.remove('active');
    });

    row.classList.add('active');
  }
});

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    const rows = [...tBody.querySelectorAll('tr')];

    const isAsceding = header.dataset.sortOrder === 'asc';

    rows.sort((rowA, rowB) => {
      const cellA = rowA.children[index].textContent.trim();
      const cellB = rowB.children[index].textContent.trim();

      return isAsceding ? compare(cellA, cellB) : compare(cellB, cellA);
    });

    rows.forEach((row) => {
      tBody.append(row);
    });

    header.dataset.sortOrder = isAsceding ? 'desc' : 'asc';
  });
});

function compare(a, b) {
  const numA = parseFloat(a.replace(/[^\d.-]/g, ''));
  const numB = parseFloat(b.replace(/[^\d.-]/g, ''));

  if (!isNaN(numA) && !isNaN(numB)) {
    return numA - numB;
  } else {
    return a.localeCompare(b);
  }
}

function pushNotification(title, description, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification');
  notification.classList.add(type);

  const notificationTitle = document.createElement('h2');

  notificationTitle.textContent = title;

  notificationTitle.classList.add('title');

  const notificationDescription = document.createElement('p');

  notificationDescription.textContent = description;

  notification.append(notificationTitle, notificationDescription);

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

function validation(data) {
  if (
    !data.name ||
    !data.position ||
    !data.age ||
    !data.salary ||
    !data.office
  ) {
    pushNotification('Warning', 'Forms is not fill', 'warning');

    return false;
  }

  if (data.name.length < 4) {
    pushNotification('Error', 'Name is not valid', 'error');

    return false;
  }

  if (data.age < 18 || data.age > 90) {
    pushNotification('Error', 'Age is not valid', 'error');

    return false;
  }

  return true;
}

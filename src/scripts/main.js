'use strict';

const table = document.querySelector('table');

const headers = [...table.tHead.rows[0].cells];
const tBody = table.tBodies[0];

const offices = [
  `Tokyo`,
  `Singapore`,
  `London`,
  `New York`,
  `Edinburgh`,
  `San Francisco`,
];

const formHTML = `
  <form class="new-employee-form">
    <label>Name:<input name="name" type="text" data-qa="name" required></label>
    <label>Position:<input name="position" type="text" data-qa="position"></label>
    <label>Office:
      <select name="office" data-qa="office" required>
        ${offices.map((office) => `<option value="${office}">${office}</option>`)}
      </select>
    </label>
    <label>Age:<input name="age" type="number" data-qa="age" required></label>
    <label>Salary:<input name="salary" type="number" data-qa="salary" required min=0></label>

    <button type="submit">Save to table</button>
  </form>`;

table.insertAdjacentHTML('afterend', formHTML);

const form = document.querySelector('form.new-employee-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  let notificationMessage = '';
  let hasError = false;

  if (data.get('name').length < 4) {
    notificationMessage += 'Name must be more than 4 letters.\n';
    hasError = true;
  }

  if (data.get('position').length < 4) {
    notificationMessage += 'Position must be more than 4 letters.\n';
    hasError = true;
  }

  if (+data.get('age') < 18 || +data.get('age') > 90) {
    notificationMessage += 'Age must be more than 18 and less than 90.\n';
    hasError = true;
  }

  if (!hasError) {
    notificationMessage = 'Successfully';

    tBody.insertAdjacentHTML(
      'beforeend',
      `<tr>
        <td>${data.get('name')}</td>
        <td>${data.get('position')}</td>
        <td>${data.get('office')}</td>
        <td>${data.get('age')}</td>
        <td>$${formatNumber(data.get('salary'))}</td>
      </tr>`,
    );
  }

  const newNotification = document.createElement('div');

  newNotification.className = `notification ${hasError ? 'error' : 'success'}`;
  newNotification.setAttribute('data-qa', 'notification');
  newNotification.innerHTML = `<h2 class='title'>${notificationMessage}</h2>`;

  const notification = document.querySelector('.notification');

  if (notification) {
    notification.replaceWith(newNotification);
  } else {
    form.after(newNotification);
  }

  setTimeout(() => {
    document.querySelector('.notification').remove();
  }, 5000);
});

// table sorting by clicking on the title (in two directions).
let prevHeader = null;

headers.forEach((element, index) => {
  element.addEventListener('click', (e) => {
    const rows = [...tBody.rows];
    const reversed = prevHeader === e.target;

    const sortedRows = sortTable(rows, index, reversed);

    tBody.innerHTML = '';
    sortedRows.forEach((row) => tBody.appendChild(row));

    prevHeader = prevHeader === e.target ? null : e.target;
  });
});

// when user clicks on a row, it become selected.
let prevRow = null;

tBody.addEventListener('click', (e) => {
  if (!e.target.closest('tr')) {
    return;
  }

  if (prevRow) {
    prevRow.classList.remove('active');
  }

  e.target.closest('tr').classList.add('active');

  prevRow = e.target.closest('tr');
});

function sortTable(rows, sortColumnIndex, reversed = false) {
  const sortedRows = [...rows].sort((tr1, tr2) => {
    const tr1Text = tr1.cells[sortColumnIndex].textContent;
    const tr2Text = tr2.cells[sortColumnIndex].textContent;

    if (!canConvertToNumber(tr1Text) || !canConvertToNumber(tr2Text)) {
      return tr1Text.localeCompare(tr2Text);
    } else {
      return (
        parseFloat(tr1Text.replace(/[$,]/g, ''), 10) -
        parseFloat(tr2Text.replace(/[$,]/g, ''), 10)
      );
    }
  });

  if (reversed) {
    sortedRows.reverse();
  }

  return sortedRows;
}

function canConvertToNumber(str) {
  const cleanedStr = str.replace(/[$,]/g, '');

  return !isNaN(cleanedStr);
}

function formatNumber(str, chunkSize = 3) {
  const reversed = str.split('').reverse().join('');
  const chunks = reversed.match(new RegExp(`.{1,${chunkSize}}`, 'g'));

  return chunks
    .reverse()
    .map((chunk) => chunk.split('').reverse().join(''))
    .join(',');
}

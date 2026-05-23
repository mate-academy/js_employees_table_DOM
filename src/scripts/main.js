'use strict';

const mainTable = document.querySelector('table');
const tableHead = mainTable.querySelector('thead');
const tableBody = mainTable.querySelector('tbody');

let currentColumnIndex = null;
let isAscending = true;

tableHead.addEventListener('click', (e) => {
  const clicktedEvent = e.target;

  if (clicktedEvent.tagName !== 'TH') {
    return;
  }

  const headTh = [...tableHead.querySelectorAll('th')];
  const positionTh = headTh.indexOf(clicktedEvent);
  const bodyTr = [...tableBody.querySelectorAll('tr')];

  if (currentColumnIndex === positionTh) {
    isAscending = !isAscending;
  } else {
    currentColumnIndex = positionTh;
    isAscending = true;
  }

  const sortedBody = bodyTr.sort((a, b) => {
    const rowA = a.cells[positionTh].textContent;
    const rowB = b.cells[positionTh].textContent;

    if (positionTh <= 2) {
      const result = rowA.localeCompare(rowB);

      return isAscending ? result : rowB.localeCompare(rowA);
    } else {
      const cleanA = rowA.replaceAll('$', '').replaceAll(',', '');
      const cleanB = rowB.replaceAll('$', '').replaceAll(',', '');

      return isAscending ? cleanA - cleanB : cleanB - cleanA;
    }
  });

  tableBody.append(...sortedBody);
});

tableBody.addEventListener('click', (e) => {
  const clicktedEvent = e.target.closest('tr');

  if (!clicktedEvent) {
    return;
  }

  const activeTr = tableBody.querySelector('.active');

  if (activeTr) {
    activeTr.classList.remove('active');
  }

  clicktedEvent.classList.add('active');
});

const tableForm = document.createElement('form');

tableForm.classList.add('new-employee-form');

tableForm.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name"></label>
  <label>Position: <input name="position" type="text" data-qa="position"></label>
  <label>Office:
    <select name="office" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age"></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
  <button type="submit">Save to table</button>
`;

mainTable.after(tableForm);

tableForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formName = tableForm.elements.name.value.trim();
  const formPosition = tableForm.elements.position.value.trim();
  const formOffice = tableForm.elements.office.value;
  const formAge = tableForm.elements.age.value;
  const formSalary = tableForm.elements.salary.value;

  if (!formName || !formPosition || !formOffice || !formAge || !formSalary) {
    pushNotification('Empty field!', 'error');

    return;
  }

  if (formName.length < 4) {
    pushNotification('Small name!', 'error');

    return;
  }

  if (formAge < 18 || formAge > 90) {
    pushNotification('No valid age!', 'error');

    return;
  }

  const newTr = document.createElement('tr');
  const formattedSalary = `$${Number(formSalary).toLocaleString('en-US')}`;

  newTr.innerHTML = `
    <td>${formName}</td>
    <td>${formPosition}</td>
    <td>${formOffice}</td>
    <td>${formAge}</td>
    <td>${formattedSalary}</td>
  `;

  tableBody.append(newTr);
  pushNotification('Congratulations!', 'success');
  tableForm.reset();
});

const pushNotification = (message, type) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';

  const notificationTitle = document.createElement('h2');
  const notificationText = document.createElement('p');

  notificationTitle.textContent = type;
  notificationText.textContent = message;

  notification.append(notificationTitle);
  notification.append(notificationText);

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

tableBody.addEventListener('dblclick', (e) => {
  const clickedTd = e.target;

  if (clickedTd.tagName !== 'TD') {
    return;
  }

  const cellInput = tableBody.querySelector('.cell-input');

  if (cellInput) {
    return;
  }

  const clickedText = clickedTd.textContent;
  const newInput = document.createElement('input');

  newInput.classList.add('cell-input');
  newInput.value = clickedText;

  clickedTd.textContent = '';
  clickedTd.append(newInput);
  newInput.focus();

  newInput.addEventListener('blur', () => {
    const newValue = newInput.value.trim();

    if (newValue.length === 0) {
      clickedTd.textContent = clickedText;
    } else {
      clickedTd.textContent = newValue;
    }
  });

  newInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      newInput.blur();
    }
  });
});

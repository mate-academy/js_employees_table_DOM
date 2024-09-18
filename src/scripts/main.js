'use strict';

const tbody = document.querySelector('tbody');

const th = document.querySelectorAll('thead > tr > th');

let isAscending = false;
let lastSortedColumn = -1;

th.forEach((el, columnIndex) => {
  el.addEventListener('click', () => {
    if (lastSortedColumn !== columnIndex) {
      isAscending = false;
    }

    isAscending = !isAscending;
    lastSortedColumn = columnIndex;

    const tr = tbody.querySelectorAll('tr');
    const trArr = Array.from(tr);

    const isNumericColumn = columnIndex === 3 || columnIndex === 4;

    let sortedTr = trArr.sort((a, b) => {
      const aText = a.cells[columnIndex].innerText;
      const bText = b.cells[columnIndex].innerText;

      if (isNumericColumn) {
        const aNum = aText.replace(/[^0-9.-]+/g, '');
        const bNum = bText.replace(/[^0-9.-]+/g, '');

        return parseFloat(aNum) - parseFloat(bNum);
      } else {
        return aText.localeCompare(bText);
      }
    });

    tbody.innerHTML = '';

    if (!isAscending) {
      sortedTr = sortedTr.reverse();
    }

    sortedTr.forEach((row) => tbody.appendChild(row));
  });
});

const toggleActive = () => {
  tbody.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');

    if (!tr) {
      return;
    }

    const tbodyTr = tbody.querySelectorAll('tr');

    const isActive = tr.classList.contains('active');

    tbodyTr.forEach((row) => {
      row.classList.remove('active');
    });

    if (!isActive) {
      tr.classList.add('active');
    }
  });
};

toggleActive();

function edits() {
  const tr = document.querySelectorAll('tbody > tr');

  tr.forEach((el) => {
    el.addEventListener('dblclick', function () {
      this.setAttribute('contenteditable', 'true');
      this.focus();
    });

    el.addEventListener('blur', function () {
      this.removeAttribute('contenteditable');
    });

    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.removeAttribute('contenteditable');
      }
    });
  });
}

edits();

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationDescription = document.createElement('p');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification', type);
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  notificationTitle.classList.add('title');

  notificationTitle.textContent = title;

  notificationDescription.innerHTML = description.replace('\n', '</br>');

  notification.append(notificationTitle);
  notification.append(notificationDescription);
  document.body.append(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
};

const formForNewEmployee = () => {
  const form = document.createElement('form');
  const inputName = document.createElement('input');
  const inputPosition = document.createElement('input');

  const selectOffice = document.createElement('select');
  const selectOptions = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];
  const inputAge = document.createElement('input');
  const inputSalary = document.createElement('input');

  const labelName = document.createElement('label');
  const labelPosition = document.createElement('label');
  const labelOffice = document.createElement('label');
  const labelAge = document.createElement('label');
  const labelSalary = document.createElement('label');

  const saveButton = document.createElement('button');

  saveButton.textContent = 'Save to table';

  labelName.textContent = 'Name';
  labelPosition.textContent = 'Position';
  labelOffice.textContent = 'Office';
  labelAge.textContent = 'Age';
  labelSalary.textContent = 'Salary';

  form.classList.add('new-employee-form');
  inputName.setAttribute('data-qa', 'name');
  inputName.setAttribute('name', 'name');
  inputName.setAttribute('type', 'text');

  inputPosition.setAttribute('data-qa', 'position');
  inputPosition.setAttribute('name', 'position');
  inputPosition.setAttribute('type', 'text');

  selectOffice.setAttribute('data-qa', 'office');
  selectOffice.setAttribute('name', 'office');

  selectOptions.forEach((office) => {
    const option = document.createElement('option');

    option.value = office.toLowerCase();
    option.textContent = office;
    selectOffice.append(option);
  });

  inputAge.setAttribute('data-qa', 'age');
  inputAge.setAttribute('name', 'age');
  inputAge.setAttribute('type', 'number');

  inputSalary.setAttribute('data-qa', 'salary');
  inputSalary.setAttribute('name', 'salary');
  inputSalary.setAttribute('type', 'number');

  labelName.append(inputName);
  labelPosition.append(inputPosition);
  labelOffice.append(selectOffice);
  labelAge.append(inputAge);
  labelSalary.append(inputSalary);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const newTr = document.createElement('tr');

    const tdName = document.createElement('td');
    const tdPosition = document.createElement('td');
    const tdOffice = document.createElement('td');
    const tdAge = document.createElement('td');
    const tdSalary = document.createElement('td');

    if (
      inputName.value.trim() === '' ||
      inputPosition.value.trim() === '' ||
      inputAge.value === '' ||
      inputSalary.value === ''
    ) {
      return pushNotification(
        10,
        10,
        'Validation Error',
        'Please enter valid data. The input is invalid.',
        'error',
      );
    }

    if (
      inputName.value.trim().length >= 4 &&
      +inputAge.value >= 18 &&
      +inputAge.value <= 90
    ) {
      tdName.innerHTML = inputName.value
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      tdPosition.innerHTML = inputPosition.value
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      tdOffice.innerHTML = selectOffice.value
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      tdAge.innerHTML = inputAge.value;

      tdSalary.innerHTML =
        +inputSalary.value >= 1000
          ? `$${Number(inputSalary.value).toLocaleString('en-US')}`
          : `$${Number(inputSalary.value)}`;

      pushNotification(
        10,
        10,
        'Success',
        'The data has been successfully added.',
        'success',
      );
    } else {
      return pushNotification(
        10,
        10,
        'Validation Error',
        'Please enter valid data. The input is invalid.',
        'error',
      );
    }

    newTr.append(tdName);
    newTr.append(tdPosition);
    newTr.append(tdOffice);
    newTr.append(tdAge);
    newTr.append(tdSalary);
    tbody.append(newTr);

    edits();
  });

  form.append(labelName);
  form.append(labelPosition);
  form.append(labelOffice);
  form.append(labelAge);
  form.append(labelSalary);
  form.append(saveButton);

  document.body.append(form);
};

formForNewEmployee();

'use strict';

let sortProps = document.querySelectorAll('thead th');
let sortPropsArray = Array.from(sortProps);
const wasSorted = [false, false, false, false, false];
const tableBody = document.querySelector('tbody');

function sortHelper(a, b, sortProperty, indexOfSortProp) {
  const aText = a.querySelector(
    `td:nth-child(${sortProperty.cellIndex + 1})`,
  ).textContent;
  const bText = b.querySelector(
    `td:nth-child(${sortProperty.cellIndex + 1})`,
  ).textContent;

  if (!isNaN(+aText.slice(1).split(',').join(''))) {
    let compare1 = +aText;
    let compare2 = +bText;

    if (aText[0] === '$') {
      compare1 = +aText.slice(1).split(',').join('');
      compare2 = +bText.slice(1).split(',').join('');
    }

    return wasSorted[indexOfSortProp]
      ? compare2 - compare1
      : compare1 - compare2;
  }

  return wasSorted[indexOfSortProp]
    ? bText.localeCompare(aText)
    : aText.localeCompare(bText);
}

function sortFuction() {
  sortProps.forEach((sortProp) => {
    const indexOfSortProp = sortPropsArray.indexOf(sortProp);

    sortProp.addEventListener('click', () => {
      const table = sortProp.closest('table');
      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));

      rows.sort((a, b) => {
        return sortHelper(a, b, sortProp, indexOfSortProp);
      });

      wasSorted[indexOfSortProp] = !wasSorted[indexOfSortProp];

      tbody.innerHTML = '';

      rows.forEach((row) => {
        tbody.appendChild(row);
      });
    });
  });
}

function rowActivator() {
  const tableRows = document.querySelectorAll('tbody tr');

  tableRows.forEach((row) => {
    row.addEventListener('click', () => {
      if (Array.from(row.classList).includes('active')) {
        row.classList.remove('active');
      } else {
        row.classList.add('active');
      }
    });
  });
}

function getFormData() {
  const inputs = document.querySelectorAll(
    '.new-employee-form input, .new-employee-form select',
  );

  const array = Array.from(inputs).map((item) => ({
    name: item.name,
    value: item.value,
  }));

  const newRow = document.createElement('tr');
  let hasError = false;

  array.forEach((elem) => {
    const newCell = document.createElement('td');

    if (elem.name === 'name' && elem.value.length < 4) {
      hasError = true;

      return;
    }

    if (elem.name === 'age' && (elem.value < 18 || elem.value > 90)) {
      hasError = true;

      return;
    }

    if (
      elem.name === 'name' ||
      elem.name === 'position' ||
      elem.name === 'office'
    ) {
      const splitArr = elem.value.split(' ');
      const resultArr = [];

      splitArr.forEach((res) => {
        resultArr.push(res[0].toUpperCase() + res.slice(1));
      });

      newCell.textContent = resultArr.join(' ');
    }

    if (elem.name === 'age') {
      newCell.textContent = +elem.value;
    }

    if (elem.name === 'salary') {
      if (elem.value !== '') {
        newCell.textContent =
          '$' +
          elem.value.toString().slice(0, 3) +
          ',' +
          elem.value.toString().slice(3);
      }
    }

    newRow.appendChild(newCell);
  });

  if (hasError) {
    showNotification('error');
    sortFuction();
    rowActivator();

    return;
  }

  tableBody.appendChild(newRow);
  showNotification('success');
  sortPropsArray = Array.from(sortProps);
  sortProps = document.querySelectorAll('thead th');
  sortFuction();
  rowActivator();
}

function showNotification(type) {
  const notification = document.createElement('notification');

  notification.setAttribute('data-qa', 'notification');
  notification.style.position = 'absolute';
  notification.style.top = '50%';
  notification.style.left = '50%';
  notification.style.transform = 'translate(-50%, -50%)';
  notification.style.backgroundColor = 'rgba(50, 50, 50, 0.75)';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '10px';
  notification.style.fontSize = '16px';
  notification.style.fontWeight = 'bold';
  notification.style.textAlign = 'center';
  notification.style.minWidth = '150px';
  notification.style.zIndex = '1000';

  if (type === 'error') {
    notification.textContent = 'Error';
    notification.className = 'error';
    notification.style.color = 'red';
  } else {
    notification.textContent = 'Success';
    notification.className = 'success';
    notification.style.color = 'green';
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function formInitializer() {
  const form = document.createElement('form');

  document.body.appendChild(form);
  form.classList.add('new-employee-form');

  const formInputs = ['Name', 'Position', 'Office', 'Age', 'Salary'];
  const formOfficeOptions = [
    `Tokyo`,
    `Singapore`,
    `London`,
    `New York`,
    `Edinburgh`,
    `San Francisco`,
  ];

  formInputs.forEach((formInput) => {
    const elementLowerCase = formInput.toLowerCase();
    const newElementLabel = document.createElement('label');
    let newElement = document.createElement('input');

    if (formInput === 'Office') {
      newElement = document.createElement('select');

      formOfficeOptions.forEach((option) => {
        const selectOption = document.createElement('option');

        selectOption.setAttribute('value', option.toLowerCase());
        selectOption.innerHTML = option;
        newElement.appendChild(selectOption);

        if (selectOption.parentNode.children.length === 1) {
          selectOption.setAttribute('selected', 'selected');
        }
      });
    }

    newElementLabel.textContent = formInput;
    newElementLabel.setAttribute('for', elementLowerCase);
    newElementLabel.appendChild(newElement);
    newElement.setAttribute('data-qa', elementLowerCase);
    newElement.setAttribute('name', elementLowerCase);
    newElement.required = true;
    form.appendChild(newElementLabel);

    if (formInput === 'Name' || formInput === 'Position') {
      newElement.setAttribute('type', 'text');
    }

    if (formInput === 'Age' || formInput === 'Salary') {
      newElement.setAttribute('type', 'number');
    }
  });

  const formButton = document.createElement('button');

  formButton.textContent = `Save to table`;
  formButton.setAttribute('type', 'submit');
  formButton.setAttribute('value', `Save to table`);
  form.appendChild(formButton);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    getFormData();
    sortFuction();
    rowActivator();
  });

  enableCellEditing();
  sortFuction();
  rowActivator();
}

function enableCellEditing() {
  document.querySelectorAll('tbody td').forEach((cell) => {
    cell.addEventListener('dblclick', () => {
      const currentText = cell.textContent;
      const input = document.createElement('input');

      input.type = 'text';
      input.value = currentText;
      input.style.width = `${cell.offsetWidth}px`;
      input.style.height = `${cell.offsetHeight}px`;
      input.style.fontSize = 'inherit';
      input.style.border = 'none';
      input.style.outline = 'none';
      input.style.padding = '0';
      input.style.margin = '0';
      input.style.textAlign = 'center';

      cell.innerHTML = '';
      cell.appendChild(input);
      input.focus();

      function saveChanges() {
        cell.textContent = input.value.trim() || currentText;
        input.remove();
      }

      function cancelChanges() {
        cell.textContent = currentText;
        input.remove();
      }

      input.addEventListener('blur', saveChanges);

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          saveChanges();
        }

        if (e.key === 'Escape') {
          cancelChanges();
        }
      });
    });
  });
}

formInitializer();

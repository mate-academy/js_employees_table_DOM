const employeeTable = document.querySelector('table');
const typeOfSort = {
  name: 0,
  position: 0,
  office: 0,
  age: 0,
  salary: 0,
};
const operationalTable = employeeTable.cloneNode(true);
const operationalRows = [...operationalTable.tBodies[0].rows];

employeeTable.tHead.addEventListener('click', function sortByClick(e) {
  const header = e.target.textContent;
  const whichColumn = e.target.cellIndex;

  typeOfSort[header] ^= 1;

  switch (header) {
    case 'Name':
    case 'Position':
    case 'Office':
      const whatToReturnV1 =
        typeOfSort[header] === 1
          ? (aValue, bValue) => aValue.localeCompare(bValue)
          : (aValue, bValue) => bValue.localeCompare(aValue);

      operationalRows.sort((a, b) => {
        const aToCompare = a.cells[whichColumn].textContent
          .toLowerCase()
          .replaceAll(' ', '');
        const bToCompare = b.cells[whichColumn].textContent
          .toLowerCase()
          .replaceAll(' ', '');

        return whatToReturnV1(aToCompare, bToCompare);
      });
      break;
    case 'Age':
      const whatToReturnV2 =
        typeOfSort[header] === 1
          ? (aValue, bValue) => aValue - bValue
          : (aValue, bValue) => bValue - aValue;

      operationalRows.sort((a, b) => {
        const aToCompare = +a.cells[whichColumn].textContent;
        const bToCompare = +b.cells[whichColumn].textContent;

        return whatToReturnV2(aToCompare, bToCompare);
      });
      break;
    case 'Salary':
      const whatToReturnV3 =
        typeOfSort[header] === 1
          ? (aValue, bValue) => aValue - bValue
          : (aValue, bValue) => bValue - aValue;

      operationalRows.sort((a, b) => {
        const aToCompare = +a.cells[whichColumn].textContent
          .replace(/[^,.\d]/g, '')
          .split(',')
          .join('.');
        const bToCompare = +b.cells[whichColumn].textContent
          .replace(/[^,.\d]/g, '')
          .split(',')
          .join('.');

        return whatToReturnV3(aToCompare, bToCompare);
      });
      break;
  }

  // eslint-disable-next-line no-unused-vars
  const setSortedTable = operationalRows.forEach((row, i) => {
    employeeTable.tBodies[0].rows[i].innerHTML = row.innerHTML;
  });
});

// eslint-disable-next-line no-shadow
employeeTable.tBodies[0].addEventListener('click', function (e) {
  const currentRow = e.target.closest('tr');
  const isCurrentRowSelected = currentRow.classList.contains('active');

  if (isCurrentRowSelected) {
    return;
  }

  const isSomethingSelected = employeeTable.querySelector('.active');

  if (isSomethingSelected) {
    isSomethingSelected.classList.remove('active');
  }

  currentRow.classList.add('active');
});

const createPageForm = function () {
  const form = document.createElement('form');

  form.setAttribute('class', 'new-employee-form');

  for (let i = 0; i < 5; i++) {
    const fieldName = operationalTable.tHead.rows[0].cells[i].textContent;
    const label = document.createElement('label');

    switch (fieldName) {
      case 'Name':
      case 'Position':
        label.innerHTML = `${fieldName}<input name="${fieldName.toLowerCase()}" type="text" data-qa="${fieldName.toLowerCase()}">`;
        form.appendChild(label);
        break;
      case 'Office':
        const select = document.createElement('select');
        const labelName = document.createTextNode('Office');

        label.appendChild(labelName);
        select.setAttribute('data-qa', 'office');
        select.setAttribute('type', 'text');
        select.setAttribute('name', 'office');

        const addOption = (valueToAdd, textToAdd) =>
          `<option value="${valueToAdd}" type="text"> ${textToAdd} </option>`;
        const cityToAdd = [
          `Tokyo`,
          `Singapore`,
          `London`,
          `New York`,
          `Edinburgh`,
          `San Francisco`,
        ];

        cityToAdd.forEach((city) => {
          const optionValueProperty = city;

          select.innerHTML += addOption(optionValueProperty, city);
        });

        label.appendChild(select);
        form.appendChild(label);
        break;
      case 'Age':
      case 'Salary':
        label.innerHTML = `${fieldName}<input name="${fieldName.toLowerCase()}"
                            type="number" data-qa="${fieldName.toLowerCase()}" min="0">`;
        form.appendChild(label);
        break;
    }

    if (i === 4) {
      const button = document.createElement('button');

      button.setAttribute('name', 'saveToTable');
      button.setAttribute('type', 'button');
      button.innerHTML = 'Save to table';
      form.appendChild(button);
    }
  }
  document.body.appendChild(form);

  const pageForm = document.forms[0];

  const createNotification = (
    pageTop,
    pageLeft,
    type,
    message,
    whetherDisplay = '',
  ) => {
    const notification = document.createElement('div');

    if (pageTop !== undefined) {
      notification.style.top = pageTop + 'px';
    }

    if (pageLeft !== undefined) {
      notification.style.left = pageLeft + 'px';
    }

    notification.classList.add('notification');
    notification.classList.add(type);
    notification.innerHTML = `<h2 class="title">${message}</h2>`;
    notification.style.position = 'absolute';
    notification.style.display = whetherDisplay;
    notification.setAttribute('data-qa', 'notification');

    document.body.appendChild(notification);
  };

  createNotification(
    undefined,
    undefined,
    'success',
    `Worker is sucessfully added`,
  );

  const notificationVerticalGap =
    document.querySelector('div.notification').getClientRects()[0].height + 10;
  let totalGap = notificationVerticalGap + 10;

  createNotification(
    totalGap,
    undefined,
    'error',
    `Worker age is not between 18 and 90`,
    'none',
  );
  totalGap += notificationVerticalGap;

  createNotification(
    totalGap,
    undefined,
    'error',
    `Worker fullname has less than 4 letters`,
    'none',
  );
  totalGap += notificationVerticalGap;

  createNotification(
    totalGap,
    undefined,
    'error',
    `Not each required field are filled`,
    'none',
  );

  const notifications = [...document.querySelectorAll('div.notification')];

  notifications[0].style.display = 'none';

  const addFieldsValidation = () => {
    const { name: fullname, position, office, age, salary } = pageForm.elements;
    const button = pageForm.lastElementChild;

    // eslint-disable-next-line no-unused-vars
    const addNumberFieldPattern = (function () {
      age.addEventListener('blur', (e) => {
        const integner = isNaN(parseInt(age.value))
          ? ''
          : parseInt(age.value).toString();

        age.value = integner;
      });

      salary.addEventListener('blur', (e) => {
        const numberWithDot = salary.value.replace(/,/, '.');

        const floatingNumber = isNaN(parseFloat(numberWithDot))
          ? ''
          : parseFloat(numberWithDot).toString();

        salary.value = floatingNumber;
      });
    })();

    button.addEventListener('click', (e) => {
      // prettier-ignore

      const pageInputsValue = {
        'name': fullname.value,
        'position': position.value,
        'office': office.value,
        'age': age.value,
        'salary': (() => {
          if (salary.value === '') {
            return '';
          }
    
          const convertedSalary = (Number(salary.value) / 1000).toFixed(3);
    
          return `$${convertedSalary.toString().replace('.', ',')}`;
        })(),
      };
      const isNameFieldTooShort = pageInputsValue.name.length < 4;
      const isTooYoung = pageInputsValue.age < 18;
      const isTooOld = pageInputsValue.age > 90;
      const areAllFieldsFilled =
        pageInputsValue.name.length > 0 &&
        pageInputsValue.position.length > 0 &&
        pageInputsValue.age.length > 0 &&
        pageInputsValue.salary.length > 0 &&
        pageInputsValue.office.length > 0;
      const canSubmit =
        !isNameFieldTooShort && areAllFieldsFilled && !isTooYoung && !isTooOld;

      if (canSubmit) {
        const newEmployee = document.createElement('tr');

        newEmployee.innerHTML = `<td> ${pageInputsValue.name} </td>
          <td> ${pageInputsValue.position} </td>
          <td> ${pageInputsValue.office} </td>
          <td> ${pageInputsValue.age} </td>
          <td> ${pageInputsValue.salary} </td>`;
        operationalRows.push(newEmployee.cloneNode(true));
        employeeTable.tBodies[0].appendChild(newEmployee);

        fullname.value = '';
        position.value = '';
        office.selectedIndex = 0;
        age.value = '';
        salary.value = '';

        notifications[0].style.display = '';

        setTimeout(() => {
          notifications[0].style.display = 'none';
        }, 2000);
      } else {
        if (isTooOld || isTooYoung) {
          notifications[1].style.display = '';

          setTimeout(() => {
            notifications[1].style.display = 'none';
          }, 2000);
        }

        if (isNameFieldTooShort) {
          notifications[2].style.display = '';

          setTimeout(() => {
            notifications[2].style.display = 'none';
          }, 2000);
        }

        if (!areAllFieldsFilled) {
          notifications[3].style.display = '';

          setTimeout(() => {
            notifications[3].style.display = 'none';
          }, 2000);
        }
      }
    });
  };

  addFieldsValidation();
};

createPageForm();

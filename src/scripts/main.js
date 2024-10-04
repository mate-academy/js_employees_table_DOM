/* eslint-disable no-shadow */
'use strict';

let employeeTable = [...document.querySelectorAll('tbody > tr')];
const headers = [...document.querySelectorAll('thead > tr > th')];
const tbody = document.querySelector('tbody');

const sortState = {
  name: 'desc',
  position: 'desc',
  office: 'desc',
  age: 'desc',
  salary: 'desc',
};

const sortingFn = (sortBy, table, sortingOrder) => {
  switch (sortBy) {
    case 'name':
      table.sort((emplA, emplB) => {
        const emplAName = emplA.cells[0].innerText.toLowerCase();
        const emplBName = emplB.cells[0].innerText.toLowerCase();

        return emplAName.localeCompare(emplBName);
      });

      break;

    case 'position':
      table.sort((emplA, emplB) => {
        const emplAPosition = emplA.cells[1].innerText.toLowerCase();
        const emplBPosition = emplB.cells[1].innerText.toLowerCase();

        return emplAPosition.localeCompare(emplBPosition);
      });
      break;

    case 'office':
      table.sort((emplA, emplB) => {
        const emplAOffice = emplA.cells[2].innerText.toLowerCase();
        const emplBOffice = emplB.cells[2].innerText.toLowerCase();

        return emplAOffice.localeCompare(emplBOffice);
      });
      break;

    case 'age':
      table.sort((emplA, emplB) => {
        const emplAAge = +emplA.cells[3].innerText;
        const emplBAge = +emplB.cells[3].innerText;

        return emplAAge - emplBAge;
      });
      break;

    case 'salary':
      table.sort((emplA, emplB) => {
        const emplASalary = +emplA.cells[4].innerText.slice(1).replace(',', '');
        const emplBSalary = +emplB.cells[4].innerText.slice(1).replace(',', '');

        return emplASalary - emplBSalary;
      });
      break;

    default:
      return table;
  }

  return sortingOrder === 'asc' ? table : table.reverse();
};

headers.forEach((header) => {
  header.addEventListener('click', () => {
    const headerName = header.innerText.toLowerCase();
    const order = sortState[headerName] === 'desc' ? 'asc' : 'desc';

    sortState[headerName] = order;

    const sortedEmployees = sortingFn(headerName, employeeTable, order);
    const fragment = document.createDocumentFragment();

    tbody.innerHTML = '';

    sortedEmployees.forEach((employee) => {
      fragment.appendChild(employee);
    });

    tbody.append(fragment);
  });
});

tbody.addEventListener('click', (event) => {
  const lastActive = tbody.querySelector('tr.active');

  if (lastActive) {
    lastActive.className = '';
  }

  const targetRow = event.target.closest('tr');

  if (!targetRow || targetRow === lastActive) {
    return;
  }

  targetRow.className = 'active';
});

const formState = {};
const removeAllNotifications = () => {
  const notifications = document.querySelectorAll('.notification');

  notifications.forEach((notification) => {
    notification.remove();
  });
};

const inputCreator = (labelName, type = 'text') => {
  const newLabel = document.createElement('label');

  newLabel.innerText = `${labelName}:`;

  const newInput = document.createElement('input');
  const normalizedInputName = labelName.toLowerCase();

  formState[normalizedInputName] = '';

  newInput.addEventListener('input', (event) => {
    removeAllNotifications();

    formState[normalizedInputName] = event.target.value;
  });

  newInput.name = normalizedInputName;
  newInput.type = type;
  newInput.setAttribute('data-qa', normalizedInputName);

  newLabel.append(newInput);

  return newLabel;
};

const optionsCreator = (optionName) => {
  const newOption = document.createElement('option');

  newOption.innerText = optionName;

  return newOption;
};

const updateEmployeeTable = () => {
  employeeTable = [...document.querySelectorAll('tbody > tr')];
};

const body = document.querySelector('body');
const newEmployeeForm = document.createElement('form');

newEmployeeForm.className = 'new-employee-form';

const formFilling = document.createDocumentFragment();

formFilling.appendChild(inputCreator('Name'));
formFilling.appendChild(inputCreator('Position'));

const select = document.createElement('label');
const selectElement = document.createElement('select');

selectElement.name = 'office';
selectElement.value = 'Tokyo';
selectElement.setAttribute('data-qa', 'office');

selectElement.addEventListener('change', (event) => {
  removeAllNotifications();

  formState[selectElement.name] = event.target.value;
});

select.innerText = 'Office:';
select.append(selectElement);

selectElement.append(optionsCreator('Tokyo'));
selectElement.append(optionsCreator('Singapore'));
selectElement.append(optionsCreator('London'));
selectElement.append(optionsCreator('New York'));
selectElement.append(optionsCreator('Edinburgh'));
selectElement.append(optionsCreator('San Francisco'));

formFilling.appendChild(select);
formFilling.appendChild(inputCreator('Age', 'number'));
formFilling.appendChild(inputCreator('Salary', 'number'));

const formButton = document.createElement('button');

formButton.innerText = 'Save to table';
formFilling.appendChild(formButton);

newEmployeeForm.append(formFilling);

body.append(newEmployeeForm);

const createNotification = (notifClass, notifTitle, notifDescription) => {
  const newNotif = document.createElement('div');
  const title = document.createElement('h2');
  const description = document.createElement('span');

  newNotif.classList.add('notification');
  newNotif.classList.add(notifClass);
  newNotif.setAttribute('data-qa', 'notification');

  title.classList.add('title');
  title.innerText = notifTitle;

  description.innerText = notifDescription;

  newNotif.append(title);
  newNotif.append(description);

  return newNotif;
};

const tdCreator = (data) => {
  const newTd = document.createElement('td');

  newTd.innerText = data;

  return newTd;
};

const resetAllFields = () => {
  const fields = document.querySelectorAll('input');

  fields.forEach((field) => {
    field.value = '';
  });
};

newEmployeeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  removeAllNotifications();

  if (formState.name.length < 4) {
    return body.append(
      createNotification(
        'error',
        'Name field error',
        'Name field cant be shorter than 4 symbols',
      ),
    );
  }

  if (!formState.position) {
    return body.append(
      createNotification(
        'error',
        'Position field error',
        'Position field cannot be empty',
      ),
    );
  }

  if (formState.age < 18 || formState.age > 90) {
    return body.append(
      createNotification(
        'error',
        'Age field error',
        'Employee needs to be 18 years or older',
      ),
    );
  }

  const normalizedSalary =
    '$' + Number(formState.salary).toLocaleString('en-US');

  const newEmployee = {
    name: formState.name,
    position: formState.position,
    office: formState.office || selectElement.value,
    age: formState.age,
    salary: normalizedSalary,
  };

  const newTr = document.createElement('tr');

  newTr.append(tdCreator(newEmployee.name));
  newTr.append(tdCreator(newEmployee.position));
  newTr.append(tdCreator(newEmployee.office));
  newTr.append(tdCreator(newEmployee.age));
  newTr.append(tdCreator(newEmployee.salary));

  tbody.append(newTr);
  updateEmployeeTable();
  selectElement.value = 'Tokyo';
  resetAllFields();

  return body.append(
    createNotification(
      'success',
      'Sucessfully added',
      'New employee sucessfully added to the table',
    ),
  );
});

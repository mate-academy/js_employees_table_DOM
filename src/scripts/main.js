'use strict';

function setSalaryToNumber(salary) {
  return parseInt(salary.replace('$', '').replaceAll(',', ''));
}

const newEmployee = {
  name: 'Name',
  position: 'Position',
  office: 'Office',
  age: 'Age',
  salary: 'Salary',
};
const officeOptions = [
  `Tokyo`,
  `Singapore`,
  `London`,
  `New York`,
  `Edinburgh`,
  `San Francisco`,
];

function pushNotification(type, title, description) {
  const notification = document.createElement('div');
  const notificationHeader = document.createElement('h2');
  const notificationText = document.createElement('p');

  notification.classList.add('notification');
  notification.dataset.qa = 'notification';
  notification.classList.add(type);

  notificationHeader.innerText = title;
  notificationText.innerText = description;
  notification.append(notificationHeader, notificationText);

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

const notificationType = {
  success: 'success',
  error: 'error',
};

const notificationTitle = {
  success: 'Well done!',
  error: 'Something went wrong.',
};

const notificationDescription = {
  success: 'New employee has been added.',
  error: '',
};

const table = document.querySelector('table');
const tableHeads = [...table.rows[0].children];
const tableBody = table.tBodies[0];
const tableDatas = [...tableBody.rows];

tableHeads.forEach((head, index) => {
  head.addEventListener('click', () => {
    if (head.classList.contains('sortASC')) {
      tableDatas.reverse();
      head.classList.remove('sortASC');
    } else {
      table.querySelector('.sortASC')?.classList.remove('sortASC');

      tableDatas.sort((data1, data2) => {
        const data1Content = data1.children[index].textContent;
        const data2Content = data2.children[index].textContent;

        switch (head.textContent) {
          case 'Name':
          case 'Position':
          case 'Office':
            return data1Content.localeCompare(data2Content);
          case 'Age':
            return data1Content - data2Content;
          case 'Salary':
            return (
              setSalaryToNumber(data1Content) - setSalaryToNumber(data2Content)
            );
        }
      });
      head.classList.add('sortASC');
    }
    tableBody.append(...tableDatas);
  });
});

table.addEventListener('click', (tableEvent) => {
  const dataRow = tableEvent.target.closest('tr');

  if (dataRow) {
    table.querySelector('.active')?.classList.remove('active');
    dataRow.classList.add('active');
  }
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

for (const key in newEmployee) {
  const label = document.createElement('label');
  const labelText = `${newEmployee[key]}: `;

  if (key === 'office') {
    const select = document.createElement('select');

    select.name = key;
    select.dataset.qa = key;

    officeOptions.forEach((officeOption) => {
      const option = document.createElement('option');

      option.textContent = officeOption;
      option.value = officeOption;
      select.append(option);
    });
    label.append(labelText, select);
  } else {
    const input = document.createElement('input');

    input.type = 'text';
    input.name = key;
    input.dataset.qa = key;
    label.append(labelText, input);
  }
  form.append(label);
}

const formButton = document.createElement('button');

formButton.type = 'submit';
formButton.textContent = 'Save to table';
form.append(formButton);
document.body.append(form);

form.addEventListener('submit', (formEvent) => {
  formEvent.preventDefault();

  const formData = new FormData(form);
  const newRow = document.createElement('tr');

  for (const key in newEmployee) {
    const data = formData.get(key);
    const tableData = document.createElement('td');

    tableData.textContent = data;

    if (data.trim().length === 0) {
      notificationDescription.error += `${newEmployee[key]} should be filled.\n`;
    }

    switch (key) {
      case 'name':
        if (data.trim().length < 4) {
          notificationDescription.error += `${newEmployee[key]} should have more then 4 letters.\n`;
        }
        break;
      case 'age':
        if (data < 18 || data > 90) {
          notificationDescription.error += `${newEmployee[key]} should be more then 18 and less then 90.\n`;
        }
        break;
      case 'salary':
        if (data < 0 || isNaN(+data)) {
          notificationDescription.error += `${newEmployee[key]} should be more then 0.\n`;
        } else {
          tableData.textContent = `$${parseInt(data).toLocaleString()}`;
        }
        break;
    }
    newRow.append(tableData);
  }

  if (notificationDescription.error.length === 0) {
    tableBody.append(newRow);
    tableDatas.push(newRow);

    pushNotification(
      notificationType.success,
      notificationTitle.success,
      notificationDescription.success,
    );
    form.reset();
  } else {
    pushNotification(
      notificationType.error,
      notificationTitle.error,
      notificationDescription.error,
    );
    notificationDescription.error = '';
  }
});

tableBody.addEventListener('dblclick', (tdEvent) => {
  const cellData = tdEvent.target.textContent;
  const newInput = document.createElement('input');

  newInput.classList.add('cell-input');
  newInput.value = cellData;
  tdEvent.target.firstChild.replaceWith(newInput);
  newInput.focus();

  const cellEditListener = () => {
    tdEvent.target.textContent = newInput.value.trim() || cellData;
    newInput.remove();
  };

  newInput.addEventListener('blur', cellEditListener);

  newInput.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      cellEditListener();
    }
  });
});

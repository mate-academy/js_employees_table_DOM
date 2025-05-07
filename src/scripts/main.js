'use strict';

const tableElement = document.querySelector('table');

// 1 task
tableElement.addEventListener('click', (e) => {
  const thElement = e.target.closest('th');

  if (!thElement) {
    return;
  }

  const tableRows = e.currentTarget.querySelectorAll('tbody tr');

  const users = [...tableRows]
    .map((row) => {
      const tdElements = row.querySelectorAll('td');

      if (tdElements.length < 4) {
        return;
      }

      return {
        Name: tdElements[0].textContent,
        Position: tdElements[1].textContent,
        Office: tdElements[2].textContent,
        Age: tdElements[3].textContent,
        Salary: tdElements[4].textContent,
      };
    })
    .filter(Boolean);

  const prevSortBy = e.currentTarget.querySelector('[data-sorted]');

  if (prevSortBy === thElement) {
    prevSortBy.dataset.sorted =
      prevSortBy.dataset.sorted === 'ask' ? 'desk' : 'ask';

    sortTableBy(users, thElement.textContent, prevSortBy.dataset.sorted);
  } else {
    if (prevSortBy) {
      prevSortBy.removeAttribute('data-sorted');
    }
    thElement.dataset.sorted = 'ask';

    sortTableBy(users, thElement.textContent);
  }

  const sortedTableRows = users
    .map(({ Name, Position, Office, Age, Salary }) => {
      return `<tr>
        <td>${Name}</td>
        <td>${Position}</td>
        <td>${Office}</td>
        <td>${Age}</td>
        <td>${Salary}</td>
      </tr>`;
    })
    .join('');

  const tbodyElement = e.currentTarget.querySelector('tbody');

  tbodyElement.innerHTML = sortedTableRows;
});

function sortTableBy(arr, property, order = 'ask') {
  if (property === 'Name' || property === 'Position' || property === 'Office') {
    arr.sort((u1, u2) => {
      if (order === 'ask') {
        return u1[property].localeCompare(u2[property]);
      }

      return u2[property].localeCompare(u1[property]);
    });
  } else if (property === 'Age') {
    arr.sort((u1, u2) => {
      if (order === 'ask') {
        return u1[property] - u2[property];
      }

      return u2[property] - u1[property];
    });
  } else {
    arr.sort((u1, u2) => {
      const salary1 = Number(u1.Salary.replace('$', '').replaceAll(',', ''));
      const salary2 = Number(u2.Salary.replace('$', '').replaceAll(',', ''));

      if (order === 'ask') {
        return salary1 - salary2;
      }

      return salary2 - salary1;
    });
  }
}

// 2 task
tableElement.addEventListener('click', (e) => {
  const rowElement = e.target.closest('tbody tr');

  if (!rowElement) {
    return;
  }

  const prevActiveRow = e.currentTarget.querySelector('.active');

  if (prevActiveRow) {
    prevActiveRow.classList.remove('active');
  }

  if (!rowElement.classList.contains('active')) {
    rowElement.classList.add('active');
  }
});

// 3-4 tasks
const newEmployeeForm = document.createElement('form');

newEmployeeForm.classList.add('new-employee-form');

newEmployeeForm.insertAdjacentHTML(
  'beforeend',
  `<label>
    Name:
    <input name="name" type="text" data-qa="name">
   </label>`,
);

newEmployeeForm.insertAdjacentHTML(
  'beforeend',
  `<label>
    Position:
    <input name="position" type="text" data-qa="position">
   </label>`,
);

newEmployeeForm.insertAdjacentHTML(
  'beforeend',
  `<label>
    Office:
    <select name="office" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>`,
);

newEmployeeForm.insertAdjacentHTML(
  'beforeend',
  `<label>
    Age:
    <input name="age" type="number" data-qa="age">
   </label>`,
);

newEmployeeForm.insertAdjacentHTML(
  'beforeend',
  `<label>
    Salary:
    <input name="salary" type="number" data-qa="salary">
   </label>`,
);

newEmployeeForm.insertAdjacentHTML(
  'beforeend',
  '<button type="submit">Save to table</button>',
);

document.body.append(newEmployeeForm);

newEmployeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const userName = e.currentTarget.elements.name.value;
  const position = e.currentTarget.elements.position.value;
  const office = e.currentTarget.elements.office.value;
  const age = e.currentTarget.elements.age.value;
  const salary = e.currentTarget.elements.salary.value;

  const notifications = [];

  if (!userName || !position || !office || !age || !salary) {
    notifications.push({
      title: 'Missing data',
      description: 'All fields are required.',
    });
  }

  if (!!userName && userName.length < 4) {
    notifications.push({
      title: 'Invalid name',
      description: 'Name should be have at least 4 letters.',
    });
  }

  if (!!age && (age < 18 || age > 90)) {
    notifications.push({
      title: 'Invalid age',
      description: 'Age should be between 18 and 90.',
    });
  }

  if (notifications.length > 0) {
    pushNotification('error', notifications);

    return;
  }

  const tbody = tableElement.querySelector('tbody');

  const preparedSalary = `$${formatBigNumber(salary)}`;

  tbody.insertAdjacentHTML(
    'beforeend',
    `<tr>
      <td>${userName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>${preparedSalary}</td>
    </tr>`,
  );

  e.currentTarget.reset();

  pushNotification('success', [
    {
      title: 'Success',
      description: `Employee ${userName} has been added to table.`,
    },
  ]);
});

const pushNotification = (type, notifications) => {
  notifications.forEach(({ title, description }, index) => {
    const notificationElement = document.createElement('div');

    notificationElement.dataset.qa = 'notification';

    notificationElement.classList.add('notification');
    notificationElement.classList.add(type);

    const titleElement = document.createElement('h2');

    titleElement.classList.add('title');
    titleElement.textContent = title;
    notificationElement.append(titleElement);

    const descriptionElement = document.createElement('p');

    descriptionElement.textContent = description;
    notificationElement.append(descriptionElement);

    notificationElement.style.top = `${10 + 140 * index}px`;
    notificationElement.style.right = `${10}px`;

    document.body.appendChild(notificationElement);

    setTimeout(() => {
      notificationElement.style.display = 'none';

      setTimeout(() => {
        notificationElement.remove();
      }, 500);
    }, 2000);
  });
};

function formatBigNumber(number) {
  let formattedNumber = '';

  String(number)
    .split('')
    .reverse()
    .forEach((n, index) => {
      if (index % 3 === 0 && index !== 0) {
        formattedNumber = ',' + formattedNumber;
      }
      formattedNumber = n + formattedNumber;
    });

  return formattedNumber;
}

// 5 task
let currentlyEditingCell = null;

tableElement.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td || currentlyEditingCell) {
    return;
  }

  const originalText = td.textContent;
  const columnIndex = td.cellIndex;
  const headerText = td
    .closest('table')
    .querySelectorAll('th')
    [columnIndex].textContent.trim();

  td.textContent = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = originalText;
  td.appendChild(input);
  input.focus();

  currentlyEditingCell = td;

  const saveAndCleanup = () => {
    const newValue = input.value.trim();

    const notifications = [];

    if (headerText === 'Name' && newValue.length < 4) {
      notifications.push({
        title: 'Invalid name',
        description: 'Name should have at least 4 letters.',
      });
    }

    if (headerText === 'Position' && newValue === '') {
      notifications.push({
        title: 'Invalid position',
        description: 'Position should have at least 1 letter.',
      });
    }

    const cities = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    if (headerText === 'Office' && !cities.includes(newValue)) {
      notifications.push({
        title: 'Invalid office',
        description: 'Office should be one of the predefined cities.',
      });
    }

    if (headerText === 'Age') {
      const num = Number(newValue);

      if (num < 18 || num > 90) {
        notifications.push({
          title: 'Invalid age',
          description: 'Age should be between 18 and 90.',
        });
      }
    }

    if (headerText === 'Salary') {
      const num = Number(newValue);

      if (isNaN(num) || num <= 0) {
        notifications.push({
          title: 'Invalid salary',
          description: 'Salary should be a number greater than 0.',
        });
      }
    }

    if (notifications.length > 0) {
      td.textContent = originalText;
      pushNotification('error', notifications);
    } else {
      td.textContent =
        headerText === 'Salary' ? `$${formatBigNumber(newValue)}` : newValue;
    }

    currentlyEditingCell = null;

    pushNotification('success', [
      {
        title: 'Success',
        description: `${headerText} updated to ${td.textContent}`,
      },
    ]);
  };

  input.addEventListener('blur', saveAndCleanup);

  input.addEventListener('keydown', (keyE) => {
    if (keyE.key === 'Enter') {
      input.blur();
    } else if (keyE.key === 'Escape') {
      td.textContent = originalText;
      currentlyEditingCell = null;
    }
  });
});

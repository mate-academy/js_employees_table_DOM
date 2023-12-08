'use strict';

const body = document.body;
const table = document.querySelector('table');
const tableHeader = table.tHead;
const tableBody = table.tBodies[0];
let descendingOrder = false;
const form = createForm();
const notificationMessage = {
  SuccsessMessage: {
    title: 'Success message',
    description: 'Employee was created',
    type: 'success',
  },
  MainErrorMessage: {
    title: 'Error message',
    description: 'All filleds must be completed',
    type: 'error',
  },
  WrongNameMessage: {
    title: 'Wrong name',
    description: 'The user name must contain at least 4 characters',
    type: 'error',
  },
  WrongAgeMessage: {
    title: 'Wrong age',
    description: 'Age must be between 18 and 90',
    type: 'error',
  },
  WrongPositionMessage: {
    title: 'Wrong position',
    description: 'Please write correct position',
    type: 'error',
  },
};

body.append(form);

function createForm() {
  const newForm = document.createElement('form');

  newForm.classList = 'new-employee-form';

  newForm.innerHTML = `
    <label>
      Name: <input name="name" type="text" data-qa="name" >
    </label>
    <label>
      Position: <input name="position" type="text" data-qa="position" >
    </label>
    <label>
      Office:
        <select name="office" data-qa="office">
          <option value="Tokyo">Tokyo</option>
          <option value="Singapore">Singapore</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="San Francisco">San Francisco</option>
        </select>
    </label>
    <label>
      Age: <input name="age" type="number" data-qa="age" >
    </label>
    <label>
      Salary: <input name="salary" type="number" data-qa="salary" >
    </label>
    <button>
      Save to table
    </button>
  `;

  return newForm;
}

function sortTable(index) {
  const sortedTable = [...tableBody.rows].sort((a, b) => {
    const valueA = a.children[index].innerText;
    const valueB = b.children[index].innerText;
    const sortOrderMultiplier = descendingOrder ? -1 : 1;

    if (index > 2) {
      return sortOrderMultiplier
        * (convertToNumber(valueA) - convertToNumber(valueB));
    }

    return descendingOrder
      ? valueB.localeCompare(valueA)
      : valueA.localeCompare(valueB);
  });

  tableBody.innerHTML = '';

  tableBody.append(...sortedTable);
  descendingOrder = !descendingOrder;
}

function convertToNumber(currencyString) {
  return parseFloat(currencyString.replace(/[$,]/g, ''));
}

function handleFormSubmit() {
  const data = new FormData(form);
  const {
    name: newName,
    position,
    age,
    office,
    salary,
  } = Object.fromEntries(data.entries());

  if (!newName || !age || !position || !salary) {
    return showNotification(notificationMessage.MainErrorMessage);
  }

  if (newName.length < 4) {
    return showNotification(notificationMessage.WrongNameMessage);
  }

  if (!isNaN(position)) {
    return showNotification(notificationMessage.WrongPositionMessage);
  }

  if (age < 18 || age > 90) {
    return showNotification(notificationMessage.WrongAgeMessage);
  }

  showNotification(notificationMessage.SuccsessMessage);

  tableBody.insertAdjacentHTML(
    'afterbegin',
    `
      <tr>
        <td>${newName}</td>
        <td>${position}</td>
        <td>${office}</td>
        <td>${age}</td>
        <td>$${salary}</td>
      </tr>
    `,
  );

  form.reset();
}

function showNotification(message) {
  const { title, description, type } = message;
  const elementBox = document.createElement('div');

  elementBox.classList.add('notification', type);
  elementBox.setAttribute('data-qa', 'notification');

  elementBox.innerHTML += `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  document.body.appendChild(elementBox);

  setTimeout(() => {
    elementBox.remove();
  }, 2000);
}

function handeleDoubleClick(target) {
  const parentRow = target.parentElement;
  const originalText = target.innerText;
  const newInput = document.createElement('INPUT');

  newInput.value = originalText;
  newInput.classList.add('cell-input');

  newInput.setAttribute(
    'name',
    tableHeader.rows[0].cells[target.cellIndex].innerText.toLocaleLowerCase(),
  );

  if (target === parentRow.children[3]) {
    newInput.setAttribute('type', 'number');
  }

  if (target === parentRow.children[4]) {
    newInput.value = convertToNumber(originalText);
    newInput.setAttribute('type', 'number');
  }

  target.innerText = '';
  target.append(newInput);
  newInput.focus();

  const handleInput = () => {
    if (newInput.name === 'salary') {
      target.innerText
        = '$' + newInput.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      target.innerText = newInput.value.trim() || originalText;
    }
  };

  newInput.addEventListener('blur', () => {
    handleInput();
  });

  newInput.addEventListener('keypress', (press) => {
    if (press.key === 'Enter') {
      handleInput();
    }
  });
}

tableHeader.addEventListener('click', (e) => {
  if (e.target.cellIndex !== undefined) {
    sortTable(e.target.cellIndex);
  }
});

tableBody.addEventListener('click', (e) => {
  const targetRow = e.target.closest('tr');

  if (targetRow) {
    [...tableBody.rows].forEach((row) => {
      row.classList.remove('active');
    });

    targetRow.classList.add('active');
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  handleFormSubmit();
});

tableBody.addEventListener('dblclick', (e) => {
  handeleDoubleClick(e.target);
});

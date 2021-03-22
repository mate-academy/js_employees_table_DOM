'use strict';

const mainTable = document.querySelector('table');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
let countClick = 0;
let prevClick = 0;

function takeNumber(str) {
  return +str.replace(/[$,]/g, '');
}

thead.addEventListener('click', (e) => {
  let reverse = false;

  const tr = tbody.querySelectorAll('tr');

  if (e.target.cellIndex !== prevClick) {
    countClick = 0;
  }

  if (countClick === 0) {
    countClick++;
  } else {
    reverse = true;
    countClick = 0;
  }

  const sorted = [...tr].sort((tdA, tdB) => {
    const prev = tdA.children[e.target.cellIndex].innerText;
    const curr = tdB.children[e.target.cellIndex].innerText;

    if (!reverse) {
      if (!isNaN(takeNumber(prev))) {
        return takeNumber(prev) - takeNumber(curr);
      } else {
        return prev.localeCompare(curr);
      }
    }

    if (reverse) {
      if (!isNaN(takeNumber(curr))) {
        return takeNumber(curr) - takeNumber(prev);
      } else {
        return curr.localeCompare(prev);
      }
    }
  });

  prevClick = e.target.cellIndex;

  tbody.append(...sorted);
});

tbody.addEventListener('click', (e) => {
  const active = document.querySelector('.active');

  e.target.parentElement.setAttribute('class', 'active');

  if (active) {
    active.removeAttribute('class');
  }
});

tbody.addEventListener('dblclick', (e) => {
  const input = document.createElement('input');
  const selectedItem = e.target.closest('td');
  const innerText = selectedItem.innerHTML;

  input.classList.add('cell-input');
  input.setAttribute('size', '1');
  selectedItem.innerHTML = '';
  selectedItem.append(input);

  input.focus();

  const keyEnter = (enter) => {
    if (enter.keyCode === 13) {
      if (input.value) {
        selectedItem.innerHTML = input.value;
      } else {
        selectedItem.innerHTML = innerText;
      }
    }
  };

  const mouseBlur = () => {
    if (input.value) {
      selectedItem.innerHTML = input.value;
    } else {
      selectedItem.innerHTML = innerText;
    }
  };

  input.addEventListener('keypress', keyEnter, true);
  input.addEventListener('blur', mouseBlur, false);
});

mainTable.insertAdjacentHTML(
  'afterend',
  `
  <form class="new-employee-form" method="post">
    <label>
      Name: <input data-qa="name" name="name" type="text">
    </label>
    <label>
      Position: <input data-qa="position" name="position" type="text">
    </label>
    <label>
      Office:
      <select data-qa="office" name="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco"></option>
      </select>
    </label>
    <label>
      Age: <input data-qa="age" name="age" type="number">
    </label>
    <label>
      Salary: <input data-qa="salary" name="salary" type="number">
    </label>
    <button name="button" id="submit">Save to table</button>
  </form>
  `
);

const form = document.querySelector('.new-employee-form');
const button = document.querySelector('#submit');
const formElements = form.elements;

function addNewPerson(
  newName,
  newPosition,
  newOffice,
  newAge,
  newSalary,
) {
  tbody.insertAdjacentHTML('beforeend',
    `
  <tr>
    <td>${newName}</td>
    <td>${newPosition}</td>
    <td>${newOffice}</td>
    <td>${newAge}</td>
    <td>$${newSalary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
  </tr>
`
  );
}

function validationForm() {
  const nameInput = formElements['name'].value;
  const positionInput = formElements['position'].value;
  const officeInput = formElements['office'].value;
  const ageInput = formElements['age'].value;
  const salaryInput = formElements['salary'].value;

  if (nameInput.length < 4) {
    return popNotification('Name ERROR',
      'Please, input name more than 4 charachters', 'error');
  }

  if (!positionInput) {
    return popNotification('Position ERROR',
      'Enter your position', 'error');
  }

  if (!ageInput || ageInput < 18 || ageInput > 90) {
    return popNotification('Age ERROR',
      'Sorry, but the age must be at least '
      + '18 years old and no more then 90', 'error');
  }

  if (!salaryInput) {
    return popNotification('Salary ERROR',
      'I`m sure, you have a salary', 'error');
  }

  popNotification('Employer was added',
    'New employer was added to the table', 'success');

  addNewPerson(
    nameInput,
    positionInput,
    officeInput,
    ageInput,
    salaryInput
  );

  formElements['name'].value = '';
  formElements['position'].value = '';
  formElements['age'].value = '';
  formElements['salary'].value = '';
}

button.addEventListener('click', (e) => {
  e.preventDefault();
  validationForm();
});

function popNotification(title, description, type) {
  const notice = `
    <div data-qa='notification' class='notification ${type}'>
      <h1>${title}</h1>
      <p>${description}</p>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', notice);

  setTimeout(() => {
    document.querySelector(`.${type}`).remove();
  }, 3000);
}

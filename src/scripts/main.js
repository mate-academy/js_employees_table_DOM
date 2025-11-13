'use strict';

// write code here
const thead = [...document.querySelectorAll('thead th')];
const bodyTable = document.querySelector('tbody');

thead.forEach((element, index) => {
  element.addEventListener('click', () => {
    // const columnName = element.innerText;
    // console.log(columnName);

    // if (element.innerText !== columnName) {
    //   element.setAttribute(
    //     'sort',
    //     element.getAttribute('sort') === 'ASC' ? 'DESC' : 'ASC',
    //   );
    // }

    if (!element.hasAttribute('sort')) {
      element.setAttribute('sort', 'ASC');
    }

    const tbody = [...bodyTable.querySelectorAll('tr')];

    const sorted = tbody.sort((a, b) => {
      let valueA;
      let valueB;

      if (index === 4) {
        valueA = a.children[index].innerText.split('$')[1].replace(',', '');
        valueB = b.children[index].innerText.split('$')[1].replace(',', '');
      } else {
        valueA = a.children[index].innerText;
        valueB = b.children[index].innerText;
      }

      if (element.getAttribute('sort') === 'ASC') {
        return !isNaN(Number(valueA)) && !isNaN(Number(valueB))
          ? Number(valueA) - Number(valueB)
          : valueA.localeCompare(valueB);
      } else {
        return !isNaN(Number(valueA)) && !isNaN(Number(valueB))
          ? Number(valueB) - Number(valueA)
          : valueB.localeCompare(valueA);
      }
    });

    element.setAttribute(
      'sort',
      element.getAttribute('sort') === 'ASC' ? 'DESC' : 'ASC',
    );

    bodyTable.innerHTML = '';

    sorted.forEach((el) => {
      bodyTable.appendChild(el);
    });
  });
});

const body = document.querySelector('body');
const form = document.createElement('form');

form.setAttribute('class', 'new-employee-form');

form.innerHTML = `
  <div>
    <label>Name:
      <input
        type="text"
        id="name"
        name="name"
        data-qa="name"
        required
      />
      </label>
      <div class="error" id="name-error"></div>
  </div>

  <div>
    <label>Position:
      <input
        type="text"
        id="position"
        name="position"
        data-qa="position"
      />
    </label>
    <div class="error" id="name-position"></div>
  </div>

    <div>
      <label>Office:
        <select id="office" name="office" data-qa="office" required>
          <option value="Tokyo">Tokyo</option>
          <option value="Singapore">Singapore</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="San Francisco">San Francisco</option>
        </select>
      </label>
      <div class="error" id="office-error"></div>
    </div>

    <div>
      <label>Age:
        <input
          type="number"
          id="age"
          name="age"
          data-qa="age"
          required
        />
      </label>
      <div class="error" id="age-error"></div>
    </div>

    <div>
      <label>Salary:
        <input
          type="number"
          id="salary"
          name="salary"
          data-qa="salary"
          required
        />
      </label>
      <div class="error" id="salary-error"></div>
    </div>

    <button type="submit">Save to table</button>
`;

body.appendChild(form);

const formNew = document.querySelector('form');

formNew.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(formNew);
  const date = Object.fromEntries(formData);

  validateForm(date);
});

function addNewUser(date) {
  const newRow = document.createElement('tr');
  const salaryToNumber = date.salary
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  newRow.innerHTML = `
    <td>${date.name}</td>
    <td>${date.position}</td>
    <td>${date.office}</td>
    <td>${Number(date.age)}</td>
    <td>$${salaryToNumber}</td>
  `;
  bodyTable.appendChild(newRow);
}

function validateForm(date) {
  const nameElement = document.getElementById('name');
  const ageElement = document.getElementById('age');
  const positionElement = document.getElementById('position');
  const salaryElement = document.getElementById('salary');

  let isValid = true;

  const nameValue = date.name.trim();
  const positionValue = date.position.trim();
  const ageValue = Number(date.age.trim());
  const salaryValue = Number(date.salary.trim());

  if (nameValue.length < 4) {
    showError(nameElement, 'Name must be at least 4 characters long');
    isValid = false;
  }

  if (ageValue < 18 || ageValue > 90) {
    showError(ageElement, 'Age must be between 18 and 90');
    isValid = false;
  }

  if (positionValue.length === 0) {
    showError(positionElement, 'Position is required');
    isValid = false;
  }

  if (salaryValue < 1) {
    showError(salaryElement, 'Salary must be more than 0');
    isValid = false;
  }

  if (isValid) {
    showNotification(
      'Employee added successfully',
      'Employee added successfully',
      'success',
    );
    formNew.reset();

    const errorDiv = formNew.querySelectorAll('.error');

    errorDiv.forEach((el) => (el.textContent = ''));

    addNewUser(date);
  } else {
    showNotification(
      'Please correct the errors above',
      'Please correct the errors above',
      'error',
    );
  }
}

function showError(input, message) {
  const errorDiv = input.parentElement.nextElementSibling;

  errorDiv.textContent = message;
}

function showNotification(message, description, type) {
  const notification = document.createElement('div');
  const titleEl = document.createElement('h2');
  const descriptionEl = document.createElement('p');

  notification.setAttribute('class', `notification ${type}`);
  notification.setAttribute('data-qa', 'notification');

  titleEl.textContent = message;
  titleEl.setAttribute('class', 'title');
  descriptionEl.textContent = description;

  notification.appendChild(titleEl);
  notification.appendChild(descriptionEl);

  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 4000);
}

// select row
const rows = document.querySelectorAll('tbody tr');

rows.forEach((element) => {
  element.addEventListener('click', () => {
    const activeElement = document.querySelector('.active');

    if (element.classList.contains('active')) {
      element.classList.add('active');
    } else {
      element.classList.add('active');

      if (activeElement) {
        activeElement.classList.remove('active');
      }
    }
  });
});

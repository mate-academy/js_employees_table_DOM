'use strict';
// write code here

const table = document.querySelector(`table`);
const tbody = document.querySelector(`tbody`);
const tbodyData = document.querySelectorAll(`tbody tr`);
const header = document.querySelectorAll(`thead tr th`);
const data = [];
let position;
let prevClick;
let doubleClick = false;

tbodyData.forEach(tr => {
  const personInfo = [];

  [...tr.children].forEach(th => {
    personInfo.push(th.innerHTML);
  });

  data.push(personInfo);
});

const sortHandler = (pos) => {
  const compareNumber = (a, b) => {
    if (a > b) {
      if (doubleClick) {
        return -1;
      };

      return 1;
    }

    if (a < b) {
      if (doubleClick) {
        return 1;
      }

      return -1;
    }

    if (a === b) {
      return 0;
    }
  };

  const compareString = (a, b) => {
    if (a.localeCompare(b) > 0) {
      if (doubleClick) {
        return -1;
      };

      return 1;
    }

    if (a.localeCompare(b) < 0) {
      if (doubleClick) {
        return 1;
      };

      return -1;
    }

    if (a.localeCompare(b) === 0) {
      return 0;
    }
  };

  const priceToNumber = (str) => Number(str.slice(1).replaceAll(',', ''));

  data.sort((a, b) => {
    const aa = a[pos];
    const bb = b[pos];

    if (pos <= 2) {
      return compareString(aa, bb);
    }

    if (pos === 3) {
      return compareNumber(Number(aa), Number(bb));
    }

    if (pos === 4) {
      return compareNumber(priceToNumber(aa), priceToNumber(bb));
    };
  });
};

const rerenderHandler = (dataBase) => {
  tbody.innerHTML = ``;

  dataBase.forEach(person => {
    const tr = document.createElement(`tr`);

    tr.innerHTML = `
      <td>${person[0]}</td>
      <td>${person[1]}</td>
      <td>${person[2]}</td>
      <td>${person[3]}</td>
      <td>${person[4]}</td>`;
    tbody.appendChild(tr);
  });
};

const clickHeaderHandler = () => {
  header.forEach(th => {
    th.addEventListener(`click`, function(e) {
      position = [...header].indexOf(e.target);

      if (prevClick === position) {
        doubleClick = !doubleClick;
      } else {
        doubleClick = false;
      }

      sortHandler(position);
      rerenderHandler(data);
      prevClick = position;
    });
  });
};

clickHeaderHandler();

tbody.addEventListener('click', function(e) {
  const index = [...tbody.children].indexOf(e.target.closest(`tr`));

  rerenderHandler(data);
  tbody.children[index].classList.add(`active`);
});

const pushNotification = (title, description, type) => {
  // write code here
  const body = document.querySelector('body');
  const message = document.createElement('div');

  message.innerHTML = `
    <div 
      data-qa="notification"
      class="notification ${type}">
      <h2 class="title">${title}</h2>
      <p>${description}</p>
    </div>`;
  body.appendChild(message);

  setTimeout(() => message.remove(), 40000);
};

const formHandler = () => {
  const validation = (employee) => {
    if (employee[0].length < 4) {
      pushNotification(`Error`, `name has less than 4 letters`, `error`);
    } else if (employee[1].length < 4) {
      pushNotification(`Waring`, `fill position input`, `error`);
    } else if (employee[3] < 18 || employee[3] > 90) {
      pushNotification(
        `Error`,
        `Person with this age is not aligeble employee`,
        `error`);
    } else {
      pushNotification(`Success`, `Data is added to local DataBase`, `success`);
      data.push(employee);
      rerenderHandler(data);

      return true;
    }
  };

  const form = document.createElement(`form`);

  form.classList.add(`new-employee-form`);

  form.innerHTML = `
    <label>
      Name:
      <input type="text" name ="name" data-qa="name" required>
    </label>
    <label>
      Position:
      <input type="text" name ="position" data-qa="position"  >
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
      Age:
      <input type="number" name="age" data-qa="age" required>
    </label>
    <label>
      Salary:
      <input type="number" name="salary" data-qa="salary" required>
    </label>
    <button>Save to table</button>`;
  table.insertAdjacentElement(`afterend`, form);

  form.addEventListener(`submit`, function(e) {
    e.preventDefault();

    const newEmployee = [];
    const nameInput = document.querySelector(`[data-qa="name"]`);
    const positionInput = document.querySelector(`[data-qa="position"]`);
    const officeInput = document.querySelector(`[data-qa="office"]`);
    const ageInput = document.querySelector(`[data-qa="age"]`);
    const salaryInput = document.querySelector(`[data-qa="salary"]`);

    newEmployee[0] = nameInput.value;
    newEmployee[1] = positionInput.value;
    newEmployee[2] = officeInput.value;
    newEmployee[3] = ageInput.value;
    newEmployee[4] = `$${Number(salaryInput.value).toLocaleString(`en`)}`;

    const success = validation(newEmployee);

    if (success) {
      nameInput.value = positionInput.value
      = ageInput.value = salaryInput.value = ``;

      officeInput.value = `Tokyo`;
    }
  });
};

formHandler();

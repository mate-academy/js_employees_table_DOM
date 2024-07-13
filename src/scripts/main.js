'use strict';

const table = document.querySelector('table');
const tHead = table.querySelector('thead tr');
const tBody = table.querySelector('tbody');

const markUpHeaders = [...tHead.children].map((th) => {
  return th.textContent;
});

function spreadSettingsEmployees(arrayTr) {
  const peopleObj = arrayTr.map((tr) => {
    const obj = {};

    for (let i = 0; i < tr.children.length; i++) {
      obj[markUpHeaders[i]] = tr.children[i].textContent;
    }

    return obj;
  });

  return peopleObj;
}

function sortEmployees(sortName, arrayEmployyes) {
  switch (sortName) {
    case 'Name':
    case 'Position':
    case 'Office':
      return arrayEmployyes.sort((a, b) => {
        return a[sortName].localeCompare(b[sortName]);
      });

    case 'Age':
      return arrayEmployyes.sort((a, b) => {
        return +a[sortName] - +b[sortName];
      });

    case 'Salary':
      return arrayEmployyes.sort((a, b) => {
        const aSal = +a[sortName].slice(1).replace(',', '');
        const bSal = +b[sortName].slice(1).replace(',', '');

        return aSal - bSal;
      });

    default:
      break;
  }
}

function reRenderTableBody(employees, sortName, reverse = false) {
  const tbody = document.querySelector('tbody');

  if (reverse) {
    employees.reverse();
  } else {
    sortEmployees(sortName, employees);
  }

  [...tbody.children].forEach((tr) => {
    tr.remove();
  });

  employees
    .map((item) => {
      return `
    <tr>
    <td>${item.Name} </td>
    <td>${item.Position} </td>
    <td>${item.Office} </td>
    <td>${item.Age} </td>
    <td>${item.Salary} </td>
    </tr>
    `;
    })
    .forEach((tr) => {
      tbody.insertAdjacentHTML('beforeend', tr);
    });
}

function counterClick() {
  const downList = [];

  return (nameSort) => {
    downList.push(nameSort);

    return downList;
  };
}

const counterClicks = counterClick();

tHead.addEventListener('click', (e) => {
  const sortName = e.target.textContent;

  const employees = spreadSettingsEmployees([...tBody.children]);

  const counter = [...counterClicks(sortName)];

  if (counter[counter.length - 2] === sortName) {
    reRenderTableBody(employees, sortName, true);
  } else {
    reRenderTableBody(employees, sortName);
  }
});

/* ----------------------------------------------------------- */

tBody.addEventListener('click', (e) => {
  [...tBody.children].forEach((tr) => {
    tr.classList.remove('active');
  });

  e.target.closest('tr').classList.add('active');
});

function addForm(selector) {
  const markUpForm = `
      <form
      action="#"
      class="new-employee-form"
    >
      <label> Name:
        <input
          type="text"
          data-qa="name"
          required
        >
      </label>
      <label> Position:
        <input
          type="text"
          data-qa="position"
          required
        >
      </label>
      <label>
        Office:
        <select
          name="office"
          data-qa="office"
          required
        >
          <option
            value="Tokyo"
            selected
          >Tokyo</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="Singapure">Singapure</option>
          <option value="San Francisco">San Francisco</option>
        </select>
      </label>
      <label> Age:
        <input
          type="number"
          data-qa="age"
          required
        >
      </label>
      <label> Salary
        <input
          type="number"
          data-qa="salary"
          required
        >
      </label>
      <button type="submit">Save to table</button>
    </form>
  `;

  selector.insertAdjacentHTML('afterend', markUpForm);

  const formEmployee = document.querySelector('form');

  formEmployee.style.opacity = 0;
  formEmployee.style.transition = 'all 1.0s';

  setTimeout(() => {
    formEmployee.style.opacity = 1;
  }, 500);
}

addForm(table);

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const inputs = [...form.elements];

  const newEmployee = [];

  inputs.forEach((input) => {
    newEmployee.push(input.value);
  });

  newEmployee.splice(-1);

  const [flag, notification] = validationValues(newEmployee);

  if (flag) {
    table.insertAdjacentHTML('afterend', notification);

    const notif = document.querySelector('.notification');

    notif.style.zIndex = 99;

    setTimeout(() => {
      notif.remove();
    }, 2000);

    addEmployeeToTable(newEmployee);
    form.reset();
  } else {
    table.insertAdjacentHTML('afterend', notification);

    const notif = document.querySelector('.notification');

    notif.style.zIndex = 99;

    setTimeout(() => {
      notif.remove();
    }, 2000);
  }
});

function validationValues(newEmployee) {
  const [name, position, office, age, salary] = newEmployee;
  let notification = `
     <div class="notification success" data-qa="notification">
       <h1 class="title">Sucsess</h1>
       <p>Employee has been added</p>
    </div>
    `;

  if (name.length < 4) {
    notification = `
    <div class="notification error" data-qa="notification">
      <h1 class="title">Error</h1>
      <p><b>Name</b> value less than 4 letters</p>
   </div>
   `;

    return [false, notification];
  }

  if (+age < 18 || +age > 90) {
    notification = `
    <div class="notification error" data-qa="notification">
      <h1 class="title">Error</h1>
      <p><b>Age</b> value is less than 18 or more than 90</p>
   </div>
   `;

    return [false, notification];
  }

  return [true, notification];
}

function addEmployeeToTable(newEmployee) {
  const tbody = document.querySelector('table tbody');

  const tr = document.createElement('tr');

  newEmployee.forEach((item, i, arr) => {
    if (i === arr.length - 1) {
      // eslint-disable-next-line no-param-reassign
      item = '$' + (+item).toLocaleString('en-US');
    }
    tr.insertAdjacentHTML('beforeend', `<td>${item}</td>`);
  });

  tbody.insertAdjacentElement('beforeend', tr);
}

/*

// function addButtonForm() {
//   const buttonCreateForm = document.createElement('button');

//   buttonCreateForm.innerText = 'Add Form';
//   buttonCreateForm.classList.add('button');
//   buttonCreateForm.style.cssText = `box-sizing: border-box;color: #fff;    cursor: pointer;    background: #e25644;    border: 2px solid #0000;    border-radius: 10px ;  margin-left: 10px;    padding: 8px 0;    font-family: Roboto, sans-serif;    font-size: 14px;    font-weight: 700;    transition: color .25s, background .25s, border .25s; align-self: flex-start; min-width: 100px`;
//   table.insertAdjacentElement('afterend', buttonCreateForm);
// }

// function changeButtonForm() {
//   const buttonCreateForm = document.createElement('button');

//   console.log(buttonCreateForm)
//   buttonCreateForm.innerText = 'Remove Form';
// }

*/

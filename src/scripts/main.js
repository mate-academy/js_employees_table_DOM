'use strict';

const tHead = document.querySelector('thead');
const tBody = document.querySelector('tbody');

let countClickName = 0;
let countClickPosition = 0;
let countClickOffice = 0;
let countClickAge = 0;
let countClickSalary = 0;

tHead.addEventListener('click', (e) => {
  const rowsList = tBody.querySelectorAll('tr');
  const sorted = [...rowsList];

  switch (e.target.textContent) {
    case 'Name':
      countClickName++;
      countClickPosition = 0;
      countClickOffice = 0;
      countClickAge = 0;
      countClickSalary = 0;

      sorted.sort((a, b) => {
        return a.cells[0].textContent.localeCompare(b.cells[0].textContent);
      });

      if (countClickName % 2 === 0) {
        sorted.sort((a, b) => {
          return b.cells[0].textContent.localeCompare(a.cells[0].textContent);
        });
      };
      break;

    case 'Position':
      countClickName = 0;
      countClickPosition++;
      countClickOffice = 0;
      countClickAge = 0;
      countClickSalary = 0;

      sorted.sort((a, b) => {
        return a.cells[1].textContent.localeCompare(b.cells[1].textContent);
      });

      if (countClickPosition % 2 === 0) {
        sorted.sort((a, b) => {
          return b.cells[1].textContent.localeCompare(a.cells[1].textContent);
        });
      };
      break;

    case 'Office':
      countClickName = 0;
      countClickPosition = 0;
      countClickOffice++;
      countClickAge = 0;
      countClickSalary = 0;

      sorted.sort((a, b) => {
        return a.cells[2].textContent.localeCompare(b.cells[2].textContent);
      });

      if (countClickOffice % 2 === 0) {
        sorted.sort((a, b) => {
          return b.cells[2].textContent.localeCompare(a.cells[2].textContent);
        });
      };
      break;

    case 'Age':
      countClickName = 0;
      countClickPosition = 0;
      countClickOffice = 0;
      countClickAge++;
      countClickSalary = 0;

      sorted.sort((a, b) => {
        const letterA = +a.cells[3].textContent;
        const letterB = +b.cells[3].textContent;

        return letterA - letterB;
      });

      if (countClickAge % 2 === 0) {
        sorted.sort((a, b) => {
          const letterA = +a.cells[3].textContent;
          const letterB = +b.cells[3].textContent;

          return letterB - letterA;
        });
      };
      break;

    case 'Salary':
      countClickName = 0;
      countClickPosition = 0;
      countClickOffice = 0;
      countClickAge = 0;
      countClickSalary++;

      const re = /,/gi;

      sorted.sort((a, b) => {
        const letterA = +a.cells[4].textContent.replace(re, '').slice(1);
        const letterB = +b.cells[4].textContent.replace(re, '').slice(1);

        if (countClickSalary % 2 === 0) {
          return -1 * (letterA - letterB);
        }

        return letterA - letterB;
      });
      break;
  }

  tBody.append(...sorted);
});

tBody.addEventListener('click', (e) => {
  const rowsList = tBody.querySelectorAll('tr');

  for (const row of rowsList) {
    row.classList.remove('active');
  }

  e.target.parentNode.className = 'active';
});

document.body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form">
    <label>
      Name:
      <input
        name="name"
        data-qa="name"
        required
        minlength="4"
      >
    </label>

    <label>Position: <input name="position" data-qa="position" required></label>

    <label>Office: 
      <select name="office" data-qa="office" required>
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    
    <label>
      Age: 
      <input
        type="number"
        name="age"
        data-qa="age"
        required
      >
    </label>

    <label>
      Salary:
      <input
        type="number"
        name="salary"
        data-qa="salary"
        required
      >
    </label>

    <button>Save to table</button>
  </form>
`);

const form = document.querySelector('form');
const notification = document.createElement('div');

notification.className = 'new-employee-form';
notification.setAttribute('data-qa', 'notification');
notification.style.fontWeight = 'bold';
notification.style.fontSize = '20px';
notification.style.position = 'absolute';
notification.style.top = '440px';
notification.style.visibility = 'hidden';

document.body.append(notification);

tBody.addEventListener('dblclick', (e) => {
  const initialText = e.target.innerText;
  const cellInput = document.createElement('input');

  e.target.innerText = '';
  cellInput.classList.add('cell-input');

  e.target.appendChild(cellInput);
  cellInput.focus();

  cellInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      e.target.textContent = ev.target.value;

      if (ev.target.value === '') {
        e.target.innerText = initialText;
      }
    }
  });

  cellInput.addEventListener('blur', (ev) => {
    e.target.innerText = ev.target.value;

    if (cellInput.value === '') {
      e.target.innerText = initialText;
    }
  });
});

const button = document.querySelector('button');

button.addEventListener('click', (e) => {
  e.preventDefault();
  pushNewEmployee();

  const formWidth = parseInt(window.getComputedStyle(form, null).width);
  const formPadding = parseInt(window.getComputedStyle(form, null).padding);
  const tbodyWidth = parseInt(window.getComputedStyle(tBody, null).width);
  const rightNotifPos
   = (window.innerWidth - (tbodyWidth + formWidth + formPadding)) / 2;

  notification.style.right = `${rightNotifPos}px`;
  notification.style.width = window.getComputedStyle(form, null).width;
});

function pushNewEmployee() {
  const newEmployee = validation(
    form.elements.name.value,
    form.elements.position.value,
    form.elements.age.value,
    form.elements.salary.value,
  );

  if (newEmployee.flag) {
    tBody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${form.elements.name.value}</td>
        <td>${form.elements.position.value}</td>
        <td>${form.elements.office.value}</td>
        <td>${form.elements.age.value}</td>
        <td>${salaryToString(form.elements.salary.value)}</td>
      </tr>
    `);
    notification.innerText = 'Sucsess!!! \n\n New employee added.';
    notification.classList.add('success');
    notification.style.visibility = 'visible';

    for (const el of form.elements) {
      if (el.name !== 'office') {
        el.value = '';
      }
    }

    setTimeout(() => {
      notification.style.visibility = 'hidden';
    }, 3000);
  } else {
    notification.innerText = newEmployee.description;
    notification.classList.add('error');
    notification.style.visibility = 'visible';
  }
}

function salaryToString(num, separ = ',') {
  const str = num.toString();
  let result = '';

  for (let i = 0; i < str.length / 3; i++) {
    result = separ + str.slice(-((i + 1) * 3), str.length - (i * 3)) + result;
  }

  return '$' + result.slice(1);
};

function validation(inputName, inputPosition, inputAge, inputSalary) {
  const result = {};

  result.flag = true;

  if (inputName.length < 4) {
    result.flag = false;
    result.description = 'Error!!!\n\nPut your name at least 4 letters!';
  }

  if (inputPosition === '') {
    result.description += '\n\nWhat is you job?';

    if (result.flag) {
      result.flag = false;
      result.description = 'Error!!!\n\nWhat is you job?';
    }
  }

  if (!inputAge) {
    result.description += '\n\nHow old are you?';

    if (result.flag) {
      result.flag = false;
      result.description = 'Error!!!\n\nHow old are you?';
    }
  }

  if (inputAge < 18 && inputAge > 0) {
    result.description += '\n\nGrow up a little...';

    if (result.flag) {
      result.flag = false;
      result.description = 'Error!!!\n\nGrow up a little...';
    }
  }

  if (inputAge > 90) {
    result.description += '\n\nSee you next life...';

    if (result.flag) {
      result.flag = false;
      result.description = 'Error!!!\n\nSee you next life...';
    }
  }

  if (!inputSalary) {
    result.description += '\n\nEvery man has his price...';

    if (result.flag) {
      result.flag = false;
      result.description = 'Error!!!\n\nEvery man has his price...';
    }
  }

  return result;
};

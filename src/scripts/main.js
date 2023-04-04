'use strict';

const headerList = [...document.querySelectorAll('th')];
const listBody = document.querySelector('tbody');
let list = [...document.querySelectorAll('tr')].slice(1, -1);
let headerIndex;
const formButton = document.querySelector('.form-button');
let errors = '';

document.addEventListener('click', sort);
document.addEventListener('click', doHighlight);
document.addEventListener('dblclick', cellRevision);
formButton.addEventListener('click', addNewPerson);

function cellRevision(e) {
  if (e.target.tagName === 'TD') {
    const cell = e.target;
    const perent = e.target.closest('TR');
    const select = document.querySelector('select');
    const selectCopy = select.cloneNode(true);
    const input = perent.children[2] === cell
      ? selectCopy : document.createElement('input');
    const startValue = cell.innerHTML;

    input.classList.add('cell-input');
    input.value = startValue;
    cell.innerHTML = '';
    cell.appendChild(input);
    cell.lastChild.focus();

    input.addEventListener('blur', () => {
      if (cell === perent.children[4]) {
        if (!+input.value.slice(1).replace(',', '')) {
          errors += 'Salary must be a number';
        }

        if (input.value[0] !== '$') {
          input.value = addCorrectSalary(input.value);
        }
      } else {
        perent.children[3] === cell
          ? checkAge(input.value) : checkString(input.value);
      }

      if (input.value === startValue) {
        return;
      }

      addNotification();

      if (!errors.length) {
        cell.innerHTML = input.value;
        errors = '';

        return;
      }

      cell.innerHTML = startValue;
      errors = '';
    });

    cell.addEventListener('keydown', (keyEvent) => {
      if (keyEvent.code === 'Enter') {
        if (cell === perent.children[4]) {
          if (!+input.value.slice(1).replace(',', '')) {
            errors += 'Salary must be a number';
          }

          if (input.value[0] !== '$') {
            input.value = addCorrectSalary(input.value);
          }
        } else {
          perent.children[3] === cell
            ? checkAge(input.value) : checkString(input.value);
        }

        if (input.value === startValue) {
          input.blur();

          return;
        }
        addNotification();

        if (!errors.length) {
          cell.innerHTML = input.value;
          errors = '';
        } else {
          cell.innerHTML = startValue;
          errors = '';
        }
      }
    }
    );
  }
}

function addNewPerson(e) {
  e.preventDefault();

  const inputs = document.querySelectorAll('.input');
  const personName = inputs[0].value;
  const position = inputs[1].value;
  const office = inputs[2].value;
  const age = inputs[3].value;
  const salary = inputs[4].value;

  checkString(personName, 'Name');
  checkString(position, 'Position');
  checkAge(age);

  const newPerson = `
  <tr>
  <td>${personName}</td>
  <td>${position}</td>
  <td>${office}</td>
  <td>${age}</td>
  <td>${addCorrectSalary(salary)}</td>
  </tr>
  `;

  addNotification();

  if (!errors.length) {
    listBody.insertAdjacentHTML('beforeend', newPerson);
    inputs.forEach(input => (input.value = ''));
    inputs[2].value = 'Tokyo';
  }
  errors = '';
}

function doHighlight(e) {
  if (e.target.tagName === 'TD') {
    const item = e.target.closest('TR');

    list.forEach(a => a.classList.remove('active'));

    item.classList.add('active');
  } else {
    list.forEach(a => a.classList.remove('active'));
  }
}

function sort(e) {
  list = [...document.querySelectorAll('tr')].slice(1, -1);

  if (e.target.tagName === 'TH') {
    const item = e.target;
    const indexForSort = headerList.indexOf(item);
    const sortElements = getSortList(indexForSort);

    listBody.innerHTML = '';

    if (indexForSort === headerIndex) {
      for (let i = list.length - 1; i >= 0; i--) {
        listBody.appendChild(sortElements[i]);
        headerIndex = null;
      }
    } else {
      headerIndex = indexForSort;

      for (let i = 0; i < list.length; i++) {
        listBody.appendChild(sortElements[i]);
      }
    }
  }
}

function getSortList(i) {
  list = [...document.querySelectorAll('tr')].slice(1, -1);

  let sortElements;

  if (i !== 4) {
    sortElements = list.sort((a, b) =>
      a.cells[i].innerHTML
        .localeCompare(b.cells[i].innerHTML));
  } else {
    sortElements = list.sort((a, b) =>
      getCorrectSalary(a.cells[i].innerHTML) - getCorrectSalary(
        b.cells[i].innerHTML));
  }

  return sortElements;
}

function getCorrectSalary(string) {
  let salary = '';

  for (let i = 0; i < string.length; i++) {
    if (string[i] !== '$' && string[i] !== ',') {
      salary += string[i];
    }
  }

  return +salary;
}

function checkString(string, input = 'Field') {
  const notValidCharacters = '?/|{:;})(*&^%$#@!~._-=+`"';

  if (string[0] === ' ') {
    errors += `${input} must start with a letter \n`;

    return;
  }

  if (string.length < 4) {
    errors += `${input}  must be at least 4 in length \n`;

    return;
  }

  for (const ch of string) {
    if (notValidCharacters.includes(ch)) {
      errors += `Characters in ${input} are not allowed\n`;

      return;
    }

    if (+ch === Number(ch) && ch !== ' ') {
      errors += `Numbers in ${input} are not supported\n`;

      return;
    }
  }
}

function checkAge(number) {
  if (!+number) {
    return (errors += `Age must be a number \n`);
  }

  if (+number < 18 || +number > 90) {
    return (errors += `Age must be between 18 and 90 \n`);
  }
}

function addCorrectSalary(string) {
  let formatSalary = '$';

  for (let i = 0; i < string.length; i++) {
    if (i === string.length - 4) {
      formatSalary += (string[i] + ',');
    } else {
      formatSalary += string[i];
    }
  }

  return formatSalary;
}

function addNotification() {
  if (document.querySelector('.notification')) {
    document.querySelector('.notification').remove();
  }

  const success = `
    <div class="notification success" data-qa="notification">
      <h2 class="title">Data saved</h2>
    </div>`;

  const error = `
    <div 
      class="notification error" data-qa="notification">
      <h2 class="title" style = "margin: 0">
      Error
      </h2>
      <p style = "margin-top: 0;">${errors}</p>
    </div>`;

  const notification = !errors.length ? success : error;

  document.body.insertAdjacentHTML('beforeend', notification);

  setTimeout(() => {
    if (document.querySelector('.notification')) {
      document.querySelector('.notification').remove();
    }
  }, 2000);
}

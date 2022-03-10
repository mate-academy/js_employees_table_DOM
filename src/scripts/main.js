'use strict';

// write code here
const th = document.querySelectorAll('th');

const NAME_ASC = 'NAME_ASC';
const NAME_DES = 'NAME_DES';
const POSITION_ASC = 'POSITION_ASC';
const POSITION_DES = 'POSITION_DES';
const OFFICE_ASC = 'OFFICE_ASC';
const OFFICE_DES = 'OFFICE_DES';
const AGE_ASC = 'AGE_ASC';
const AGE_DES = 'AGE_DES';
const SALARY_ASC = 'SALARY_ASC';
const SALARY_DES = 'SALARY_DES';
let sortOrder;

for (let i = 0; i < 4; i++) {
  th[i].onclick = () => {
    let mul = 1;

    switch (i) {
      case 0:
        if (sortOrder === NAME_ASC) {
          sortOrder = NAME_DES;
          mul = -1;
        } else {
          sortOrder = NAME_ASC;
        }
        break;
      case 1:
        if (sortOrder === POSITION_ASC) {
          sortOrder = POSITION_DES;
          mul = -1;
        } else {
          sortOrder = POSITION_ASC;
        }
        break;
      case 2:
        if (sortOrder === OFFICE_ASC) {
          sortOrder = OFFICE_DES;
          mul = -1;
        } else {
          sortOrder = OFFICE_ASC;
        }
        break;
      case 3:
        if (sortOrder === AGE_ASC) {
          sortOrder = AGE_DES;
          mul = -1;
        } else {
          sortOrder = AGE_ASC;
        }
        break;
    }

    const tBodyChildren = Array.from(document.querySelector('tbody').children);

    tBodyChildren.sort((a, b) => {
      const num1 = a.children[i].innerText;
      const num2 = b.children[i].innerText;

      if (i === 3) {
        return (+num1 - +num2) * mul;
      }

      return num1.localeCompare(num2) * mul;
    });
    document.querySelector('tbody').append(...tBodyChildren);
  };
}

th[4].onclick = () => {
  let mul = 1;

  if (sortOrder === SALARY_ASC) {
    sortOrder = SALARY_DES;
    mul = -1;
  } else {
    sortOrder = SALARY_ASC;
  }

  const tBodyChildren = Array.from(document.querySelector('tbody').children);

  tBodyChildren.sort((a, b) => {
    const num1 = +a.children[4].innerText.replace(/[^0-9.-]+/g, '');
    const num2 = +b.children[4].innerText.replace(/[^0-9.-]+/g, '');

    return mul * (num1 - num2);
  });

  document.querySelector('tbody').append(...tBodyChildren);
};

const pushNotification = (posTop, posRight, title, description, type) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.classList.add('notification', `${type}`);
  div.setAttribute('data-qa', 'notification');
  h2.textContent = title;
  h2.classList.add('title');
  p.textContent = description;
  div.append(h2, p);

  div.style.cssText = `position: absolute; 
                       top: ${posTop}px; 
                       right: ${posRight}px`;

  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 2000);
};

const tBody = document.querySelector('tbody');

tBody.addEventListener('click', e => {
  const elem = e.target;
  const activeElem = tBody.querySelector('tr.active');

  if (activeElem) {
    activeElem.classList.remove('active');
  }
  elem.parentElement.classList.add('active');
});

tBody.addEventListener('dblclick', e => {
  const elem = e.target;

  if (elem === elem.parentElement.children[0]
    || elem === elem.parentElement.children[1]) {
    elem.innerHTML = `<input class="cell-input" value="${elem.innerHTML}">`;

    elem.firstChild.addEventListener('blur', () => {
      if (!elem.firstChild.value) {
        pushNotification(450, 200,
          'Error message', 'All fields are required', 'error');
      } else if (elem === elem.parentElement.children[0]
      && elem.firstChild.value.length < 4) {
        pushNotification(450, 200,
          'Error message', 'Name is too short', 'error');
      } else {
        elem.innerHTML = elem.firstChild.value;
      }
    });
    elem.firstChild.addEventListener('keydown', pressEnter);
  }

  if (elem === elem.parentElement.children[2]) {
    elem.innerHTML = `<select class="cell-input">
      <option> Tokyo </option>
      <option> Singapore </option>
      <option> London </option>
      <option> New York </option>
      <option> Edinburgh </option>
      <option> San Francisco </option>
    </select>`;

    elem.firstChild.addEventListener('blur', () => {
      elem.innerHTML = elem.firstChild.value;
    });
    elem.firstChild.addEventListener('keydown', pressEnter);
  }

  if (elem === elem.parentElement.children[3]) {
    elem.innerHTML = `<input type="number" class="cell-input" 
      value="${elem.innerHTML}">`;

    elem.firstChild.addEventListener('blur', () => {
      if (!elem.firstChild.value) {
        pushNotification(450, 200,
          'Error message', 'All fields are required', 'error');
      } else {
        elem.innerHTML = elem.firstChild.value;
      }
    });
    elem.firstChild.addEventListener('keydown', pressEnter);
  }

  if (elem === elem.parentElement.children[4]) {
    elem.innerHTML = `<input type="number" class="cell-input" 
    value="${elem.innerHTML.replace(/\D/g, '')}">`;

    elem.firstChild.addEventListener('blur', () => {
      if (!elem.firstChild.value) {
        pushNotification(450, 200,
          'Error message', 'All fields are required', 'error');
      } else {
        elem.innerHTML = `$
        ${Number(elem.firstChild.value).toLocaleString('en-US')}`;
      }
    });
    elem.firstChild.addEventListener('keydown', pressEnter);
  }
});

function pressEnter(e) {
  if (e.keyCode === 13) {
    e.target.blur();
  }
}

const form = document.createElement('div');

form.classList.add('new-employee-form');

form.innerHTML = `
<label> Name: 
<input id="nameInput" name="name" type="text" data-qa="name"></label>
<label> Position: <input 
id="positionInput" name="position" type="text" data-qa="position"></label>
<label>Office: 
        <select data-qa="office"  id="officeInput">
            <option> Tokyo </option>
            <option> Singapore </option>
            <option> London </option>
            <option> New York </option>
            <option> Edinburgh </option>
            <option> San Francisco </option>
        </select>
        </label>
        <label>Age: 
        <input id="ageInput" name="age" type="number" data-qa="age"></label>
        <label> Salary: <input 
        id="salaryInput" name="salary" type="number" data-qa="salary"></label>
        <button id='submitForm'> Save to table </button>
`;

document.body.appendChild(form);

const submitButton = document.querySelector('button');

submitButton.onclick = () => {
  const newTr = document.createElement('tr');

  newTr.innerHTML = `
  <td>${document.getElementById('nameInput').value}</td>
  <td>${document.getElementById('positionInput').value}</td>
  <td>${document.getElementById('officeInput').value}</td>
  <td>${document.getElementById('ageInput').value}</td>
  <td>$${Number(document.getElementById('salaryInput').value)
    .toLocaleString('en-US')}</td>
  `;

  if (!document.getElementById('nameInput').value
  || !document.getElementById('positionInput').value
  || !document.getElementById('officeInput').value
  || !document.getElementById('ageInput').value
  || !document.getElementById('salaryInput').value) {
    pushNotification(450, 270,
      'Error message', 'All fields are required', 'error');
  } else if (document.getElementById('nameInput').value.length < 4) {
    pushNotification(450, 270, 'Error message', 'Name is too short', 'error');
  } else if (document.getElementById('ageInput').value < 18
  || document.getElementById('ageInput').value > 90) {
    pushNotification(450, 270,
      'Error message', 'Please enter valid age', 'error');
  } else {
    tBody.append(newTr);

    pushNotification(450, 270,
      'Success message', 'Your data have been added', 'success');
  }
};

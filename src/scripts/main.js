'use strict';

const peopleList = [...document.querySelector('tbody').children];
const propertyNames = [...document.querySelector('tr').children].map(
  el => el.innerText.toLowerCase());
let propertyList = [];

peopleList.forEach((el, index) => {
  propertyList.push({
    name: el.children[0].textContent,
    position: el.children[1].textContent,
    office: el.children[2].textContent,
    age: +el.children[3].textContent,
    salary: +el.children[4].textContent.replace(/\D/g, ''),
    id: index,
  });
});

let current;

[...document.querySelector('tr').children].forEach((el, index) => {
  const key = propertyNames[index];

  el.addEventListener('click', (e) => {
    propertyList = propertyList.sort((a, b) => {
      if (typeof a[key] === 'number') {
        return a[key] - b[key];
      }

      return a[key].localeCompare(b[key]);
    });

    if (current === e.target) {
      propertyList = propertyList.reverse();
    }

    if (!current) {
      current = e.target;
    } else {
      current = undefined;
    }

    const newPeopleList = [];

    for (let i = 0; i < peopleList.length; i++) {
      newPeopleList.push(peopleList[propertyList[i].id]);
    }

    document.querySelector('tbody').append(...newPeopleList);
  });
});

document.querySelector('tbody').addEventListener('click', (clickEvent) => {
  if (clickEvent.target.cellIndex) {
    [...document.querySelector('tbody').children].forEach(el => {
      el.classList.remove('active');
    });
  }

  clickEvent.target.parentElement.classList.add('active');
});

document.querySelector('body').insertAdjacentHTML('beforeend', `
  <form action="#" class="new-employee-form">
    <label>Name: <input type="text" data-qa="name"></label>
    <label>Position: <input type="text"  data-qa="position"></label>
    <label>Office:
      <select name="office" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select></label>
    <label>
    Age: <input type="number" data-qa="age"></label>
    <label>Salary: <input type="number" data-qa="salary"></label>
    <button type="submit">Save to table</button>
  </form>
`);

const pushNotification = (description, type) => {
  const notification = document.createElement('section');

  notification.innerHTML = `
    <h2 class="title">${type === 'error' ? 'Error' : 'Success'}</h2>
    <p>${description}</p>
  `;
  notification.classList.add('notification', type);
  notification.style.top = `${10}px`;
  notification.style.right = `${10}px`;
  document.querySelector('body').append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

const form = document.querySelector('form');
const inputs = [...document.querySelectorAll('input')];

form.addEventListener('submit', (submitEvent) => {
  submitEvent.preventDefault();

  if (inputs.some(input => input.value.length === 0)) {
    pushNotification('All fields must be filled', 'error');

    return;
  }

  if (inputs[0].value.length < 4) {
    pushNotification('Name must consist of at least 4 characters', 'error');

    return;
  }

  if (+inputs[2].value < 18 || +inputs[2].value > 90) {
    pushNotification('Age must be between 18 and 90', 'error');

    return;
  }

  const newPerson = document.createElement('tr');

  newPerson.innerHTML = `
    <td>${form.children[0].lastChild.value}</td>
    <td>${form.children[1].lastChild.value}</td>
    <td>${form.children[2].lastChild.value}</td>
    <td>${form.children[3].lastChild.value}</td>
    <td>$${Number(
    form.children[4].lastChild.value).toLocaleString('en-US')}</td>
  `;

  document.querySelector('tbody').append(newPerson);
  peopleList.push(newPerson);

  propertyList.push({
    name: form.children[0].lastChild.value,
    position: form.children[1].lastChild.value,
    office: form.children[2].lastChild.value,
    age: +form.children[3].lastChild.value,
    salary: +form.children[3].lastChild.value,
    id: propertyList.length,
  });

  form.reset();
  pushNotification('Added to the table', 'success');
});

let newValue;
let initialValue;

document.querySelector('tbody').addEventListener('dblclick', (clickEvent) => {
  const targetText = clickEvent.target.innerText;

  initialValue = clickEvent.target.cellIndex !== 4
    ? targetText
    : targetText.replace(/\D/g, '');

  clickEvent.target.classList.add('edit');

  if (clickEvent.target.cellIndex === 2) {
    clickEvent.target.innerHTML = `
    <select name="age" value="${targetText}" class="cell-input edit">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
    `;

    [...clickEvent.target.children[0].children].forEach(option => {
      if (option.value === initialValue) {
        option.setAttribute('selected', 'true');
      }
    });
  } else if (clickEvent.target.cellIndex > 2) {
    clickEvent.target.innerHTML = `
    <input type="number" class="cell-input edit" value="${
  targetText.replace(/\D/g, '')}">
    `;
  } else {
    clickEvent.target.innerHTML = `
    <input type="text" class="cell-input edit" value="${
  targetText}">
    `;
  }
});

function saveEdit(condition) {
  if (condition) {
    [...document.querySelectorAll('td')].forEach(el => {
      if (el.childNodes.length === 3) {
        const editRowId = el.parentElement.rowIndex - 1;
        const editCell = el.cellIndex;

        el.classList.remove('edit');

        newValue = el.children[0].value.length
          ? el.children[0].value
          : initialValue;

        if (editCell === 0 && newValue.length < 4) {
          newValue = initialValue;

          pushNotification(
            'Name must consist of at least 4 characters', 'error');
        }

        if (editCell === 3 && (newValue < 18 || newValue > 90)) {
          newValue = initialValue;

          pushNotification('Age must be between 18 and 90', 'error');
        }

        if (editCell === 4) {
          newValue = `$${Number(newValue).toLocaleString()}`;
        }

        switch (el.cellIndex) {
          case 0:
            propertyList[editRowId].name = newValue;
            break;

          case 1:
            propertyList[editRowId].position = newValue;
            break;

          case 2:
            propertyList[editRowId].office = newValue;
            break;

          case 3:
            propertyList[editRowId].age = +newValue;
            break;

          default:
            propertyList[editRowId].salary = +newValue.replace(/\D/g, '');
        }

        el.innerHTML = `
        ${newValue}
      `;
      } else {
        el.innerHTML = `
        ${el.innerText}
      `;
      }
    });
  }
}

document.querySelector('body').addEventListener('click', (clickEvent) => {
  saveEdit(!clickEvent.target.classList.contains('edit'));
});

document.querySelector('body').addEventListener('keypress', (clickEvent) => {
  saveEdit(clickEvent.key === 'Enter');
});

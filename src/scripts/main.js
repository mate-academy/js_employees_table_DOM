'use strict';

const head = document.querySelector('thead');
const table = document.querySelector('table');
const tBody = table.children[1];
const headers = [...head.firstElementChild.children];
const rows = [...tBody.querySelectorAll('tr')];

let lastEvent = null;

head.addEventListener('click', (event) => {
  if (event.target.tagName !== 'TH') {
    return;
  };

  const index = headers.indexOf(event.target);
  const rowContent = [...rows[0].children][index].textContent;

  if (lastEvent !== event.target) {
    lastEvent = event.target;

    if (parseFloat(rowContent.match(/\w/g).join(''))) {
      rows.sort((a, b) => {
        const aValue = [...a.children][index].textContent.match(/\w/g);
        const bValue = [...b.children][index].textContent.match(/\w/g);

        return Number(aValue.join('')) - Number(bValue.join(''));
      });
    } else {
      rows.sort((a, b) => {
        const aValue = [...a.children][index].textContent;
        const bValue = [...b.children][index].textContent;

        return aValue.localeCompare(bValue);
      });
    }

    tBody.append(...rows);
  } else {
    lastEvent = null;

    if (parseFloat(rowContent.match(/\w/g).join(''))) {
      rows.sort((a, b) => {
        const aValue = [...a.children][index].textContent.match(/\w/g);
        const bValue = [...b.children][index].textContent.match(/\w/g);

        return Number(bValue.join('')) - Number(aValue.join(''));
      });
    } else {
      rows.sort((a, b) => {
        const aValue = [...a.children][index].textContent;
        const bValue = [...b.children][index].textContent;

        return bValue.localeCompare(aValue);
      });
    }

    tBody.append(...rows);
  }
});

table.addEventListener('click', (event) => {
  if (!event.target.closest('TR') || event.target.tagName === 'TH') {
    return;
  }

  const chosenRow = event.target.closest('TR');
  const previousChosen = table.querySelector('.active');

  if (previousChosen) {
    previousChosen.classList.remove('active');
  }
  chosenRow.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

document.body.append(form);

form.innerHTML = `
<label>
  Name:
  <input
    required
    name="name"
    type="text"
  >
</label>
<label>
  Position:
  <input
    required
    name="position"
    type="text"
  >
</label>
<label>
  Office:
  <select required name="office">
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
    required
    name="age"
    type="number"
  >
</label>
<label>
  Salary:
  <input
    required
    name="salary"
    type="number"
  >
</label>
<button type="submit">Save to table</button>
`;

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (form.children[0].firstElementChild.value.length < 4) {
    pushNotification(0, 50, 'Invalid name', `
    Please enter your correct name of minimum 4 characters!`, 'error');

    return;
  }

  const inputAge = form.children[3].firstElementChild.value;
  const inputSalary = form.children[4].firstElementChild.value;

  if (inputAge < 18 || inputAge > 90) {
    pushNotification(0, 50, 'Invalid age', `
    Please enter your correct age between 18 and 90!`, 'error');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${form.children[0].firstElementChild.value}</td>
    <td>${form.children[1].firstElementChild.value}</td>
    <td>${form.children[2].firstElementChild.value}</td>
    <td>${form.children[3].firstElementChild.value}</td>
    <td>$${Number(inputSalary).toLocaleString()}</td>
  `;

  tBody.append(newRow);
  pushNotification(0, 50, 'Done!', 'Thank you for choosing us!', 'success');
});

function pushNotification(top, right, title, description, type) {
  const note = document.createElement('div');

  note.style.top = top + 'px';
  note.style.right = right + 'px';
  note.classList.add(type);
  note.classList.add('notification');

  const noteTitle = document.createElement('h2');

  noteTitle.innerText = title;

  const noteText = document.createElement('p');

  noteText.innerText = description;
  document.body.append(note);
  note.append(noteTitle);
  note.append(noteText);
  setTimeout(() => note.remove(), 2000);
};

tBody.addEventListener('dblclick', event => {
  if (event.target.tagName !== 'TD') {
    return;
  }

  const focusedText = event.target.innerHTML;

  event.target.innerHTML = `
  <input
    type="text"
    class="cell-input"
    value="${focusedText}"
  >
  `;

  const focusedInput = event.target.firstElementChild;
  const target = event.target;

  focusedInput.addEventListener('blur', e => {
    if (focusedInput.value) {
      target.innerHTML = focusedInput.value;
    } else {
      target.innerHTML = focusedText;
    }
  });

  focusedInput.addEventListener('keyup', e => {
    if (e.code !== 'Enter') {
      return;
    }

    if (focusedInput.value) {
      target.innerHTML = focusedInput.value;
    } else {
      target.innerHTML = focusedText;
    }
  });
});

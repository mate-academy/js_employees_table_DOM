'use strict';

const table = document.querySelector(`table`);
const bodyOfTable = document.querySelector(`tbody`);
const people = bodyOfTable.querySelectorAll(`tr`);
const peopleArr = [...people];
let previousClickedEl;
let firstClick = true;

// Headers sort
table.addEventListener(`click`, (event1) => {
  if (event1.target.tagName !== `TH`) {
    return;
  }

  if (event1.target.textContent === `Name`) {
    peopleArr.sort((a, b) => {
      const nameA = a.children[0].textContent;
      const nameB = b.children[0].textContent;

      if (previousClickedEl !== `Name`) {
        firstClick = true;

        return nameA.localeCompare(nameB);
      }

      return firstClick === true ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
    previousClickedEl = event1.target.textContent;
    firstClick = !firstClick;
  }

  if (event1.target.textContent === `Position`) {
    peopleArr.sort((a, b) => {
      const positionA = a.children[1].textContent;
      const positionB = b.children[1].textContent;

      if (previousClickedEl !== `Position`) {
        firstClick = true;

        return positionA.localeCompare(positionB);
      }

      return firstClick === true ? positionA.localeCompare(positionB)
        : positionB.localeCompare(positionA);
    });
    previousClickedEl = event1.target.textContent;
    firstClick = !firstClick;
  }

  if (event1.target.textContent === `Office`) {
    peopleArr.sort((a, b) => {
      const positionA = a.children[2].textContent;
      const positionB = b.children[2].textContent;

      if (previousClickedEl !== `Office`) {
        firstClick = true;

        return positionA.localeCompare(positionB);
      }

      return firstClick === true ? positionA.localeCompare(positionB)
        : positionB.localeCompare(positionA);
    });
    previousClickedEl = event1.target.textContent;
    firstClick = !firstClick;
  }

  if (event1.target.textContent === `Age`) {
    peopleArr.sort((a, b) => {
      const ageA = a.children[3].textContent;
      const ageB = b.children[3].textContent;

      if (previousClickedEl !== `Age`) {
        firstClick = true;

        return Number(ageA) - Number(ageB);
      }

      return firstClick === true ? Number(ageA) - Number(ageB)
        : Number(ageB) - Number(ageA);
    });
    previousClickedEl = event1.target.textContent;
    firstClick = !firstClick;
  }

  if (event1.target.textContent === `Salary`) {
    peopleArr.sort((a, b) => {
      const sallaryA = a.children[4].textContent.replace(/[$,]/g, ``);
      const sallaryB = b.children[4].textContent.replace(/[$,]/g, ``);

      if (previousClickedEl !== `Salary`) {
        firstClick = true;

        return Number(sallaryA) - Number(sallaryB);
      }

      return firstClick === true ? Number(sallaryA) - Number(sallaryB)
        : Number(sallaryB) - Number(sallaryA);
    });
    previousClickedEl = event1.target.textContent;
    firstClick = !firstClick;
  }

  for (const el of peopleArr) {
    bodyOfTable.append(el);
  }
});

// Rows selecting
bodyOfTable.addEventListener(`click`, (event1) => {
  if (event1.target.tagName !== `TD`) {
    return;
  }

  const arr = [...bodyOfTable.children];

  for (const el of arr) {
    el.className = el.className === `active` ? `` : ``;
  }
  event1.target.parentNode.className = `active`;
});

// Created form
const body = document.querySelector(`body`);
const form = document.createElement(`form`);

form.method = `GET`;
form.className = `new-employee-form`;
body.append(form);

const label = document.createElement(`label`);
const input = document.createElement(`input`);

label.append(input);

form.append(label.cloneNode(true), label.cloneNode(true), label.cloneNode(true),
  label.cloneNode(true));

const labels = document.querySelectorAll(`label`);

labels[0].children[0].setAttribute(`name`, `name`);
labels[0].children[0].setAttribute(`type`, `text`);
labels[0].insertAdjacentHTML(`afterbegin`, `Name:`);
labels[0].children[0].dataset.qa = `name`;
labels[1].children[0].setAttribute(`position`, `position`);
labels[1].children[0].setAttribute(`type`, `text`);
labels[1].insertAdjacentHTML(`afterbegin`, `Position:`);
labels[1].children[0].dataset.qa = `position`;
labels[2].children[0].setAttribute(`age`, `age`);
labels[2].children[0].setAttribute(`type`, `number`);
labels[2].insertAdjacentHTML(`afterbegin`, `Age:`);
labels[2].children[0].dataset.qa = `age`;
labels[3].children[0].setAttribute(`salary`, `salary`);
labels[3].children[0].setAttribute(`type`, `number`);
labels[3].insertAdjacentHTML(`afterbegin`, `Salary:`);
labels[3].children[0].dataset.qa = `salary`;

const select = document.createElement(`select`);

select.dataset.qa = `office`;

select.innerHTML = `
<option value="Tokyo">Tokyo</option>
<option value="Singapore">Singapore</option>
<option value="London">London</option>
<option value="New York">New York</option>
<option value="Edinburgh">Edinburgh</option>
<option value="San Francisco">San Francisco</option>
`;

const labelForSelect = document.createElement(`label`);

labelForSelect.textContent = `Office:`;
labelForSelect.append(select);

form.insertBefore(labelForSelect, labels[2]);

const button = document.createElement(`button`);

form.append(button);
button.textContent = `Save to table`;

button.type = `submit`;

// handler for form
form.addEventListener(`submit`, (event1) => {
  event1.preventDefault();

  const obj = {};

  for (const el of form.elements) {
    obj[el.dataset.qa] = el.value;
  }

  if (obj.name.length < 4 || obj.age < 18 || obj.age > 90
    || obj.position.length < 4) {
    pushNotification('Error',
      `Please, verify inputs 'Name', 'Position' and 'Age'`,
      'error');

    return;
  }

  pushNotification('Success', `You have successfuly added new employee.`,
    'success');

  const tr = document.createElement(`tr`);

  obj.salary = +obj.salary;

  tr.innerHTML = `
  <td>${obj.name}</td>
  <td>${obj.position}</td>
  <td>${obj.office}</td>
  <td>${obj.age}</td>
  <td>$${obj.salary.toLocaleString()}</td>
  `;

  peopleArr.push(tr);
  bodyOfTable.append(tr);
});

// Notification function
const pushNotification = (title, description, type) => {
  const div = document.createElement(`div`);

  div.classList.add(`notification`, type);
  div.dataset.qa = `notification`;

  div.innerHTML = `
  <h2 class = "title">${title}</h2>
  <p>${description}</p>`;

  div.style.top = `5px`;
  div.style.right = `10px`;
  div.style.minHeight = `50px`;
  div.style.width = `400px`;

  document.body.append(div);

  setTimeout(() => {
    div.hidden = true;
  }, 2000);
};

// editing of cells

bodyOfTable.addEventListener(`dblclick`, (event1) => {
  event1.preventDefault();

  const inputForCell = document.createElement(`input`);
  const previousText = event1.target.textContent;

  inputForCell.className = `cell-input`;
  inputForCell.value = previousText;

  const td = document.createElement(`td`);

  td.append(inputForCell);

  const arr = [...event1.target.parentNode.children];
  const index = arr.findIndex(el =>
    el.textContent === event1.target.textContent);

  const employee = event1.target.parentNode;

  event1.target.remove();
  employee.insertBefore(td, employee.children[index]);

  const initialText = arr[index].textContent;

  td.addEventListener(`keydown`, (event2) => {
    if (event2.key !== `Enter`) {
      return;
    };

    if (event2.target.value === ``) {
      event2.target.parentNode.textContent = initialText;
      event2.target.remove();

      return;
    };

    const enteredText = event2.target.value;

    event2.target.parentNode.textContent = enteredText;
    event2.target.remove();
  });

  td.addEventListener(`blur`, (event2) => {
    if (event2.target.value === ``) {
      event2.target.parentNode.textContent = initialText;
      event2.target.remove();

      return;
    };

    const enteredText = event2.target.value;

    event2.target.parentNode.textContent = enteredText;
    event2.target.remove();
  }, true);
});

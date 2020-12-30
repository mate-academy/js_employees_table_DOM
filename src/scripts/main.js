'use strict';

const table = document.querySelector(`table`);
const bodyOfTable = document.querySelector(`tbody`);
const people = bodyOfTable.querySelectorAll(`tr`);
const headers = table.querySelector(`thead`).querySelectorAll(`th`);
const peopleArr = [...people];
const headersArr = [...headers];
let sortedBy;

// Headers sort

const tableSort = function(header) {
  if (sortedBy !== header) {
    sortedBy = header;

    const index = headersArr.findIndex(el => {
      return el.textContent === header;
    });

    peopleArr.sort((a, b) => {
      const elA = a.children[index].textContent.replace(/[$,]/g, ``);
      const elB = b.children[index].textContent.replace(/[$,]/g, ``);

      if (header === `Salary` || header === `Age`) {
        return elA - elB;
      }

      return elA.localeCompare(elB);
    });
  } else {
    peopleArr.reverse();
  }
};

table.addEventListener(`click`, (event1) => {
  if (event1.target.tagName !== `TH`) {
    return;
  }
  tableSort(event1.target.textContent);

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
    el.className = `non-active`;
  }
  event1.target.parentNode.className = `active`;
});

// Created form
const form = document.createElement(`form`);

form.method = `GET`;
form.className = `new-employee-form`;
document.body.append(form);

const label = document.createElement(`label`);
const input = document.createElement(`input`);
const labelForSelect = document.createElement(`label`);

label.append(input);

labelForSelect.innerHTML = `
Office:
<select data-qa="office">
  <option value="Tokyo">Tokyo</option>
  <option value="Singapore">Singapore</option>
  <option value="London">London</option>
  <option value="New York">New York</option>
  <option value="Edinburgh">Edinburgh</option>
  <option value="San Francisco">San Francisco</option>
</select>
`;

form.append(label.cloneNode(true), label.cloneNode(true),
  labelForSelect, label.cloneNode(true), label.cloneNode(true));

const labels = document.querySelectorAll(`label`);

let i = 0;

for (const el of headers) {
  if (el.textContent === `Office`) {
    i++;
    continue;
  }

  labels[i].children[0].setAttribute(el.textContent.toLowerCase(),
    el.textContent.toLowerCase());

  labels[i].insertAdjacentHTML(`afterbegin`,
    `${el.textContent.toLowerCase()}:`);
  labels[i].children[0].dataset.qa = el.textContent.toLowerCase();

  if (el.textContent === `Name` || el.textContent === `Position`) {
    labels[i].children[0].setAttribute(`type`, `text`);
    i++;
  }

  if (el.textContent === `Age` || el.textContent === `Salary`) {
    labels[i].children[0].setAttribute(`type`, `number`);
    i++;
  }
}

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
  form.reset();
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

'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
let lastSortedIndex = null;
let isAsc = true;

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const index = th.cellIndex;

  if (index === lastSortedIndex) {
    isAsc = !isAsc;
  }

  if (index !== lastSortedIndex) {
    isAsc = true;
  }

  lastSortedIndex = index;

  let multiply = 1;

  if (isAsc) {
    multiply = 1;
  } else {
    multiply = -1;
  }

  const rows = [...tbody.querySelectorAll('tr')];

  if (index < 3) {
    rows.sort(
      (a, b) =>
        a.children[index].textContent.localeCompare(
          b.children[index].textContent,
        ) * multiply,
    );

    tbody.append(...rows);
  }

  if (index > 2) {
    rows.sort(
      (a, b) =>
        (+a.children[index].textContent
          .replaceAll('$', '')
          .replaceAll(',', '') -
          +b.children[index].textContent
            .replaceAll('$', '')
            .replaceAll(',', '')) *
        multiply,
    );

    tbody.append(...rows);
  }
});

tbody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  if (!tr) {
    return;
  }

  const allTr = tbody.querySelectorAll('tr');

  for (const element of allTr) {
    if (element.classList.contains('active')) {
      element.classList.remove('active');
    }
  }

  tr.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.noValidate = true;

form.innerHTML = `<label>
  Name:
  <input name="name" type="text" data-qa="name" required>
</label>
<label>
  Position:
  <input type="text" name="position" data-qa="position" required>
</label>
<label>
  Office:
  <select name="office" data-qa="office" required>
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
<button type="submit">Save to table</button>
`;

document.body.append(form);

const pushNotification = (title, description, type) => {
  const message = document.createElement('div');
  const titleMessage = document.createElement('h2');
  const descriptionMessage = document.createElement('p');

  titleMessage.textContent = title;
  descriptionMessage.textContent = description;

  message.className = 'notification';
  message.dataset.qa = 'notification';
  titleMessage.className = 'title';

  message.classList.add(type);

  message.append(titleMessage, descriptionMessage);

  document.body.append(message);

  setTimeout(() => {
    message.style.display = 'none';
  }, 2000);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = form.elements.name;
  const positionInput = form.elements.position;
  const ageInput = form.elements.age;
  const salaryInput = form.elements.salary;
  const officeInput = form.elements.office;

  const nameValue = nameInput.value;
  const ageValue = +ageInput.value;
  const positionValue = positionInput.value;
  const salaryValue = +salaryInput.value;
  const officeValue = officeInput.value;

  if (
    nameValue.length < 4 ||
    ageValue < 18 ||
    ageValue > 90 ||
    !positionValue ||
    !salaryValue ||
    salaryValue <= 0
  ) {
    pushNotification('Error', 'Data invalid', 'error');
  } else {
    const tr = document.createElement('tr');

    tr.innerHTML = `
    <td>${nameValue}</td>
    <td>${positionValue}</td>
    <td>${officeValue}</td>
    <td>${ageValue}</td>
    <td>$${salaryValue.toLocaleString('en-US')}</td>`;

    tbody.append(tr);

    pushNotification('Success', 'Employee added', 'success');
    form.reset();
  }
});

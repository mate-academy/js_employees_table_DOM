'use strict';

const table = document.querySelector('table');
const th = table.querySelectorAll('th');
const tBody = table.querySelector('tbody');
const sortDirections = new Array(th.length).fill(true);

// #region sorttable

th.forEach((header, index) => {
  header.addEventListener('click', function () {
    const rows = [...tBody.rows];
    const sortedRows = rows.sort((a, b) => {
      const aText = a.cells[index].textContent.trim();
      const bText = b.cells[index].textContent.trim();

      if (aText.includes('$')) {
        const aValue = parseFloat(aText.replace(/[$,]/g, ''));
        const bValue = parseFloat(bText.replace(/[$,]/g, ''));

        return sortDirections[index] ? aValue - bValue : bValue - aValue;
      } else {
        return sortDirections[index]
          ? aText.localeCompare(bText)
          : bText.localeCompare(aText);
      }
    });

    tBody.append(...sortedRows);
    sortDirections[index] = !sortDirections[index];
  });
});
// #endregion

// #region activeClick
table.addEventListener('click', (e) => {
  const row = e.target.closest('tbody > tr');

  if (row) {
    table
      .querySelectorAll('tr')
      .forEach((item) => item.classList.remove('active'));
    row.classList.add('active');
  }
});
// #endregion

// #region form
const newForm = document.createElement('form');

newForm.className = 'new-employee-form';

newForm.innerHTML = `
<label>Name: <input name="name" type="text" data-qa="name" required></label>
<label>Position: <input name="position" type="text" data-qa="position" required></label>
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
<label>Age: <input name="age" type="number" data-qa="age" required></label>
<label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
<button data-qa="save-button">Save to table</button>
`;

document.body.append(newForm);

// #endregion

// #region data
const form = document.forms[0];
const button = form.querySelector('button[data-qa="save-button"]');

const getFormData = () => ({
  name: form.elements.name.value.trim(),
  position: form.elements.position.value.trim(),
  office: form.elements.office.value.trim(),
  age: parseInt(form.elements.age.value, 10),
  salary: parseFloat(form.elements.salary.value.replace(/[^0-9.]/g, '')),
});
// #endregion

// #region validate data
const validateForm = () => {
  let isValid = true;

  form.querySelectorAll('input').forEach((input) => {
    if (input.value.trim().length === 0) {
      pushNotification('Помилка!', 'Всі поля мають бути заповнені', 'error');
      isValid = false;
    }
  });

  const personName = form.elements.name.value.trim();

  if (personName.length < 4 && personName.length > 0) {
    pushNotification('Помилка!', 'Мінімальна довжина імені 4 літери', 'error');
    isValid = false;
  }

  const age = parseInt(form.elements.age.value, 10);

  if ((age < 18 && age > 0) || age > 90) {
    pushNotification('Увага!', 'Перевір вік', 'error');
    isValid = false;
  }

  return isValid;
};
// #endregion

// #region notification
const pushNotification = (title, description, type) => {
  const newDiv = document.createElement('div');

  newDiv.className = `notification ${type}`;
  newDiv.setAttribute('data-qa', 'notification');

  const newH = document.createElement('h2');

  newH.className = 'title';
  newH.textContent = title;
  newDiv.appendChild(newH);

  const newP = document.createElement('p');

  newP.textContent = description;
  newDiv.appendChild(newP);
  document.body.appendChild(newDiv);

  setTimeout(() => {
    newDiv.style.visibility = 'hidden';
  }, 4000);
};
// #endregion

// #region employee
button.addEventListener('click', (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const newPerson = getFormData();

  form.reset();

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${newPerson.name}</td>
    <td>${newPerson.position}</td>
    <td>${newPerson.office}</td>
    <td>${newPerson.age}</td>
    <td>$${newPerson.salary.toLocaleString('en')}</td>
  `;

  tBody.prepend(newRow);
  pushNotification('Витаємо!', 'У нас новий працівник', 'success');
});
// #endregion

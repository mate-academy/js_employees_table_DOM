'use strict';

// write code here
const headers = document.querySelectorAll('th');
let rows = [...document.querySelectorAll('tbody tr')];
const body = document.querySelector('tbody');
const sortOrder = Array(headers.length).fill(true);

function updateRows() {
  rows = [...document.querySelectorAll('tbody tr')];
}

function sort(index) {
  updateRows();

  rows.sort((a, b) => {
    const cellA = a.cells[index].textContent;
    const cellB = b.cells[index].textContent;

    if (cellA.includes('$')) {
      const aValue = parseFloat(cellA.replace(/[$,]/g, ''));
      const bValue = parseFloat(cellB.replace(/[$,]/g, ''));

      return sortOrder[index] ? aValue - bValue : bValue - aValue;
    } else {
      return sortOrder[index]
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    }
  });

  body.innerHTML = '';

  rows.forEach((row) => body.append(row));

  sortOrder[index] = !sortOrder[index];
}

headers.forEach((head, index) => {
  head.addEventListener('click', () => {
    sort(index);
  });
});

rows.forEach((row) => {
  row.addEventListener('click', () => {
    const trActive = document.querySelectorAll('tr.active');

    trActive.forEach((r) => r.classList.remove('active'));

    row.classList.add('active');
  });
});

const formHtml = `
<form class="new-employee-form" >
      <label>
        Name:
        <input
          name="name"
          type="text"
          data-qa="name"
          required
        >
      </label>
      <label>
        Position:
        <input
          name="position"
          type="text"
          data-qa="position"
          required
        >
      </label>
      <label>
        Office:
        <select
          name="office"
          type="se"
          data-qa="office"
          required
        >
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
          name="age"
          type="number"
          data-qa="age"
          required
        >
      </label>
      <label>
        Salary:
        <input
          name="salary"
          type="number"
          data-qa="salary"
          required
        >
      </label>
      <button type="button">Save to table</button>
    </form>
`;

document.body.insertAdjacentHTML('beforeend', formHtml);

const form = document.querySelector('.new-employee-form');

const validateForm = () => {
  let isValid = true;

  const personName = form.elements.name.value.trim();

  if (personName.length < 4 && personName.length > 0) {
    showNotification('Error!', 'The minimum name length is 4 letters', 'error');
    isValid = false;

    return isValid;
  }

  const age = parseInt(form.elements.age.value, 10);

  if (age < 18 || age > 90) {
    showNotification('Error!', 'You are too young/old for this', 'error');
    isValid = false;

    return isValid;
  }

  form.querySelectorAll('input').forEach((input) => {
    if (input.value.trim().length === 0) {
      showNotification('Error!', 'Fill in all fields', 'error');
      isValid = false;

      return isValid;
    }
  });

  return isValid;
};

const showNotification = (title, description, type) => {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');

  const newTitle = document.createElement('h2');
  const text = document.createElement('p');

  newTitle.className = 'title';
  newTitle.textContent = title;

  text.textContent = description;

  notification.append(newTitle);
  notification.append(text);

  document.body.append(notification);

  setTimeout(() => {
    notification.style.visibility = 'hidden';
  }, 3000);
};

const getFormData = () => ({
  name: form.elements.name.value.trim(),
  position: form.elements.position.value.trim(),
  office: form.elements.office.value.trim(),
  age: parseInt(form.elements.age.value, 10),
  salary: parseFloat(form.elements.salary.value.replace(/[^0-9.]/g, '')),
});

const button = document.querySelector('button');

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

  body.prepend(newRow);
  showNotification('Success!', '+1 employee', 'success');
});

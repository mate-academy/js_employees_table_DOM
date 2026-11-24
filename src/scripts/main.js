'use strict';

// write code here

const tbody = document.querySelector('tbody');
const tableHeaders = document.querySelectorAll('th');

tbody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  [...tbody.rows].forEach((row) => row.classList.remove('active'));

  tr.classList.add('active');
});

tbody.addEventListener('dblclick', (e) => {
  const target = e.target.closest('td');

  if (!target) {
    return;
  }

  const text = target.textContent;

  if (target.cellIndex === 2) {
    target.innerHTML = `
      <select class="cell-input">
        <option ${text === 'Tokyo' ? 'selected' : ''} value="Tokyo">Tokyo</option>
        <option ${text === 'Singapore' ? 'selected' : ''} value="Singapore">Singapore</option>
        <option ${text === 'London' ? 'selected' : ''} value="London">London</option>
        <option ${text === 'New York' ? 'selected' : ''} value="New York">New York</option>
        <option ${text === 'Edinburgh' ? 'selected' : ''} value="Edinburgh">Edinburgh</option>
        <option ${text === 'San Francisco' ? 'selected' : ''} value="San Francisco">San Francisco</option>
      </select>
    `;
  } else {
    target.innerHTML = `<input type="text" class="cell-input" value="${text}">`;
  }

  const field = target.querySelector('.cell-input');

  field.focus();

  // field.addEventListener('blur', () => {
  //   target.textContent = field.value.trim() ? field.value : text;
  // });

  field.addEventListener('keydown', (events) => {
    if (events.code === 'Enter') {
      target.textContent = field.value.trim() ? field.value : text;
    }
  });
});

tableHeaders.forEach((th) => {
  th.addEventListener('click', () => {
    let sortItems;

    const i = th.cellIndex;
    const tr = tbody.querySelectorAll('tr');

    if (th.classList.contains('active')) {
      sortItems = [...tr].sort((tr1, tr2) => sortTable(tr2, tr1, i));
    } else {
      sortItems = [...tr].sort((tr1, tr2) => sortTable(tr1, tr2, i));
    }

    tableHeaders.forEach((item) => item.classList.remove('active'));
    th.classList.add('active');

    sortItems.forEach((sortItem) => {
      tbody.append(sortItem);
    });
  });
});

createForm();

function createForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  form.innerHTML = `
    <label>Name: <input name="name" type="text" data-qa="name" required></label>
    <label>Position: <input name="position" type="text" data-qa="position" required></label>
    <label>Office:
      <select name="office" data-qa="office" required>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" data-qa="age" required></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
    <button>Save to table</button>
  `;

  document.body.append(form);

  document.querySelector('button').addEventListener('click', (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    if (
      !formData.get('name') ||
      !formData.get('position') ||
      !formData.get('age') ||
      !formData.get('salary')
    ) {
      notification('error', 'All fields must be filled in.');

      return;
    }

    if (formData.get('name').length < 4) {
      notification('error', 'The name field must contain at least 4 letters.');

      return;
    }

    if (+formData.get('age') < 18) {
      notification('error', 'You are under 18');

      return;
    }

    if (+formData.get('age') > 90) {
      notification('error', 'You are over 90');

      return;
    }

    notification('success', 'Employee successfully added');

    createColumn(formData);

    form.reset();
  });
}

function notification(messageType, text) {
  let div = document.querySelector('.notification');

  if (!div) {
    div = document.createElement('div');
    div.setAttribute('data-qa', 'notification');
    document.body.append(div);
  } else {
    div.className = '';
    div.style.display = '';
  }

  div.classList.add('notification', messageType);

  div.innerHTML = `
    <h2 class="title">Title of ${messageType} message</h2>
    <p>${text}</p>
  `;

  setTimeout(() => {
    div.style.display = 'none';
  }, 3000);
}

function createColumn(formData) {
  const tr = document.createElement('tr');

  tr.innerHTML = `
      <td>${formData.get('name')}</td>
      <td>${formData.get('position')}</td>
      <td>${formData.get('office')}</td>
      <td>${formData.get('age')}</td>
      <td>$${(+formData.get('salary')).toLocaleString('en-US')}</td>
  `;

  tbody.append(tr);
}

function sortTable(tr1, tr2, i) {
  const td1 = tr1.querySelectorAll('td');
  const td2 = tr2.querySelectorAll('td');

  if (i === 0 || i === 1 || i === 2) {
    return td1[i].textContent.localeCompare(td2[i].textContent);
  }

  if (i === 3) {
    return +td1[i].textContent - +td2[i].textContent;
  }

  if (i === 4) {
    const tdNumber1 = conversionToANumber(td1[i].textContent);
    const tdNumber2 = conversionToANumber(td2[i].textContent);

    return tdNumber1 - tdNumber2;
  }
}

function conversionToANumber(number) {
  return +number.slice(1).replaceAll(',', '');
}

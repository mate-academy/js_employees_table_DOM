'use strict';

document.addEventListener('click', handleClick);

function handleClick(e) {
  const target = e.target;

  if (target.closest('thead th')) {
    sortTable(target);
  }

  if (target.closest('tbody tr')) {
    const trAll = document.querySelectorAll('tbody tr');

    [...trAll].forEach((item) => {
      item.classList.remove('active');
    });

    const tr = target.closest('tbody tr');

    tr.classList.add('active');
  }

  if (target.closest('button[type="submit"]')) {
  }
}

function sortTable(title) {
  const tbody = document.querySelector('tbody');
  const rowAll = document.querySelectorAll('tbody tr');

  const titleAll = document.querySelectorAll('thead th');

  tbody.innerHTML = '';

  let indexTitle = 0;

  titleAll.forEach((item, index) => {
    if (item !== title) {
      item.dataset.sort = '';
    } else {
      indexTitle = index;
    }
  });

  if (title.dataset.sort === 'asc') {
    title.dataset.sort = 'desc';

    const sorted = [...rowAll].sort((a, b) => {
      return b.children[indexTitle].innerText.localeCompare(
        a.children[indexTitle].innerText,
      );
    });

    tbody.prepend(...sorted);
  } else {
    title.dataset.sort = 'asc';

    const sorted = [...rowAll].sort((a, b) => {
      return a.children[indexTitle].innerText.localeCompare(
        b.children[indexTitle].innerText,
      );
    });

    tbody.prepend(...sorted);
  }
}

function addForm() {
  const body = document.querySelector('body');
  const form = document.createElement('form');
  const notification = document.createElement('div');

  notification.classList.add('notification');

  form.classList.add('new-employee-form');
  form.innerHTML = innerHtmlForm();
  body.append(form);
  form.addEventListener('submit', handleSubmit);

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(form);

    let error = false;
    let errorText = '';
    const successText = 'Нового співробітника до таблиці додано!';

    for (const [nameField, value] of formData.entries()) {
      if (value === '') {
        error = true;
        errorText = `Заповніть поле ${nameField}`;
        break;
      }

      if (nameField === 'name' && value.length < 4) {
        error = true;
        errorText = `Ім'я містить менше 4 літер`;
        break;
      }

      if (nameField === 'age' && (+value < 18 || +value > 90)) {
        error = true;
        errorText = `«Вік» менше 18 або більше 90`;
        break;
      }
    }

    if (!error) {
      notification.classList.remove('error');
      notification.classList.add('success');
      notification.innerHTML = successText;

      const data = Object.fromEntries(formData.entries());

      addEmployee(data);
      form.reset();
    } else {
      notification.classList.remove('success');
      notification.classList.add('error');
      notification.innerHTML = errorText;
    }

    body.prepend(notification);
  }
}
addForm();

function innerHtmlForm() {
  return `<label>Name: <input data-qa="name" required name="name" type="text" /></label>
  <label>Position: <input data-qa="position" required name="position" type="text" /></label>
  <label>Office: <select data-qa="office" required name="office">
      <option value="tokyo">Tokyo</option>
      <option value="singapore">Singapore</option>
      <option value="new_yor">New York</option>
      <option value="edinburgh">Edinburgh</option>
      <option value="san_francisco">San Francisco</option>
    </select></label>
  <label>Age: <input data-qa="age" required name="age" type="number" /></label>
  <label>Salary: <input data-qa="salary" required name="salary" type="number" /></label>
  <button type="submit">Save to table</button>`;
}

function addEmployee(data) {
  const tbody = document.querySelector('tbody');
  const tr = document.createElement('tr');
  const { name: nameEmployee, position, office, age, salary } = data;

  tr.innerHTML = `<td>${nameEmployee}</td>
          <td>${position}</td>
          <td>${office}</td>
          <td>${age}</td>
          <td>${salary}</td>`;
  tbody.append(tr);
}

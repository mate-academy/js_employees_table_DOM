'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

const convertToNum = str => str.includes('$')
  ? +(str.slice(1).replace(',', ''))
  : str;

let counter = 0;
let thIndex;

thead.addEventListener('click', e => {
  const trList = [...tbody.children];
  const headIndex = e.target.cellIndex;

  if (!(counter % 2) || headIndex !== thIndex) {
    thIndex = headIndex;
    counter++;

    trList.sort((a, b) => {
      const curr = a.children[headIndex].textContent;
      const next = b.children[headIndex].textContent;

      if (headIndex === 0 || headIndex === 1 || headIndex === 2) {
        return curr.localeCompare(next);
      }

      return convertToNum(curr) - convertToNum(next);
    });
  } else {
    trList.reverse();
  }

  tbody.append(...trList);
});

let activeEl;

tbody.addEventListener('click', e => {
  if (activeEl) {
    activeEl.classList.remove('active');
  }

  activeEl = e.target.parentNode;
  activeEl.classList.add('active');
});

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>Name: <input id="input" name="name" type="text" data-qa="name"></label>
  <label>Position:
    <input name="position" type="text" data-qa="position">
  </label>

  <label>Office:
    <select name="office" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>

  <label>Age: <input name="age" type="number" data-qa="age"></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary">
  </label>

  <button type="submit">Save to table</button>
`;

document.body.append(form);

const pushNotification = (title, description, type) => {
  const notification = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  h2.className = 'title';
  h2.innerText = title;

  p.innerText = description;

  notification.append(h2, p);

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

form.addEventListener('submit', e => {
  e.preventDefault();

  const notification = document.querySelector('.notification');

  if (document.contains(notification)) {
    notification.remove();
  };

  const formData = new FormData(e.target);
  const formValues = Object.fromEntries(formData.entries());

  if (formValues.name.length < 4) {
    pushNotification('Error', 'Name should contain more than 3 letters',
      'error');

    return;
  }

  if (+(formValues.age) < 18 || +(formValues.age) > 90) {
    pushNotification('Error', 'Age must be between 18 and 90', 'error');

    return;
  }

  if (!formValues.position || !formValues.salary) {
    pushNotification('Error', 'All fields are required', 'error');

    return;
  }

  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${formValues.name}</td>
    <td>${formValues.position}</td>
    <td>${formValues.office}</td>
    <td>${formValues.age}</td>
    <td>$${Number(formValues.salary).toLocaleString()}</td>
  `;

  tbody.append(tr);
  form.reset();

  pushNotification('Success', 'New employee was added', 'success');
});

tbody.addEventListener('dblclick', e => {
  const cellIndex = e.target.cellIndex;
  const origText = e.target.textContent;
  let input = document.createElement('input');

  input.className = 'cell-input';
  e.target.textContent = '';

  if (cellIndex === 2) {
    input = document.createElement('select');
    input.className = 'cell-input';

    input.innerHTML = `
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
    `;
  }

  if (cellIndex === 3) {
    input.type = 'number';
    input.style.width = '50px';
  }

  if (cellIndex === 4) {
    input.type = 'number';
    input.style.width = '80px';
  }

  e.target.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    switch (cellIndex) {
      case 0:
        if (input.value.length < 4) {
          pushNotification('Error', 'Name should contain more than 3 letters',
            'error');
          e.target.textContent = origText;

          return;
        }

        e.target.textContent = input.value;
        break;

      case 1:
        if (!input.value) {
          pushNotification('Error', 'All fields are required',
            'error');
          e.target.textContent = origText;

          return;
        }

        e.target.textContent = input.value;
        break;

      case 2:
        if (!input.value) {
          pushNotification('Error', 'Field is required',
            'error');
          e.target.textContent = origText;

          return;
        }

        e.target.textContent = input.value;
        break;

      case 3:
        if (+(input.value) < 18 || +(input.value) > 90) {
          pushNotification('Error', 'Age must be between 18 and 90', 'error');
          e.target.textContent = origText;

          return;
        }

        e.target.textContent = input.value;
        break;

      case 4:
        if (!input.value) {
          pushNotification('Error', 'Field is required',
            'error');
          e.target.textContent = origText;

          return;
        }

        e.target.textContent = '$' + Number(input.value).toLocaleString();
        break;

      default:
        pushNotification('Error', 'Unexpected error...', 'error');
    }

    input.remove();
  });

  input.addEventListener('keydown', ev => {
    if (ev.key === 'Enter') {
      input.blur();
    }
  });
});

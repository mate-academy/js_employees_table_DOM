'use strict';

const tHead = document.querySelector('thead');
const tBody = document.querySelector('tbody');

const options = `
  <option value="Tokyo">
    Tokyo
  </option>

  <option value="Singapore">
    Singapore
  </option>

  <option value="London">
    London
  </option>

  <option value="New York">
    New York
  </option>

  <option value="Edinburgh">
    Edinburgh
  </option>

  <option value="San Francisco">
    San Francisco
  </option>`;

document.body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form" action="/" method="post">
    <label>
      Name:
      <input name="name" type="text" data-qa="name" >
    </label>

    <label>
      Position:
      <input name="position" type="text" data-qa="position">
    </label>

    <label>
      Office:

      <select name="office" data-qa="office">
        ${options}
      </select>
    </label>

    <label>
      Age:

      <input name="age" type="number" data-qa="age">
    </label>

    <label>
      Salary:

      <input name="salary" type="number" data-qa="salary">
    </label>

    <button type="submit">
      Save to table
    </button>
  </form>`);

const form = document.querySelector('.new-employee-form');
let lastTHeadClick = -1;

function compare(th, a, b) {
  return th > 2
    ? a.children[th].textContent.replace(/\$|,/g, '')
      - b.children[th].textContent.replace(/\$|,/g, '')
    : a.children[th].textContent.localeCompare(b.children[th].textContent);
}

tHead.addEventListener('click', e => {
  const th = [...tHead.rows[0].children].indexOf(e.target);

  [...tBody.rows].sort((a, b) => lastTHeadClick !== th
    ? compare(th, a, b)
    : compare(th, b, a))
    .forEach(row => tBody.append(row));

  lastTHeadClick = lastTHeadClick !== th ? th : -1;
});

const valid = [
  (formData) => [...formData].some(el => el[1] === '')
    ? pushNotification(20 + window.pageYOffset | 0, 20,
      'ERROR', 'All fields are required! Please fill in all fields', 'error')
    : false,
  (formData) => formData.get('name').length < 4
    ? pushNotification(20 + window.pageYOffset | 0, 20,
      'ERROR', 'The "name" field must have at least 4 characters', 'error')
    : false,
  (formData) => (formData.get('age') < 18 || formData.get('age') > 90)
    ? pushNotification(20 + window.pageYOffset | 0, 20,
      'ERROR', `The value of the "age" field
      must be in the range from 18 to 90`, 'error')
    : false,
];

tBody.addEventListener('click', e => {
  [...e.currentTarget.children].forEach(el => el.classList.remove('active'));
  e.target.closest('tr').classList.add('active');
});

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(e.target);

  if (!valid.some(f => f(formData))) {
    tBody.insertAdjacentHTML('beforeend', `
    <tr>${[...formData].map((el, index) =>
    `<td>${index < 4 ? el[1] : '$' + (+el[1]).toLocaleString('en-US')}</td>`)
    .join('')}</tr>`);

    pushNotification(20 + window.pageYOffset | 0, 20,
      'SUCCESS', 'Record successfully added to table', 'success');
    e.target.reset();
  }
});

tBody.addEventListener('dblclick', e => {
  const td = e.target;
  const indexTd = [...td.parentElement.children].indexOf(td);
  const defValue = td.innerText;

  td.innerHTML = indexTd !== 2
    ? `<input class="cell-input" type="${indexTd < 3 ? 'text' : 'number'}">`
    : `<select class="cell-input" value="New York">${options}</select>`;

  const input = td.firstChild;

  input.value = indexTd !== 4 ? defValue : defValue.replace(/\$|,/g, '');
  input.focus();

  input.addEventListener('keypress', evKey => {
    if (evKey.key === 'Enter') {
      input.blur();
    }
  });

  input.addEventListener('blur', ev => {
    let value = ev.target.value;

    if ((indexTd === 0 && value.length < 4)
      || (indexTd === 1 && value.length < 1)
      || (indexTd === 3 && (value < 18 || value > 90))) {
      value = defValue;
    } else if (indexTd === 4) {
      value = '$' + (+value).toLocaleString('en-US');
    }

    td.innerHTML = value;
    input.remove();
  });
});

function pushNotification(posTop, posRight, title, description, type) {
  const windowNotification = document.createElement('section');

  pushNotification.last = windowNotification;
  windowNotification.className = `notification data-qa='notification' ${type}`;
  windowNotification.style.top = `${posTop}px`;
  windowNotification.style.right = `${posRight}px`;

  windowNotification.insertAdjacentHTML('afterbegin', `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `);

  if (pushNotification.lastTimeout) {
    pushNotification.lastWN.remove();
    clearTimeout(pushNotification.lastTimeout);
  }

  document.body.append(windowNotification);

  pushNotification.lastTimeout = setTimeout(
    () => windowNotification.remove(), 2000);
  pushNotification.lastWN = windowNotification;

  return type === 'error';
};

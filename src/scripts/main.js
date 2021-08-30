'use strict';

const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');
let count = 0;

thead.addEventListener('click', (e) => {
  const item = e.target;
  const contents = [...thead.children[0].children];
  const indexContents = contents.findIndex(elem => elem === item);

  sortList(indexContents, tbody);
});

const toNum = (string) => {
  return string.replace('$', '').replace(',', '');
};

function sortList(index, sortableList) {
  count++;

  const children = [...sortableList.children];
  const sorted = children.sort((a, b) => {
    let prev;
    let next;

    if (count % 2 !== 0) {
      prev = a.children[index].textContent;
      next = b.children[index].textContent;
    } else {
      prev = b.children[index].textContent;
      next = a.children[index].textContent;
    };

    if (isNaN(toNum(prev))) {
      return prev.localeCompare(next);
    }

    return toNum(prev) - toNum(next);
  });

  for (const person of sorted) {
    tbody.append(person);
  };
};

tbody.addEventListener('click', (e) => {
  const item = e.target.closest('tr');

  [...tbody.children].map(elem => elem.removeAttribute('class'));

  item.setAttribute('class', 'active');
});

tbody.addEventListener('dblclick', (e) => {
  const item = e.target;
  const input = document.createElement('input');
  const text = item.textContent;

  input.classList.add('cell-input');
  input.setAttribute('type', 'text');
  input.setAttribute('value', '');
  item.textContent = '';

  tbody.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      item.textContent = input.value;

      if (input.value === '') {
        item.textContent = text;
      }
    }
  });

  item.append(input);
});

const form = document.createElement('tform');

form.setAttribute('class', 'new-employee-form');
document.body.append(form);

form.innerHTML = `
<label>
  Name:
  <input name="name" type="text" data-qa="name" required>
</label>
<label>
  Position:
  <input name="position" type="text" data-qa="position">
</label>
<label>
  Office:
  <select name="office">
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
  <input name="age" type="number" data-qa="age">
</label>
<label>
  Salary:
  <input name="salary" type="number" data-qa="salary">
</label>
<button type="submit">Save to table</button>`;

const button = document.querySelector('button');
const inputName = document.getElementsByName('name');
const inputPosition = document.getElementsByName('position');
const inputAge = document.getElementsByName('age');
const inputSalary = document.getElementsByName('salary');
const selectOffice = document.getElementsByName('office');

const correctFormatSalary = (number) => `$${number.toLocaleString('en')}`;

const notification = document.createElement('div');

notification.setAttribute('class', 'notification');
notification.setAttribute('data-qa', 'notification');
notification.style.color = '#fff';
notification.style.width = '100%';
notification.style.height = '100%';
notification.style.top = '0px';
notification.style.right = '0px';
notification.style.display = 'none';
form.append(notification);

const notificationError = document.createElement('h2');
const errorText = [
  'Name must contain more than 4 letters',
  'Age cannot be less than 18 or more than 90',
  'All fields must be filled',
];

notificationError.setAttribute('class', 'title');

notificationError.innerHTML = `
Please enter correct data
<ul style="padding: 16px;">
${errorText.map(item => `
<li style = "
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 10px"
>${item}</li>
`).join(' ')}
</ul>
`;

const notificationSuccess = document.createElement('h2');

notificationSuccess.textContent = 'New employee added successfully';
notificationSuccess.style.taxtAling = 'center';

button.addEventListener('click', () => {
  if (
    (inputName[0].value).length <= 4
    || (inputPosition[0].value).length <= 0
    || inputAge[0].value < 18
    || inputAge[0].value > 90
    || inputSalary[0].value === ''
  ) {
    notification.setAttribute('class', 'notification error');
    notification.style.display = 'block';
    notification.style.background = 'rgba(252, 96, 96, 0.8)';
    notification.append(notificationError);

    setTimeout(() => {
      notification.style.display = 'none';
      notificationError.remove();
    }, 3000);

    return;
  };

  const element = [...tbody.children].find(item => item).cloneNode(true);

  element.children[0].textContent = inputName[0].value;
  element.children[1].textContent = inputPosition[0].value;
  element.children[2].textContent = selectOffice[0].value;
  element.children[3].textContent = inputAge[0].value;
  element.children[4].textContent = correctFormatSalary(+inputSalary[0].value);

  tbody.append(element);

  inputName[0].value = '';
  inputPosition[0].value = '';
  inputAge[0].value = '';
  inputSalary[0].value = '';

  notification.setAttribute('class', 'notification success');
  notification.style.display = 'block';
  notification.style.background = 'rgba(96, 189, 96, 0.8)';
  notification.append(notificationSuccess);

  setTimeout(() => {
    notification.style.display = 'none';
    notificationSuccess.remove();
  }, 3000);
});

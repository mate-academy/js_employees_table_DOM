'use strict';

const body = document.querySelector('body');
const tbody = document.querySelector('tbody');
const error = document.createElement('div');
const savingObject = {
  state: true,
};

error.classList.add('error');
error.classList.add('notification');
error.setAttribute('data-qa', 'notification');

const success = document.createElement('div');

success.classList.add('success');
success.classList.add('notification');
success.innerHTML = 'You were successfully added to the table';
success.setAttribute('data-qa', 'notification');

function convertFromForm(number) {
  return '$' + parseInt(number).toLocaleString('de-DE').split('.').join(',');
}

function converter(number) {
  return number.slice(1).split(',').join('.');
}

body.insertAdjacentHTML('beforeend', `
<form class="new-employee-form" action="">
  <label  for="name">Name:
    <input required data-qa="name" type="text">
  </label>
  <label for="">Position:
    <input required data-qa="position" type="text">
  </label>
  <label for="">Office:
    <select required data-qa="office" name="" id="">
      <option selected value="value1">Tokyo</option>
      <option value="value2">Singapore</option>
      <option value="value3">London</option>
      <option value="value3">New York</option>
      <option value="value3">Edinburgh</option>
      <option value="value3">San Francisco</option>
    </select>
  </label>
  <label for="">Age:
    <input required data-qa="age" type="number">
  </label>
  <label for="">Salary:
    <input required data-qa="salary" type="number">
  </label>
  <button class="new-employee-form__button" type="submit">Save to table</button>
</form>`);

const button = document.querySelector('.new-employee-form__button');

function tableSort(element, order) {
  const trs = document.querySelectorAll('tbody tr');
  const parentNode = element.parentNode;
  const position = [...parentNode.children].indexOf(element);

  let sorted = [...trs]
    .sort((a, b) => a.children[position]
      .innerHTML > b.children[position].innerHTML ? 1 : -1);

  if (position === 4) {
    sorted = [...trs]
      .sort((a, b) => converter(a.children[position]
        .innerHTML) - converter(b.children[position].innerHTML));
  }

  if (order === false) {
    sorted = [...trs]
      .sort((a, b) => b.children[position]
        .innerHTML > a.children[position].innerHTML ? 1 : -1);

    if (position === 4) {
      sorted = [...trs]
        .sort((a, b) => converter(b.children[position]
          .innerHTML) - converter(a.children[position].innerHTML));
    }
  }

  tbody.innerHTML = '';

  for (const tr of sorted) {
    tbody.append(tr);
  }
}

document.addEventListener('click', e => {
  const item = e.target;

  if (item.closest('thead')) {
    if (item === savingObject.elementDOM) {
      savingObject.state = !savingObject.state;
    }

    tableSort(item, savingObject.state);
    savingObject.elementDOM = item;
  }

  if (item === button) {
    e.preventDefault();

    if (document.querySelector('.success')) {
      success.remove();
    }

    if (document.querySelector('.error')) {
      error.remove();
    }

    const inputs = document.querySelectorAll('.new-employee-form label input');
    const select = document.querySelector('.new-employee-form label select');

    if ([...inputs].find(el => el.value.length === 0)) {
      error.innerHTML = 'Some field are empty';
      body.append(error);

      return;
    }

    if ([...inputs][0].value.length < 4) {
      error.innerHTML = 'Name must contain al least 4 letters';
      body.append(error);

      return;
    }

    if ([...inputs][2].value < 18 || [...inputs][2].value > 90) {
      error.innerHTML = 'Age cannot be less than 18 or older than 90';
      body.append(error);

      return;
    }

    tbody.insertAdjacentHTML('beforeend', `
  <tr>
    <td>${[...inputs][0].value}</td>
    <td>${[...inputs][1].value}</td>
    <td>${select.selectedOptions[0].textContent}</td>
    <td>${[...inputs][2].value}</td>
    <td>${convertFromForm([...inputs][3].value)}</td>
  </tr>
`);

    body.append(success);
  }

  if (e.target.closest('tbody tr')) {
    const trs = document.querySelectorAll('tr');

    for (const char of [...trs]) {
      char.classList.remove('active');
    }

    e.target.closest('tbody tr').classList.add('active');
  }
});

const tableTds = document.querySelectorAll('tbody td');

for (const item of [...tableTds]) {
  const input = document.createElement('input');

  input.setAttribute('type', 'text');
  input.classList.add('cell-input');

  item.addEventListener('dblclick', eventDbl => {
    const dblclickedItem = eventDbl.target;

    savingObject.savedText = dblclickedItem.innerHTML;
    input.value = dblclickedItem.innerHTML;
    dblclickedItem.innerHTML = '';
    dblclickedItem.append(input);
  });

  input.addEventListener('blur', eventBlur => {
    if (input.value.length === 0) {
      input.value = savingObject.savedText;

      return;
    }

    input.parentNode.innerHTML = input.value;
  });

  item.addEventListener('keyup', eventPress => {
    if (input.value.length === 0) {
      input.value = savingObject.savedText;

      return;
    }

    if (eventPress.code === 'Enter') {
      input.parentNode.innerHTML = input.value;
    }
  });
}

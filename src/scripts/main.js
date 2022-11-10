'use strict';

const tBody = document.querySelector('tbody');
const thead = document.querySelector('thead');
const checker = checkClick();

tBody.addEventListener('click', (e) => {
  [...tBody.children].forEach(elem => {
    if (elem.contains(e.target)) {
      elem.classList.toggle('active');
    } else {
      elem.closest('tr').classList.remove('active');
    }
  });
});

thead.addEventListener('click', (e) => {
  const target = e.target;
  const sortList = [...tBody.children];

  sortTable(sortList, target.cellIndex, checker(target));

  tBody.append(...sortList);
});

const form = document.createElement('form');
const formInputType = [
  ['Name', 'text'],
  ['Position', 'text'],
  ['Age', 'number'],
  ['Salary', 'number'],
];

const inputSelectOption = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

form.classList.add('new-employee-form');
document.body.append(form);

formInputType.map(item => form.append(addInputToForm(item[0], item[1])));

form.querySelector(':nth-child(2)').after((() => {
  const label = document.createElement('label');
  const select = document.createElement('select');

  label.innerText = 'Office:';

  inputSelectOption.forEach(opt => {
    const option = document.createElement('option');

    option.innerText = opt;
    select.append(option);
  });

  label.append(select);

  return label;
})());

const button = document.createElement('button');

button.innerText = 'Save to table';
button.type = 'submit';

form.lastChild.after(button);

form.addEventListener('submit', (eventSubmit) => {
  eventSubmit.preventDefault();

  const newRow = document.createElement('tr');
  const formList = [...form.elements].map((item, i) =>
    i > 2 ? +item.value : item.value).slice(0, -1);

  validator(formList, form);

  if (validator(formList, form)) {
    newRow.insertAdjacentHTML('beforeend',
      `<td>${formList[0]}</td>
       <td>${formList[1]}</td>
       <td>${formList[2]}</td>
       <td>${formList[3]}</td>
       <td>$${formList[4].toLocaleString('en-US')}</td>
    `);
    tBody.append(newRow);
  }
});

function sortTable(array, data, metodSort) {
  array.sort((value1, value2) => {
    let [a, b] = [value1, value2];

    if (!metodSort) {
      [a, b] = [b, a];
    }

    return isNaN(a.children[data].innerText)
    && !a.children[data].innerText.includes('$')
      ? a.children[data].innerText.toLowerCase().localeCompare(
        b.children[data].innerText.toLowerCase())
      : a.children[data].innerText.replace(
        /[^0-9]/g, '') - b.children[data].innerText.replace(/[^0-9]/g, '');
  });
};

function checkClick() {
  let active = '';
  let sortASC = false;

  return function(value) {
    if (!active || active === value) {
      sortASC = !sortASC;
      active = value;
    } else {
      active = value;
      sortASC = true;
    }

    return sortASC;
  };
}

function addInputToForm(inputName, inputType) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.innerText = inputName + ':';
  input.name = inputName;
  input.type = inputType;
  input.dataset.qa = inputName.toLowerCase();

  label.append(input);

  return label;
}

function pushNotification(title, description, type) {
  const block = document.createElement('div');
  const blockH2 = document.createElement('h2');
  const blockP = document.createElement('p');

  blockH2.append(title);
  blockP.append(description);
  block.append(blockH2, blockP);

  document.body.append(block);
  block.classList.add('notification');
  block.classList.add(type);

  setTimeout(() => block.remove(), 5000);
};

function validator(data, nodeElement) {
  if (data.some(item => !item)) {
    pushNotification('Missing data', 'Please, fill all fields!', 'error');

    return false;
  }

  if (data[0].length < 4) {
    pushNotification('Invalid name',
      'Name is too shot, please enter the correct name!', 'error');

    return;
  }

  if (data[3] < 18 || data[3] > 90) {
    pushNotification('Invalid age', 'Enter the correct age!', 'error');

    return;
  }

  if (!data[0].match(/^[a-zA-Z ]*$/g)) {
    pushNotification('Invalid data', 'Only the English alphabet', 'error');

    return;
  }

  nodeElement.reset();
  pushNotification('Great', 'New employee successfully added!', 'success');

  return true;
};

tBody.addEventListener('dblclick', (dblclickEvent) => {
  const target = dblclickEvent.target;
  const input = document.createElement('input');
  const originData = target.innerText;

  input.classList.add('cell-input');
  input.type = 'text';
  target.innerText = '';
  target.append(input);
  input.focus();

  function saveData(value = originData, key) {
    target.innerText = value;
    input.remove();
  }

  function validData() {
    if (!input.value) {
      saveData();

      return;
    }

    if ((target.cellIndex === 3 || target.cellIndex === 4)
      && !input.value.match(/[0-9]/)) {
      saveData();

      return;
    }

    if (target.cellIndex === 4 && input.value.match(/[0-9]/)) {
      saveData(`$` + (+input.value).toLocaleString('en-US'));

      return;
    }

    if ((target.cellIndex === 3) && (input.value < 18 || input.value > 90)) {
      saveData();

      return;
    }

    if ((target.cellIndex === 0) && (input.value.length < 4)) {
      saveData();

      return;
    }

    if ((target.cellIndex === 0) && !input.value.match(/^[a-zA-Z ]*$/g)) {
      saveData();

      return;
    }

    if (target.cellIndex === 2 && !inputSelectOption.includes(input.value)) {
      saveData();

      return;
    }

    saveData(input.value);
  }

  input.onblur = () => {
    validData();
  };

  input.onkeydown = (keyboardEvent) => {
    const enter = keyboardEvent.code === 'Enter';

    if (enter) {
      saveData();
    }
  };
});

'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const tBody = document.querySelector('tbody');
let clickCount = 0;

const sortListASC = (n) => {
  return [...tBody.rows].sort((start, end) => {
    const a = start.cells[n].innerText.replace(/[$,]/g, '');
    const b = end.cells[n].innerText.replace(/[$,]/g, '');

    if (isNaN(a)) {
      return a.localeCompare(b);
    } else {
      return a - b;
    }
  });
};

const sortListDESC = (n) => {
  return [...tBody.rows].sort((start, end) => {
    const a = start.cells[n].innerText.replace(/[$,]/g, '');
    const b = end.cells[n].innerText.replace(/[$,]/g, '');

    if (isNaN(a)) {
      return b.localeCompare(a);
    } else {
      return b - a;
    }
  });
};

const pushMassege = (title, description, type) => {
  const divMessage = document.createElement('div');
  const titleMessage = document.createElement('h2');
  const textMessage = document.createElement('p');

  divMessage.classList = 'notification';
  divMessage.dataset.qa = 'notification';
  divMessage.classList.add(type);
  titleMessage.classList = 'title';
  titleMessage.textContent = title;
  textMessage.textContent = description;

  divMessage.append(titleMessage);
  divMessage.append(textMessage);
  body.append(divMessage);

  setTimeout(() => {
    divMessage.remove();
  }, 2000);
};

table.addEventListener('click', e => {
  const item = e.target.closest('th');
  let newList;

  if (!item) {
    return;
  }

  const number = item.cellIndex;

  if (clickCount === 0) {
    newList = sortListASC(number);
    clickCount = 1;
  } else {
    newList = sortListDESC(number);
    clickCount = 0;
  }
  tBody.append(...newList);
});

tBody.addEventListener('click', e => {
  const row = e.target.closest('tr');
  const activeRow = document.querySelector('.active');

  if (!activeRow) {
    row.classList.add('active');
  } else {
    activeRow.classList.remove('active');
    row.classList.add('active');
  }
});

body.insertAdjacentHTML('beforeend',
  `<form class="new-employee-form"> 
      <label>Name:
        <input name="name" type="text" data-qa="name">
      </label>
      <label>Position:
        <input name="position" type="text" data-qa="position">
      </label>
      <label> Office:
        <select name="office" data-qa="office" >
         <option value="Tokyo">Tokyo</option>
         <option value="Singapore">Singapore</option>
         <option value="London">London</option>
         <option value="New York">New York</option>
         <option value="Edinburgh">Edinburgh</option>
         <option value="San Francisco">San Francisco</option>
        </select>
      </label>
      <label>Age:
        <input name="age" type="number" data-qa="age">
      </label>
      <label>Salary:
        <input name="salary" type="number" data-qa="salary">
      </label>
      <button>Save to table</button>
     </form>`
);

const form = document.querySelector('form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const tr = document.createElement('tr');

  const textArray = [
    formData.get('name'),
    formData.get('position'),
    formData.get('office'),
    formData.get('age'),
    formData.get('salary'),
  ];

  if (formData.get('name').length < 4) {
    pushMassege('Incorrect Name!',
      'Name should have at least 4 letters.', 'error');

    return;
  }

  if (!formData.get('name') || !formData.get('position')
    || !formData.get('age') || !formData.get('salary')) {
    pushMassege('Error', 'Not all field have data.', 'error');

    return;
  }

  if (formData.get('age') < 18 || formData.get('age') > 90) {
    pushMassege('Incorrect Age',
      'Age can\'t be less than 18 or more than 90.', 'error');

    return;
  }

  for (let i = 0; i < textArray.length; i++) {
    const td = document.createElement('td');

    if (i === textArray.length - 1) {
      const num = parseInt(textArray[i]);

      td.textContent = `$${num.toLocaleString('en-US')}`;
    } else {
      td.textContent = textArray[i];
    }

    tr.append(td);
  }

  tBody.append(tr);

  pushMassege('Added new row.',
    'New data were added to the table.', 'success');

  for (let i = 0; i < [...form.querySelectorAll('input')].length; i++) {
    form.querySelectorAll('input')[i].value = null;
  }
});

tBody.addEventListener('dblclick', e => {
  const target = e.target;
  const text = target.textContent;
  const input = document.createElement('input');

  input.classList = `cell-input`;
  input.name = 'text';
  input.type = 'text';
  target.textContent = null;

  target.append(input);
  input.focus();

  const inputText = document.querySelector('.cell-input');

  input.addEventListener('keydown', ev => {
    if (ev.code === 'Enter') {
      if (inputText.value.length === 0) {
        target.textContent = text;
      }

      if (target.cellIndex < 3) {
        if (inputText.value.length < 4) {
          pushMassege('Incorrect Input Data.',
            'Text should have at least 4 letters.', 'error');
          target.textContent = text;
        } else {
          target.textContent = inputText.value;
        }
      }

      if (target.cellIndex === 3) {
        if (parseInt(inputText.value)) {
          if (parseInt(inputText.value) < 18
          || parseInt(inputText.value > 90)) {
            pushMassege('Incorrect Age',
              'Age can\'t be less than 18 or more than 90.', 'error');
            target.textContent = text;
          } else {
            target.textContent = inputText.value;
          }
        } else {
          pushMassege('Not a number',
            'Add number from 18 to 90.', 'error');
          target.textContent = text;
        }
      }

      if (target.cellIndex === 4) {
        if (parseInt(inputText.value)) {
          target.textContent = `
          $${parseInt(inputText.value).toLocaleString('en-US')}`;
        } else {
          pushMassege('Not a number', 'Please add number', 'error');
          target.textContent = text;
        }
      }
    }
  });

  input.addEventListener('blur', ev => {
    if (inputText.value.length === 0) {
      target.textContent = text;
    }

    if (target.cellIndex < 3) {
      if (inputText.value.length < 4) {
        pushMassege('Incorrect Input Data.',
          'Text should have at least 4 letters.', 'error');
        target.textContent = text;
      } else {
        target.textContent = inputText.value;
      }
    }

    if (target.cellIndex === 3) {
      if (parseInt(inputText.value)) {
        if (parseInt(inputText.value) < 18
        || parseInt(inputText.value > 90)) {
          pushMassege('Incorrect Age',
            'Age can\'t be less than 18 or more than 90.', 'error');
          target.textContent = text;
        } else {
          target.textContent = inputText.value;
        }
      } else {
        pushMassege('Not a number',
          'Add number from 18 to 90.', 'error');
        target.textContent = text;
      }
    }

    if (target.cellIndex === 4) {
      if (parseInt(inputText.value)) {
        target.textContent = `
        $${parseInt(inputText.value).toLocaleString('en-US')}`;
      } else {
        pushMassege('Not a number', 'Please add number', 'error');
        target.textContent = text;
      }
    }
  });
});

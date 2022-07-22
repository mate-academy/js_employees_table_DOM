'use strict';

const body = document.querySelector('body');
const sortParam = document.querySelector('thead');
const sortList = document.querySelector('tbody');
let clickCount = 0;

/* Add event for sorting of table in two directions */

sortParam.addEventListener('click', (e) => {
  const indexTarget = e.target.cellIndex;
  let sortedList;

  if (clickCount === 0) {
    sortedList = sortListAscOrder(indexTarget);

    clickCount = 1;
  } else {
    sortedList = sortListDescOrder(indexTarget);
    clickCount = 0;
  }

  sortList.append(...sortedList);
});

function sortListAscOrder(index) {
  const resultList = [...sortList.rows].sort((a, b) => {
    const rowA = a.cells[index].innerText.replace('$', '').replace(',', '');
    const rowB = b.cells[index].innerText.replace('$', '').replace(',', '');

    if (index <= 2) {
      return rowA.localeCompare(rowB);
    } else {
      return rowA - rowB;
    }
  });

  return resultList;
}

function sortListDescOrder(index) {
  const resultList = [...sortList.rows].sort((a, b) => {
    const rowA = a.cells[index].innerText.replace('$', '').replace(',', '');
    const rowB = b.cells[index].innerText.replace('$', '').replace(',', '');

    if (index <= 2) {
      return rowB.localeCompare(rowA);
    } else {
      return rowB - rowA;
    }
  });

  return resultList;
}

/* Add event of selection for row */

sortList.addEventListener('click', (e) => {
  const row = e.target.closest('tr');
  const isActive = document.querySelector('.active');

  if (!isActive) {
    row.classList.add('active');
  } else {
    isActive.classList.remove('active');
    row.classList.add('active');
  }
});

/* Add form for input of new employee */

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

/* Add message after new input */

const resultMessage = (title, description, result) => {
  const divMes = document.createElement('div');
  const titleMes = document.createElement('title');
  const textMes = document.createElement('p');

  divMes.classList = 'notification';
  divMes.dataset.qa = 'notification';
  divMes.classList.add(result);
  titleMes.classList = 'title';
  titleMes.textContent = title;
  textMes.textContent = description;

  divMes.append(titleMes);
  divMes.append(textMes);
  body.append(divMes);

  setTimeout(() => {
    divMes.remove();
  }, 3000);
};

/* Add new row to table throughout form */

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
    resultMessage('Incorrect Name!',
      'Name should have at least 4 letters.', 'error');

    return;
  }

  if (!formData.get('name') || !formData.get('position')
    || !formData.get('age') || !formData.get('salary')) {
    resultMessage('Error', 'Not all field have data.', 'error');

    return;
  }

  if (formData.get('age') < 18 || formData.get('age') > 90) {
    resultMessage('Incorrect Age',
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

  sortList.append(tr);

  resultMessage('Added new row.',
    'New data were added to the table.', 'success');

  for (let i = 0; i < [...form.querySelectorAll('input')].length; i++) {
    form.querySelectorAll('input')[i].value = null;
  }
});

/* Edit row of table */

sortList.addEventListener('dblclick', e => {
  const target = e.target;
  const text = target.textContent;
  const input = document.createElement('input');

  input.classList = 'cell-input';
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
          resultMessage('Incorrect Input Data.',
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
            resultMessage('Incorrect Age',
              'Age can\'t be less than 18 or more than 90.', 'error');
            target.textContent = text;
          } else {
            target.textContent = inputText.value;
          }
        } else {
          resultMessage('Not a number',
            'Add number from 18 to 90.', 'error');
          target.textContent = text;
        }
      }

      if (target.cellIndex === 4) {
        if (parseInt(inputText.value)) {
          target.textContent = `
          $${parseInt(inputText.value).toLocaleString('en-US')}`;
        } else {
          resultMessage('Not a number', 'Please add number', 'error');
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
        resultMessage('Incorrect Input Data.',
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
          resultMessage('Incorrect Age',
            'Age can\'t be less than 18 or more than 90.', 'error');
          target.textContent = text;
        } else {
          target.textContent = inputText.value;
        }
      } else {
        resultMessage('Not a number',
          'Add number from 18 to 90.', 'error');
        target.textContent = text;
      }
    }

    if (target.cellIndex === 4) {
      if (parseInt(inputText.value)) {
        target.textContent = `
        $${parseInt(inputText.value).toLocaleString('en-US')}`;
      } else {
        resultMessage('Not a number', 'Please add number', 'error');
        target.textContent = text;
      }
    }
  });
});

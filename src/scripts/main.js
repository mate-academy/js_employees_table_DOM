'use strict';

const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const body = document.body;
let index = 0;
let clickAmount = 0;
let clickHead;
let tbodyRow;

body.style.paddingTop = '120px';

function getNumber(string) {
  return Number(string.replace('$', '').replace(',', ''));
}

const pushNotification = (title, description, type) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.classList = 'notification';
  div.dataset.qa = 'notification';
  div.classList.add(type);
  h2.classList = 'title';
  h2.textContent = title;
  p.textContent = description;
  div.append(h2);
  div.append(p);

  h2.style.marginTop = '10px';
  h2.style.marginBottom = '0';
  p.style.marginTop = '10px';
  p.style.marginBottom = '10px';

  body.append(div);

  setTimeout(() => {
    div.remove();
  }, 2500);
};

document.body.insertAdjacentHTML('beforeend',
  `<form class = "new-employee-form">
    <label>Name: <input name="name" type="text" data-qa="name" required></label>
    <label>Position: <input
      name="position"
      type="text"
      data-qa="position"></label>
    <label>Office: <select name="office" data-qa="office" required>
      <option value = "Tokyo">Tokyo</option>
      <option value = "Singapore">Singapore</option>
      <option value = "London">London</option>
      <option value = "New York">New York</option>
      <option value = "Edinburgh">Edinburgh</option>
      <option value = "San Francisco">San Francisco</option>
    </select>
    </label>
    <label>Age: <input name="age" type="number" data-qa="age"></label>
    <label>Salary: <input
      name="salary"
      type="number"
      data-qa="salary"></label>
    <button type="submit">Save to table</button>
  </form>`
);

document.addEventListener('click', e => {
  const item = e.target;

  if (item.parentElement.parentElement.closest('thead')) {
    clickAmount++;

    for (let i = 0; i < tableHead.children[0].children.length; i++) {
      if (item.textContent === tableHead.children[0].children[i].textContent) {
        index = i;
      }
    }

    if (clickHead === item.textContent) {
      if (clickAmount === 1) {
        if (index <= 2) {
          const sortedString = [...tableBody.rows].sort((a, b) => {
            const firstEl = a.cells[index].textContent;
            const secondEl = b.cells[index].textContent;

            return firstEl.localeCompare(secondEl);
          });

          for (const line of sortedString) {
            tableBody.append(line);
          }
        }

        if (index > 2) {
          const sorted = [...tableBody.rows].sort((a, b) =>
            getNumber(a.cells[index].textContent)
            - getNumber(b.cells[index].textContent));

          for (const row of sorted) {
            tableBody.append(row);
          }
        }
      }

      if (clickAmount === 2) {
        if (index <= 2) {
          const sortedString = [...tableBody.rows].sort((a, b) => {
            const firstEl = a.cells[index].textContent;
            const secondEl = b.cells[index].textContent;

            return secondEl.localeCompare(firstEl);
          });

          for (const line of sortedString) {
            tableBody.append(line);
          }
        }

        if (index > 2) {
          const sorted = [...tableBody.rows].sort((a, b) =>
            getNumber(b.cells[index].textContent)
            - getNumber(a.cells[index].textContent));

          for (const row of sorted) {
            tableBody.append(row);
          }
        }

        clickAmount = 0;
      }
    }

    if (clickHead !== item.textContent) {
      if (index <= 2) {
        const sortedString = [...tableBody.rows].sort((a, b) =>
          a.cells[index].textContent.localeCompare(b.cells[index].textContent));

        for (const line of sortedString) {
          tableBody.append(line);
        }
      }

      if (index > 2) {
        const sorted = [...tableBody.rows].sort((a, b) =>
          getNumber(a.cells[index].textContent)
          - getNumber(b.cells[index].textContent));

        for (const row of sorted) {
          tableBody.append(row);
        }
      }

      clickAmount = 1;
    }

    clickHead = item.textContent;
  }

  if (item.parentElement.parentElement.closest('tbody')) {
    if (tbodyRow !== item.parentElement && tbodyRow) {
      tbodyRow.classList.remove('active');
    }

    item.parentElement.classList = 'active';

    tbodyRow = item.parentElement;
  }
});

const form = document.querySelector('form');

form.addEventListener('submit', (ev) => {
  ev.preventDefault();

  const data = new FormData(form);
  const tr = document.createElement('tr');

  const textArray = [data.get('name'), data.get('position'), data.get('office'),
    data.get('age'), data.get('salary')];

  if (data.get('name').length === 0 || data.get('position').length === 0
      || data.get('age').length === 0 || data.get('salary').length === 0) {
    pushNotification('Error',
      'Missed Data.\n '
      + 'Not all field have data.', 'error');

    return;
  }

  if (data.get('name').length < 4) {
    pushNotification('Error',
      'Correct Name.\n '
      + 'Name should have at least 4 letters.', 'error');

    return;
  }

  if (data.get('age') < 18 || data.get('age') > 90) {
    pushNotification('Error',
      'Correct Age.\n '
      + 'Age can\'t be less than 18 or more than 90.', 'error');

    return;
  }

  if (data.get('name').length >= 4 && data.get('age') >= 18
      && data.get('age') <= 90) {
    for (let i = 0; i < textArray.length; i++) {
      const td = document.createElement('td');

      if (i !== textArray.length - 1) {
        td.textContent = textArray[i];
      }

      if (i === textArray.length - 1) {
        const num = parseInt(textArray[i]);

        td.textContent = `$${num.toLocaleString('en-US')}`;
      }

      tr.append(td);
    }

    tableBody.append(tr);

    pushNotification('Success',
      'Added new row.\n '
      + 'New data were added to the table.', 'success');
  }
});

tableBody.addEventListener('dblclick', evt => {
  const target = evt.target;
  const startText = target.textContent;

  const input = document.createElement('input');

  input.classList = 'cell-input';
  input.name = 'text';
  input.type = 'text';
  target.textContent = null;

  target.append(input);
  input.focus();

  const textInput = document.querySelector('.cell-input');

  input.addEventListener('keydown', action => {
    if (action.code === 'Enter') {
      if (textInput.value.length === 0) {
        target.textContent = startText;
      }

      if (target.cellIndex < 3) {
        if (textInput.value.length < 4) {
          pushNotification('Error',
            'Correct Input Data.\n '
            + 'Text should have at least 4 letters.', 'error');

          target.textContent = startText;
        } else {
          target.textContent = textInput.value;
        }
      }

      if (target.cellIndex === 3) {
        if (parseInt(textInput.value)) {
          if (parseInt(textInput.value) < 18
              || parseInt(textInput.value) > 90) {
            pushNotification('Error',
              'Correct Age.\n '
              + 'Age can\'t be less than 18 or more than 90.', 'error');

            target.textContent = startText;
          } else {
            target.textContent = textInput.value;
          }
        } else {
          pushNotification('Error',
            'Not a number.\n '
            + 'Add number from 18 to 90.', 'error');

          target.textContent = startText;
        }
      }

      if (target.cellIndex === 4) {
        if (parseInt(textInput.value)) {
          target.textContent = `
            $${parseInt(textInput.value).toLocaleString('en-US')}`;
        } else {
          pushNotification('Error',
            'Not a number.\n '
            + 'Please add number.', 'error');

          target.textContent = startText;
        }
      }
    }
  });

  input.addEventListener('blur', action2 => {
    if (textInput.value.length === 0) {
      target.textContent = startText;
    }

    if (target.cellIndex < 3) {
      if (textInput.value.length < 4) {
        pushNotification('Error',
          'Correct Input Data.\n '
          + 'Text should have at least 4 letters.', 'error');

        target.textContent = startText;
      } else {
        target.textContent = textInput.value;
      }
    }

    if (target.cellIndex === 3) {
      if (parseInt(textInput.value)) {
        if (parseInt(textInput.value) < 18
            || parseInt(textInput.value) > 90) {
          pushNotification('Error',
            'Correct Age.\n '
            + 'Age can\'t be less than 18 or more than 90.', 'error');

          target.textContent = startText;
        } else {
          target.textContent = textInput.value;
        }
      } else {
        pushNotification('Error',
          'Not a number.\n '
          + 'Add number from 18 to 90.', 'error');

        target.textContent = startText;
      }
    }

    if (target.cellIndex === 4) {
      if (parseInt(textInput.value)) {
        target.textContent = `
          $${parseInt(textInput.value).toLocaleString('en-US')}`;
      } else {
        pushNotification('Error',
          'Not a number.\n '
          + 'Please add number.', 'error');

        target.textContent = startText;
      }
    }
  });
});

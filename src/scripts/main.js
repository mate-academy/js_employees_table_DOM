'use strict';

const tHead = document.querySelector('thead');
const tBody = document.querySelector('tbody');
const body = document.body;
let index = 0;
let clickAmount = 0;
let clickHead;
let tbodyRow;

body.style.paddingTop = '120px';

function toNumber(string) {
  return Number(string.replace('$', '').replace(',', ''));
}

const pushNotification = (title, description, type) => {
  const divNotif = document.createElement('div');
  const h2Notif = document.createElement('h2');
  const pNotif = document.createElement('p');

  divNotif.classList = 'notification';
  divNotif.dataset.qa = 'notification';
  divNotif.classList.add(type);
  h2Notif.classList = 'title';
  h2Notif.textContent = title;
  pNotif.textContent = description;
  divNotif.append(h2Notif);
  divNotif.append(pNotif);

  h2Notif.style.marginTop = '10px';
  h2Notif.style.marginBottom = '0';
  pNotif.style.marginTop = '10px';
  pNotif.style.marginBottom = '10px';

  body.append(divNotif);

  setTimeout(() => {
    divNotif.remove();
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

    for (let i = 0; i < tHead.children[0].children.length; i++) {
      if (item.textContent === tHead.children[0].children[i].textContent) {
        index = i;
      }
    }

    if (clickHead === item.textContent) {
      if (clickAmount === 1) {
        if (index <= 2) {
          const sortedString = [...tBody.rows].sort((a, b) => {
            const firstEl = a.cells[index].textContent;
            const secondEl = b.cells[index].textContent;

            return firstEl.localeCompare(secondEl);
          });

          for (const line of sortedString) {
            tBody.append(line);
          }
        }

        if (index > 2) {
          const sorted = [...tBody.rows].sort((a, b) =>
            toNumber(a.cells[index].textContent)
            - toNumber(b.cells[index].textContent));

          for (const row of sorted) {
            tBody.append(row);
          }
        }
      }

      if (clickAmount === 2) {
        if (index <= 2) {
          const sortedString = [...tBody.rows].sort((a, b) => {
            const firstEl = a.cells[index].textContent;
            const secondEl = b.cells[index].textContent;

            return secondEl.localeCompare(firstEl);
          });

          for (const line of sortedString) {
            tBody.append(line);
          }
        }

        if (index > 2) {
          const sorted = [...tBody.rows].sort((a, b) =>
            toNumber(b.cells[index].textContent)
            - toNumber(a.cells[index].textContent));

          for (const row of sorted) {
            tBody.append(row);
          }
        }

        clickAmount = 0;
      }
    }

    if (clickHead !== item.textContent) {
      if (index <= 2) {
        const sortedString = [...tBody.rows].sort((a, b) =>
          a.cells[index].textContent.localeCompare(b.cells[index].textContent));

        for (const line of sortedString) {
          tBody.append(line);
        }
      }

      if (index > 2) {
        const sorted = [...tBody.rows].sort((a, b) =>
          toNumber(a.cells[index].textContent)
          - toNumber(b.cells[index].textContent));

        for (const row of sorted) {
          tBody.append(row);
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

  const fData = new FormData(form);
  const tr = document.createElement('tr');

  const textArray = [fData.get('name'), fData.get('position'),
    fData.get('office'), fData.get('age'), fData.get('salary')];

  if (fData.get('name').length === 0 || fData.get('position').length === 0
      || fData.get('age').length === 0 || fData.get('salary').length === 0) {
    pushNotification('Error',
      'Missed Data.\n '
      + 'Not all field have data.', 'error');

    return;
  }

  if (fData.get('name').length < 4) {
    pushNotification('Error',
      'Correct Name.\n '
      + 'Name should have at least 4 letters.', 'error');

    return;
  }

  if (fData.get('age') < 18 || fData.get('age') > 90) {
    pushNotification('Error',
      'Correct Age.\n '
      + 'Age can\'t be less than 18 or more than 90.', 'error');

    return;
  }

  if (fData.get('name').length >= 4 && fData.get('age') >= 18
      && fData.get('age') <= 90) {
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

    tBody.append(tr);

    pushNotification('Success',
      'Added new row.\n '
      + 'New data were added to the table.', 'success');
  }
});

tBody.addEventListener('dblclick', evt => {
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

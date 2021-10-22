'use strict';

// write code here
const tHead = document.querySelector('thead');
const tH = tHead.querySelectorAll('th');

const tBody = document.querySelector('tbody');
let notifLeft;

const offices = [...new Set([...tBody.rows]
  .map(each => each.cells[2].outerHTML))]
  .sort().join('')
  .replaceAll('td', 'option');

const officesHTML = [...new Set([...tBody.rows]
  .map(each => {
    const inText = each.cells[2].innerText;

    return `<option value="${inText.toLowerCase()}">${inText}</option>`;
  }))].join('\n');

function usdNum(str) {
  return Number(str.replace(/\D/g, ''));
}

// 2-way sort
let curSort = Number;

tHead.addEventListener('click', (ev) => {
  const sortByIndex = [...tH].indexOf(ev.target);
  const tBodyData = [...tBody.rows];

  // reverse sorting if same header clicked
  if (curSort === sortByIndex) {
    tBodyData.reverse();
    tBody.append(...tBodyData);

    return;
  }

  tBodyData.sort((a, b) => {
    const aIn = a.cells[sortByIndex].innerText;
    const bIn = b.cells[sortByIndex].innerText;

    return usdNum(aIn) - usdNum(bIn)
      || aIn.localeCompare(bIn);
  });

  curSort = sortByIndex;

  tBody.append(...tBodyData);
});

// row selected
let prevSelected;

tBody.addEventListener('click', (ev) => {
  if (prevSelected) {
    prevSelected.classList.remove('active');
  };

  ev.target.closest('tr')
    .classList.add('active');

  prevSelected = ev.target.closest('tr');
});

// utility notifications
const pushNotification = (title, description, type) => {
  const notification = document.createElement('div');
  const inTitle = document.createElement('h2');
  const inDescription = document.createElement('p');

  document.body.insertAdjacentElement('beforeend', notification);

  notification.dataset.qa = 'notification';
  notification.style.top = '450px';
  notification.style.left = notifLeft + 'px';
  notification.classList.add('notification', type);
  notification.style.position = 'absolute';

  notification.append(inTitle);
  inTitle.classList.add('title');
  inTitle.append(title);

  notification.append(inDescription);
  inDescription.append(description);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

const errorSalary = () => {
  pushNotification('❌ Salary validation',
    'salary must be [1...2,000,000]', 'error');
};
const errorAge = () => {
  pushNotification('❌ Age validation',
    'age must be [18...90]', 'error');
};
const errorInput = () => {
  pushNotification('❌ input length',
    'input shall be min 4 chars OR a positive integer', 'error');
};
const successEdit = () => {
  pushNotification('✅ data changed', '🎉', 'success');
};
const successSubmit = () => {
  pushNotification('✅ data submitted', '🎉', 'success');
};
const warnNoEdit = () => {
  pushNotification('no data changed', '', 'warning');
};

// edit table
tBody.addEventListener('dblclick', (ev) => {
  if (ev.target.classList.contains('cell-input')) {
    return;
  }
  // ^prevent double-click set to '' while in edit mode

  const cell = ev.target.closest('td');
  const cellData = cell.innerText;

  let cellEdit;

  // input types per value type
  switch (tH[cell.cellIndex].innerText) {
    case 'Salary':
    case 'Age':
      cell.innerText = '';
      cellEdit = document.createElement('input');
      cellEdit.type = 'number';
      cellEdit.max = '2000000';
      cellEdit.style.width = '75%';
      cellEdit.value = usdNum(cellData);
      break;
    case 'Office':
      cell.innerText = '';
      cellEdit = document.createElement('select');
      cellEdit.innerHTML = offices;
      cellEdit.value = cellData;
      break;
    default:
      cell.innerText = '';
      cellEdit = document.createElement('input');
      cellEdit.type = 'text';
      cellEdit.value = cellData;
  }

  cellEdit.classList.add('cell-input');
  cell.append(cellEdit);
  cellEdit.focus();

  // cellEdit.value validation and processing on blur and Enter
  cellEdit.addEventListener('keydown', (keypress) => {
    if (keypress.key === 'Enter') {
      cellEdit.blur();
    }
  });

  cellEdit.addEventListener('blur', () => {
    cellEdit.remove();

    if (cellEdit.value === cellData) {
      cell.innerText = cellData;

      return warnNoEdit();
    }

    switch (tH[cell.cellIndex].innerText) {
      case 'Salary':
        if (cellEdit.value < 1 || cellEdit.value > 2000000) {
          cell.innerText = cellData;

          return errorSalary();
        }
        cell.innerText = '$' + Number(cellEdit.value).toLocaleString('en-US');
        successEdit();
        break;

      case 'Age':
        if (cellEdit.value < 18 || cellEdit.value > 90) {
          cell.innerText = cellData;

          return errorAge();
        }
        cell.innerText = +cellEdit.value;
        successEdit();
        break;

      default:
        if (!cellEdit.value || +cellEdit.value <= 0
          || cellEdit.value.trim().length < 4) {
          cell.innerText = cellData;

          return errorInput();
        }

        cell.innerText = cellEdit.value;

        return successEdit();
    }
  });
});

// add form with client-side validations
document.body.insertAdjacentHTML('beforeend', `
<form class="new-employee-form" >
  <label for="name">
    Name:
    <input id="name"
      required
      name="name"
      type="text"
      data-qa="name"

      pattern="[A-z]{4,}(?: [A-z]+)*" title="min 4 chars, no digits"
      placeholder="min 4 chars, no digits"
    >
  </label>
  <label for="position">
    Position:
    <input id="position"
      required
      name="position"
      type="text"
      data-qa="position"

      pattern="[A-z]{4,}(?: [A-z]+)*" title="min 4 chars, no digits"
      placeholder="min 4 chars, no digits"
    >
  </label>
  <label for="office">
    Office:
    <select id="office"
      required
      name="office"
      data-qa="office"
    >
    </select>
  </label>
  <label for="age">
    Age:
    <input id="age"
      required
      name="age"
      type="number"
      data-qa="age"

      min="18"
      max="90"
      step="1"
      title="age must be [18...90]"
      placeholder="[18...90]"
    >
  </label>
  <label for="salary">
    Salary:
    <input id="salary"
      required
      name="salary"
      type="number"
      data-qa="salary"

      min="100"
      max="2000000"
      step="100"
    >
  </label>
  <button id="addRecord">Add record</button>
</form>
`);

// add offices dropdown options
const form = document.querySelector('form');

form.querySelector('#office')
  .insertAdjacentHTML('beforeend', officesHTML);

// set the notification.left === form.left
window.addEventListener('resize', ev => {
  notifLeft = form.getBoundingClientRect().left;
});

// form submit
tBody.style.textTransform = 'capitalize';

form.addEventListener('submit', submit => {
  // preventing page reload to use insertAdjacentHTML
  submit.preventDefault();

  const formData = new FormData(form);

  tBody.insertAdjacentHTML('beforeend',
    `<tr>
      <td>${formData.get('name')}</td>
      <td>${formData.get('position')}</td>
      <td>${formData.get('office')}</td>
      <td>${Number(formData.get('age'))}</td>
      <td>$${Number(formData.get('salary')).toLocaleString('en-US')}</td>
    </tr>`
  );

  successSubmit();
  form.reset();
});

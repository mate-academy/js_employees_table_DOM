'use strict';

// write code here
const headers = document.querySelector('thead');
const headersItems = [...headers.querySelectorAll('th')];
const tbodyContainer = document.querySelector('tbody');
const bodyContainer = document.querySelector('body');

// var toString key-name for the normalize()
const colName = headersItems[0].textContent.toLowerCase().trim();
const position = headersItems[1].textContent.toLowerCase().trim();
const office = headersItems[2].textContent.toLowerCase().trim();
const age = headersItems[3].textContent.toLowerCase().trim();
const salary = headersItems[4].textContent.toLowerCase().trim();

// var for notifications
const error = 'error';
const success = 'success';

// for method sort
const asc = 'asc';
const desc = 'desc';

// current a count the rows 'sensor'
const getRowsLenght = () => {
  return [...tbodyContainer.rows];
};

// Listener  row is active
// нужно подумать чтобы убирать полностью выделение строки при клике вне тела
tbodyContainer.addEventListener('click', (checkedRow) => {
  const targetRow = checkedRow.target.closest('tr');

  if (!targetRow) {
    return;
  }

  const currActive = tbodyContainer.querySelector('.active');

  if (currActive || !targetRow) {
    currActive.classList.remove('active');
  }

  targetRow.classList.add('active');
});

// --- the fun.clean values of cells
const getCleanValue = (item, index) => {
  const cleanValue = item.cells[index].textContent;

  return Number(cleanValue.replace(/[$,]/g, ''));
};

// --- the fun. normalize
function normalizeList(row) {
  return row.map((el) => {
    return {
      [colName]: el.cells[0].textContent.toLowerCase(),
      [position]: el.cells[1].textContent.toLowerCase(),
      [office]: el.cells[2].textContent.toLowerCase(),
      [age]: getCleanValue(el, 3),
      [salary]: getCleanValue(el, 4),
      node: el,
    };
  });
}

// --- the fun. control of state a flag of the Obj
const getInitialFlags = () => {
  return {
    [colName]: asc,
    [position]: asc,
    [office]: asc,
    [age]: asc,
    [salary]: asc,
  };
};

let memoryCurrTitle;

let flags = getInitialFlags();

const getControlStateFlag = (checkedTitle) => {
  if (checkedTitle === memoryCurrTitle) {
    flags[checkedTitle] = flags[checkedTitle] === asc ? desc : asc;

    return flags[checkedTitle];
  } else {
    memoryCurrTitle = checkedTitle;
    flags = getInitialFlags();

    return asc;
  }
};

// --- the func. create notifications
const notification = (typeStatus, titleInput) => {
  const valueNotif = {
    [success]: 'You have added successfully',
    [error]: {
      [colName]: 'The name is emty or less than four letters long',
      [age]: 'Your age does not match',
      [position]: 'The field "Position" is empty',
      [office]: 'The field "Office" is empty',
      [salary]: 'The field "Salary" is empty',
    },
  };

  const textSuccess = valueNotif.success;
  const textError = valueNotif[typeStatus][titleInput];
  const finalTextMessage = typeStatus === success ? textSuccess : textError;
  const oldMessage = document.querySelector('.notification');

  const createMessage = `
    <div class="notification ${typeStatus}" data-qa="notification">
      <h2 class="title">${typeStatus}</h2>
      <p>
          ${finalTextMessage}
      </p>
    </div>
  `;

  bodyContainer.insertAdjacentHTML('afterbegin', createMessage);

  if (oldMessage) {
    oldMessage.remove();
  }

  setTimeout(() => {
    const alertMessage = document.querySelector('.notification');

    alertMessage.remove();
  }, 2000);
};

// --- the func. input validation logic
function validateFormInputs(
  nameField,
  posField,
  officeField,
  ageField,
  salaryField,
) {
  if (nameField.length < 4) {
    notification(error, colName);

    return false;
  }

  if (posField === '') {
    notification(error, position);

    return false;
  }

  if (officeField === '') {
    notification(error, office);

    return false;
  }

  if (+ageField < 18 || +ageField > 90 || ageField === '') {
    notification(error, age);

    return false;
  }

  if (salaryField === '') {
    notification(error, salary);

    return false;
  }

  return true;
}

// Listener 'click sort_asc->desc'
headers.addEventListener('click', (checked) => {
  const checkedItem = checked.target.closest('th');
  const checkedValue = checkedItem.textContent.toLowerCase();

  if (!checkedItem) {
    return;
  }

  const currentData = normalizeList(getRowsLenght());

  // --- the func. sortList
  function getSortList(data, key) {
    // callback tool-Numbers
    const sortNumber = (a, b) => a[key] - b[key];
    const sortString = (a, b) => a[key].localeCompare(b[key]);
    const isAsc = getControlStateFlag(checkedValue);

    const selectedTools =
      typeof data[0][key] === 'number' ? sortNumber : sortString;

    const newList = data.sort((a, b) => {
      const callbackResult = selectedTools(a, b);

      return isAsc === asc ? callbackResult : callbackResult * -1;
    });

    newList.forEach((el) => {
      return tbodyContainer.append(el.node);
    });

    return newList;
  }

  getSortList(currentData, checkedValue);
});

// <--- create html form --->
const formHtml = `
  <form action="#" class="new-employee-form">
    <label>Name:
      <input name="name" data-qa = "name" type="text">
    </label>

    <label>Position:
      <input name="position" data-qa = "position" type="text">
    </label>

    <label>Office:
      <select name="office" data-qa = "office">

        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>

    <label>Age:
      <input name="age" data-qa = "age" type="number">
    </label>

    <label>Salary:
      <input name="salary" data-qa = "salary" type="number">
    </label>

    <button id="btn-save" type="submit">Save to table</button>
  </form>
`;

// Form rate
bodyContainer.insertAdjacentHTML('beforeend', formHtml);

// access to the form
const myForm = document.querySelector('.new-employee-form');

// Listener for save to table
myForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const inputName = myForm.elements.name.value.trim();
  const inputPos = myForm.elements.position.value.trim();
  const inputOffice = myForm.elements.office.value.trim();
  const inputAge = myForm.elements.age.value.trim();
  const inputSalary = myForm.elements.salary.value.trim();

  // input validation logic
  const validForm = validateFormInputs(
    inputName,
    inputPos,
    inputOffice,
    inputAge,
    inputSalary,
  );

  if (!validForm) {
    return;
  }

  const formatedSalary = Number(inputSalary).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  // creating a string temlate
  const newString = `
    <tr>
      <td>${inputName}</td>
      <td>${inputPos}</td>
      <td>${inputOffice}</td>
      <td>${inputAge}</td>
      <td>${formatedSalary}</td>
    </tr>
  `;

  notification(success);
  tbodyContainer.insertAdjacentHTML('afterbegin', newString);
  myForm.reset();
});

// Listener The Editer cells
tbodyContainer.addEventListener('dblclick', (e) => {
  const checkedRow = e.target.closest('td');
  const currentVal = checkedRow.textContent;
  const activeInput = document.querySelector('.cell-input');

  if (!checkedRow) {
    return;
  }

  if (activeInput) {
    activeInput.blur();
  }

  if (e.target.closest('.cell-input')) {
    return;
  }

  const inputCell = document.createElement('input');

  inputCell.classList.add('cell-input');
  inputCell.value = currentVal;
  checkedRow.replaceChildren(inputCell);
  inputCell.focus();

  inputCell.addEventListener('blur', () => {
    const newValue = inputCell.value.trim();
    const finalText = newValue === '' ? currentVal : newValue;

    checkedRow.innerHTML = '';
    checkedRow.textContent = finalText;
  });

  inputCell.addEventListener('keydown', (ePush) => {
    const newValue = inputCell.value.trim();

    const finalText = newValue === '' ? currentVal : newValue;

    if (ePush.key === 'Enter') {
      checkedRow.innerHTML = '';
      checkedRow.textContent = finalText;
    }
  });
});

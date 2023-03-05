'use strict';

sortingTable();
selectedRows();
editingTable();
createForm();
fillForm();

const messagesArray = [
  {
    title: 'ERROR',
    description: 'Age must be from 18 to 90',
    type: 'error',
  },
  {
    title: 'WARNING',
    description: 'Please input only whole numbers',
    type: 'warning',
  },
  {
    title: 'SUCCESS',
    description: 'All changes have been made',
    type: 'success',
  },
  {
    title: 'WARNING',
    description: 'Input value must not be empty',
    type: 'warning',
  },
  {
    title: 'ERROR',
    description: 'The name must contain only letters and one space',
    type: 'error',
  },
  {
    title: 'WARNING',
    description: 'Input value must be more then 4 symbols',
    type: 'warning',
  },
  {
    title: 'ERROR',
    description: 'Please input only positive number',
    type: 'error',
  },
  {
    title: 'ERROR',
    description: 'Input value must not contain letters or symbols',
    type: 'error',
  },
  {
    title: 'SUCCESS',
    description: 'New employee added to table',
    type: 'success',
  },
  {
    title: 'ERROR',
    description: 'Name length must be more than 3 characters',
    type: 'error',
  },
  {
    title: 'ERROR',
    description: 'Office not defined',
    type: 'error',
  },
  {
    title: 'ERROR',
    description: 'Each field is required',
    type: 'error',
  },
];

function sortingTable() {
  const head = document.querySelector('thead');

  head.querySelectorAll('th').forEach((item) => {
    const spanElem = document.createElement('span');

    spanElem.style.fontSize = '12px';
    item.append(spanElem);
  });

  const arrCompare = [1, 1, 1, 1, 1];

  head.addEventListener('click', (eventFunc) => {
    const cellNumber = eventFunc.target.cellIndex;
    const asc = ' \u25BC';
    const desc = ' \u25B2';
    const convert = (stringNumber) => {
      return Number(stringNumber.toLocaleString().replace(/\D/g, ''));
    };
    const compareVariables = (aa, bb) => {
      let a = aa.children[cellNumber].textContent.toUpperCase();
      let b = bb.children[cellNumber].textContent.toUpperCase();

      if (convert(a) > 0) {
        a = (convert(a));
        b = (convert(b));
      }

      return a < b ? arrCompare[cellNumber] : arrCompare[cellNumber] * (-1);
    };

    document.querySelectorAll('span').forEach((element) => {
      element.textContent = '';
    });

    for (let i = 0; i < arrCompare.length; i++) {
      arrCompare[i] = cellNumber === i ? arrCompare[i] * (-1) : 1;
    }

    head.querySelectorAll('span')[cellNumber]
      .textContent = arrCompare[cellNumber] === 1 ? asc : desc;

    document.querySelector('tbody')
      .append(...[...document.querySelector('tbody').children].sort((a, b) =>
        compareVariables(a, b)));
  });
}

function selectedRows() {
  const rows = document.querySelector('tbody');

  rows.addEventListener('click', (eventFunc) => {
    for (const i of rows.children) {
      i.removeAttribute('class');
    }
    eventFunc.target.parentElement.classList.add('active');
  });
}

function createForm() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.innerHTML = `
  <label>Name:<input type="text" name="name" data-qa="name"></label>
  <label>Position:<input type="text" name="position" data-qa="position"></label>
  <label>Office:
     <select name="office" data-qa="office">
        <option value selected disabled>choose an office</option>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
     </select>
  </label>
  <label>Age:<input type="number" name="age" data-qa="age">
  </label>
  <label>Salary:<input type="number" name="salary" data-qa="salary">
  </label>
  <button type="submit">Save to table</button>`;
  document.body.insertBefore(form, document.body.children[1]);
}

function formatter(string) {
  const numberFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return numberFormat.format(string).slice(0, -3);
}

function editingTable() {
  document.querySelector('tbody').addEventListener('dblclick', (eventFunc) => {
    const memoryText = eventFunc.target.textContent;
    const numberColumn = eventFunc.target.cellIndex;

    if (numberColumn === 0 || numberColumn === 1 || numberColumn === 3) {
      eventFunc.target.textContent = '';

      const inputButton = document.createElement('input');

      inputButton.className = 'cell-input';
      inputButton.value = memoryText;
      eventFunc.target.append(inputButton);
      inputButton.style.color = 'black';
      inputButton.style.fontWeight = 'bold';
      inputButton.focus();

      inputButton.addEventListener('blur', () => {
        eventFunc.target.textContent = inputButton.value;

        if (tableErrorHandler(numberColumn, inputButton.value) === 0) {
          eventFunc.target.textContent = memoryText;
        }
        eventFunc.target.removeAttribute('input');
      });

      inputButton.addEventListener('keypress', (eventEnter) => {
        if (eventEnter.key === 'Enter') {
          eventFunc.target.textContent = inputButton.value;

          if (tableErrorHandler(numberColumn, inputButton.value) === 0) {
            eventFunc.target.textContent = memoryText;
          }
          eventFunc.target.removeAttribute('input');
        }

        if (eventEnter.key === 'Escape') {
          eventFunc.target.textContent = memoryText;
          eventFunc.target.removeAttribute('input');
        }
      });
    }

    if (numberColumn === 2) {
      eventFunc.target.textContent = '';

      const inputButton = document.createElement('label');

      inputButton.innerHTML = `
      <select class="cell-input" style="color: black; font-weight: bold">
            <option value selected disabled>choose an office</option>
            <option value="Tokyo">Tokyo</option>
            <option value="Singapore">Singapore</option>
            <option value="London">London</option>
            <option value="New York">New York</option>
            <option value="Edinburgh">Edinburgh</option>
            <option value="San Francisco">San Francisco</option>
      </select>`;

      eventFunc.target.append(inputButton);
      inputButton.focus();

      inputButton.querySelector('select')
        .addEventListener('change', (eventSection) => {
          const selectedText = eventSection.target.value;

          eventSection.target.parentElement.remove();
          eventFunc.target.textContent = selectedText;
          tableErrorHandler(numberColumn);
        });

      inputButton.querySelector('select')
        .addEventListener('blur', (eventSection) => {
          eventSection.target.parentElement.remove();
          eventFunc.target.textContent = memoryText;
        });

      inputButton.querySelector('select')
        .addEventListener('keypress', (eventKey) => {
          if (eventKey.key === 'Escape') {
            eventKey.target.parentElement.remove();
            eventFunc.target.textContent = memoryText;
          }
        });
    }

    if (numberColumn === 4) {
      eventFunc.target.textContent = '';

      const inputButton = document.createElement('input');

      inputButton.className = 'cell-input';

      inputButton.value = Number(memoryText.toLocaleString()
        .replace(/\D/g, '')).toString();
      eventFunc.target.append(inputButton);
      inputButton.style.color = 'black';
      inputButton.style.fontWeight = 'bold';
      inputButton.focus();

      inputButton.addEventListener('blur', () => {
        eventFunc.target.textContent
          = formatter(inputButton.value);

        if (tableErrorHandler(numberColumn, inputButton.value) === 0) {
          eventFunc.target.textContent = memoryText;
        }
        eventFunc.target.removeAttribute('input');
      });

      inputButton.addEventListener('keypress', (eventEnter) => {
        if (eventEnter.key === 'Enter') {
          eventFunc.target.textContent
            = formatter(inputButton.value);

          if (tableErrorHandler(numberColumn, inputButton.value) === 0) {
            eventFunc.target.textContent = memoryText;
          }
          eventFunc.target.removeAttribute('input');
        }

        if (eventEnter.key === 'Escape') {
          eventFunc.target.textContent = memoryText;
          eventFunc.target.removeAttribute('input');
        }
      });
    }
  });
}

function notification(message) {
  const element = document.createElement('div');

  element.classList.add('notification', message.type);

  element.innerHTML
    = `<h2 class="title" data-qa="notification">${message.title}</h2>
       <p>${message.description}</p>`;
  document.querySelector('body').append(element);

  setTimeout(function() {
    document.body.children[3].remove();
  }, 2000);
}

function tableErrorHandler(columnNumber, value) {
  if (value === '') {
    notification(messagesArray[3]);

    return 0;
  }

  if (columnNumber === 3) {
    if (value > 90 || value < 18) {
      notification(messagesArray[0]);

      return 0;
    }
  }

  if (columnNumber === 3) {
    if (!value.match(/^\d*\d*$/)) {
      notification(messagesArray[1]);

      return 0;
    }
  }

  if (columnNumber === 0) {
    const words = value.split(' ');

    for (const i of words) {
      if (!i.match(/^[A-Za-z]+$/)) {
        notification(messagesArray[4]);

        return 0;
      }
    }
  }

  if (columnNumber === 0) {
    if (value.length < 4) {
      notification(messagesArray[5]);

      return 0;
    }
  }

  if (columnNumber === 4) {
    if (value < 0) {
      notification(messagesArray[6]);

      return 0;
    }
  }

  if (columnNumber === 4) {
    if (!value.match(/^\d*\d*$/)) {
      notification(messagesArray[7]);

      return 0;
    }
  }

  notification(messagesArray[2]);

  return 1;
}

function fillForm() {
  const form = document.querySelector('form');

  form.addEventListener('submit', (eventForm) => {
    eventForm.preventDefault();

    const data = new FormData(form);
    const formData = Object.fromEntries(data.entries());
    const newRowTable = document.createElement('tr');

    newRowTable.innerHTML = `
          <td>${formData.name}</td>
          <td>${formData.position}</td>
          <td>${formData.office}</td>
          <td>${formData.age}</td>
          <td>${formatter(formData.salary)}</td>`;

    if (formErrorHandler(formData) === 1) {
      document.querySelector('tbody').append(newRowTable);
      document.querySelector('form').reset();
    }
  });
}

function formErrorHandler(objectOfForm) {
  for (const key in objectOfForm) {
    if (objectOfForm[key].length === 0 || objectOfForm[key].length
      === undefined) {
      notification(messagesArray[11]);

      return 0;
    }
  }

  if (objectOfForm.name.length < 4) {
    notification(messagesArray[9]);

    return 0;
  }

  if (objectOfForm.office === undefined) {
    notification(messagesArray[10]);

    return 0;
  }

  if (objectOfForm.age < 18 || objectOfForm.age > 90) {
    notification(messagesArray[0]);

    return 0;
  }

  const words = objectOfForm.name.split(' ');

  for (const i of words) {
    if (!i.match(/^[A-Za-z]+$/)) {
      notification(messagesArray[4]);

      return 0;
    }
  }
  notification(messagesArray[8]);

  return 1;
}

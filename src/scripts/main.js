'use strict';

const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const body = document.querySelector('body');

let indexCol = -1;

const sortTable = function(index, type, isSorted) {
  const sort = function(rowA, rowB) {
    const rowResA = rowA.cells[index].innerHTML;
    const rowResB = rowB.cells[index].innerHTML;

    switch (type) {
      case 'Name':
      case 'Position':
      case 'Office':
        return rowResA < rowResB ? -1 : rowResA > rowResB ? 1 : 0;

      case 'Age':
        return rowResA - rowResB;

      case 'Salary':
        return parseFloat(rowResA.slice(1)) - parseFloat(rowResB.slice(1));
    }
  };

  const rows = [].slice.call(tbody.rows);

  rows.sort(sort);

  if (isSorted) {
    rows.reverse();
  }

  table.removeChild(tbody);

  for (let i = 0; i < rows.length; i++) {
    tbody.appendChild(rows[i]);
  }

  table.appendChild(tbody);
};

table.addEventListener('click', (e) => {
  const el = e.target;

  if (el.nodeName !== 'TH') {
    return;
  };

  const index = el.cellIndex;
  const type = el.innerHTML;

  sortTable(index, type, indexCol === index);
  indexCol = (indexCol === index) ? -1 : index;
});

tbody.addEventListener('click', (e) => {
  const item = e.target.closest('TR');

  if (e.target.nodeName === 'SELECT' || e.target.nodeName === 'INPUT') {
    return;
  }

  if (item.classList.contains('active')) {
    item.classList.remove('active');

    return;
  }

  [...tbody.children].forEach(elem => elem.classList.remove('active'));

  item.classList.add('active');
});

body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form">
    <label>
      Name: 
        <input name="name" type="text" data-qa="name">
    </label>
    <label>
      Position: 
        <input name="position" type="text" data-qa="position">
    </label>
    <label>
      Office: 
        <select name="office">
          <option value="Tokyo" selected>Tokyo</option>
          <option value="Singapore">Singapore</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="San Francisco">San Francisco</option>
        </select>
    </label>
    <label>
      Age: 
      <input name="age" type="number" data-qa="age">
    </label>
    <label>
      Salary: 
        <input name="salary" type="number"  data-qa="salary" >
    </label>
    <button>Save to table</button>
    </form>
`);

const form = document.querySelector('.new-employee-form');
const inputs = form.querySelectorAll('input');

function correctName(input) {
  const inputToLower = input.toLowerCase();
  let result = inputToLower[0].toUpperCase();

  for (let i = 1; i < inputToLower.length; i++) {
    if (inputToLower[i - 1] === ' ') {
      result += inputToLower[i].toUpperCase();
    } else {
      result += inputToLower[i];
    }
  }

  return result;
};

function correctSalary(text) {
  if (text === '') {
    return '';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0,
  }).format(+text);
}

const validation = (input) => {
  const val = input.value;

  switch (input.name) {
    case 'name':
      return /^([ \u00c0-\u01ffa-zA-Z-])+$/.test(val) && val.length > 3;
    case 'position':
      return /^([ \u00c0-\u01ffa-zA-Z-])+$/.test(val);
    case 'age': return parseInt(val) >= 18 && parseInt(val) <= 90;
    case 'salary': return parseInt(val) >= 1;
    default: return val !== '';
  }
};

const pushNotification = (posTop, posRight, title, description, type) => {
  const bodyElem = document.querySelector('body');

  bodyElem.insertAdjacentHTML('afterbegin', `
    <div data-qa="notification" class="notification ${type}">
      <h2 class="title">
        ${title}
      </h2>
      <p>${description}</p>
    </div>
  `);

  const divMargin = document.querySelector('.notification');

  divMargin.style.marginTop = `${posTop}px`;
  divMargin.style.marginLeft = `${posRight}px`;
  divMargin.style.width = `max-content`;

  setTimeout(() => {
    divMargin.remove();
  }, 2000);
};

form.addEventListener('input', (e) => {
  inputs.forEach(x => {
    if (!validation(x)) {
      x.style.border = '2px solid red';
    }

    if (validation(x)) {
      x.style.border = 'none';
    }

    if (x.value === '') {
      x.style.border = 'none';
    }
  });
});

form.addEventListener('input', (ev) => {
  const input = ev.target;

  if (input.tagName !== 'INPUT') {
    return;
  }

  if (!validation(input)) {
    input.style.color = `red`;
  }

  if (validation(input)) {
    input.style.color = ``;
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let valid = 0;

  inputs.forEach(x => {
    if (!validation(x)) {
      valid++;
    }

    if (x.value === '') {
      x.style.border = '2px solid red';
    }
  });

  if (valid) {
    pushNotification(100, 10, 'Something <br>went wrong',
      'Try again', 'error');
  }

  if (!valid) {
    pushNotification(100, 10, 'All is correct!',
      'Good job =)', 'success');

    const correctInputSalary = correctSalary([...inputs][3].value);
    const correctInputName = correctName([...inputs][0].value);
    const correctInputPosition = correctName([...inputs][1].value);
    const userOffice = document.getElementsByName('office')[0].value;
    const inputAge = [...inputs][2].value;

    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${correctInputName}</td>
        <td>${correctInputPosition}</td>
        <td>${userOffice}</td>
        <td>${inputAge}</td>
        <td>${correctInputSalary}</td>
      </tr>
    `);

    inputs.forEach(elem => {
      elem.value = '';
    });

    valid = !valid;
  }
});

tbody.addEventListener('dblclick', (e) => {
  const elem = e.target;

  if (e.target.tagName !== 'TD') {
    return;
  }

  const input = document.createElement('input');
  const select = document.createElement('select');
  const oldVal = elem.textContent;

  input.value = '';
  input.classList.add(`cell-input`);

  elem.removeChild(elem.firstChild);

  if (elem.cellIndex === 0 || elem.cellIndex === 1) {
    elem.appendChild(input);
  }

  if (elem.cellIndex === 2) {
    select.insertAdjacentHTML(`beforeend`, `
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh" >Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    `);

    elem.appendChild(select);

    const selectedOption = document.querySelectorAll('option');

    [...selectedOption].forEach(option => {
      if (option.value === oldVal) {
        option.setAttribute('selected', 'selected');
      }
    });
  };

  select.style.border = `1px solid #808080`;
  select.style.borderRadius = `4px`;
  select.style.color = `#808080`;
  select.style.padding = `4px`;
  select.style.outlineColor = `#808080`;

  if (elem.cellIndex === 3 || elem.cellIndex === 4) {
    elem.appendChild(input);
    input.type = 'number';
  }

  input.focus();

  document.addEventListener('click', (d) => {
    if (!d.target.contains(select)) {
      elem.removeChild(select);
      elem.appendChild(document.createTextNode(select.value));
    }
  });

  select.addEventListener('keydown', (q) => {
    if (q.code === 'Enter') {
      elem.removeChild(select);
      elem.appendChild(document.createTextNode(select.value));
    };
  });

  function validationToEditField(value) {
    const val = value.value;
    const index = value.parentElement.cellIndex;

    switch (index) {
      case 0:
        return /^([ \u00c0-\u01ffa-zA-Z-])+$/.test(val) && val.length > 3;
      case 1:
        return /^([ \u00c0-\u01ffa-zA-Z-])+$/.test(val);
      case 3: return parseInt(val) >= 18 && parseInt(val) <= 90;
      case 4: return /^\d+$/.test(val);
    }
  };

  function correctValue(text, index) {
    switch (index) {
      case 0:
      case 1: return correctName(text);
      case 3: return text;
      case 4: return correctSalary(text);
    }
  };

  let valida = 0;

  input.addEventListener('input', () => {
    if (!validationToEditField(input)) {
      input.style.color = `red`;
      valida++;
    }

    if (validationToEditField(input)) {
      input.style.color = ``;
      valida = 0;
    }
  });

  input.addEventListener('keyup', (x) => {
    if (x.code === 'Enter') {
      elem.removeChild(input);

      if (valida || input.value === '') {
        elem.appendChild(document.createTextNode(oldVal));
      }

      if (!valida) {
        const res = correctValue(input.value, elem.cellIndex);

        elem.appendChild(document.createTextNode(res));
      }
    };
  });

  input.addEventListener('blur', () => {
    elem.removeChild(input);

    if (valida || input.value === '') {
      elem.appendChild(document.createTextNode(oldVal));
    }

    if (!valida) {
      const res = correctValue(input.value, elem.cellIndex);

      elem.appendChild(document.createTextNode(res));
    }
  });
});

'use strict';

// write code here
const tbodyRows = document.querySelectorAll('tbody tr');
const tbody = document.querySelector('tbody');
const theadColumnTitle = document.querySelectorAll('thead th');

const strInNumber = (str) => {
  return str.replace(/[^\d]/g, '') * 1;
};

let selectedColumnSort = '';

const sortTable = (column) => {
  let reverse = false;

  if (selectedColumnSort === column) {
    reverse = true;
    selectedColumnSort = '';
  } else {
    selectedColumnSort = column;
  }

  [...document.querySelectorAll('tbody tr')].sort((prevRow, nextRow) => {
    let prevElem = prevRow.children[column].textContent;
    let nextElem = nextRow.children[column].textContent;

    if (reverse) {
      prevElem = nextRow.children[column].textContent;
      nextElem = prevRow.children[column].textContent;
    }

    if (strInNumber(prevElem)) {
      return strInNumber(nextElem) - strInNumber(prevElem);
    }

    if (nextElem > prevElem) {
      return -1;
    }

    if (nextElem < prevElem) {
      return 1;
    }

    return 0;
  }).forEach(function(node) {
    tbody.appendChild(node);
  });
};

theadColumnTitle.forEach((elem, index) => {
  elem.onclick = () => {
    sortTable(index);
  };
});

const addFuncItem = (item) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('tbody tr').forEach((element) => {
      element.classList.remove('active');
    });
    item.classList.add('active');
  });

  [item].forEach((elem) => {
    [...elem.children].map((cell, index) => {
      cell.addEventListener('dblclick', () => {
        const oldValue = cell.innerHTML;

        cell.innerHTML = '<input class="cell-input"/>';

        const input = cell.children[0];

        input.focus();

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            input.blur();
          }
        });

        input.addEventListener('blur', () => {
          if (input.value !== '') {
            if (index === 4) {
              cell.innerHTML = formatSalary(input.value);

              return;
            }
            cell.innerHTML = input.value;
          } else {
            cell.innerHTML = oldValue;
          }
        });
      });
    });
  });
};

tbodyRows.forEach((item) => {
  addFuncItem(item);
});

const form = document.createElement('form');

form.className = 'new-employee-form';

form.onsubmit = () => {
  form.reset();

  return false;
};

form.innerHTML = `
 <label>
 Name: <input type="text" name="name"
 required  data-qa="name" />
 </label>

 <label>
 Position: <input type="text" name="position"
 required  data-qa="position"/>
 </label>

<label>
 Office: <select data-qa="office" name="office"
    required >
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
    </select>
</label>

 <label>
 Age :<input type="number" name="age"
    data-qa="age" required/>
 </label>

 <label>
 Salary: <input type="number" name="salary"
    data-qa="salary" required/>
 </label>

 <button>Save to table</button>
`;
document.body.append(form);

const btnForm = document.querySelector('form button');

const formatSalary = (num) => {
  if (num.length < 6) {
    return '$' + num.substring(0, 2) + ',' + num.substring(2);
  }

  return '$' + num.substring(0, 3) + ',' + num.substring(3);
};

const crtPeople = () => {
  const newPeople = document.createElement('tr');

  newPeople.innerHTML = `
  <td>${form.name.value}</td>
  <td>${form.position.value}</td>
  <td>${form.office.value}</td>
  <td>${form.age.value}</td>
  <td>${formatSalary(form.salary.value)}</td>
    `;
  addFuncItem(newPeople);
  tbody.append(newPeople);
};

const newNotification = (type, info) => {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.className = 'notification ' + type;

  notification.innerHTML = `
  <h2 class="title">${type}</h2>
  <p>${info}</p>
  `;
  document.body.append(notification);
  setTimeout(() => notification.remove(), 2000);
};

const validForm = () => {
  let newError = '';

  if (form.name.value.length < 4) {
    newError += '|| no valid name || ';
  }

  if (+form.age.value < 18 || +form.age.value > 90) {
    newError += '|| no valid age || ';
  }

  if (newError) {
    newNotification('err', newError);

    return false;
  }

  newNotification('succes', 'new people added, all good!!!');

  return true;
};

btnForm.addEventListener('click', () => {
  if (form.name.value && form.salary.value) {
    if (form.position.value && form.age.value) {
      if (validForm()) {
        crtPeople();
      }
    }
  }
});


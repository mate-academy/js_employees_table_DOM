'use strict';

// --Sort table--
const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
let lastPushedHeader;

tableHead.addEventListener('click', (occurrent) => {
  const indexOfColumn = occurrent.target.cellIndex;
  const pushedHeader = occurrent.target;

  if (!tableHead.children) {
    return;
  }

  switch (indexOfColumn) {
    case 0:
    case 1:
    case 2: sortColumnWithtWords(indexOfColumn, pushedHeader);
      break;
    case 3:
    case 4: sortColumnWithNumbers(indexOfColumn, pushedHeader);
      break;
  }
});

function sortColumnWithtWords(indexOfColumn, pushedHeader) {
  const tableRows = tableBody.querySelectorAll('tr');

  const arrayWithSortedItems = [ ...tableRows ].sort((a, b) => {
    const arg1 = a.children[indexOfColumn].innerHTML;
    const arg2 = b.children[indexOfColumn].innerHTML;

    return arg1.localeCompare(arg2);
  });

  //  check whether header pushed first  time

  if (lastPushedHeader !== pushedHeader) {
    pushedHeader.dataset.methodSort = 'asc';
    lastPushedHeader = pushedHeader;
  }

  // select a sort method

  if (pushedHeader.dataset.methodSort === 'desc') {
    arrayWithSortedItems.reverse();
    pushedHeader.dataset.methodSort = 'asc';
  } else {
    pushedHeader.dataset.methodSort = 'desc';
  }

  for (const item of arrayWithSortedItems) {
    tableBody.append(item);
  }
};

function sortColumnWithNumbers(indexOfColumn, pushedHeader) {
  const tableRows = tableBody.querySelectorAll('tr');

  const arrayWithSortedItems = [ ...tableRows ].sort((a, b) => {
    const arg1 = a.children[indexOfColumn].innerHTML;
    const arg2 = b.children[indexOfColumn].innerHTML;

    if (indexOfColumn === 4) {
      return convertIntoNumber(arg1) - convertIntoNumber(arg2);
    }

    return +arg1 - (+arg2);
  });

  //  check whether header pushed first  time

  if (lastPushedHeader !== pushedHeader) {
    pushedHeader.dataset.methodSort = 'asc';
    lastPushedHeader = pushedHeader;
  }

  // select a sort method

  if (pushedHeader.dataset.methodSort === 'desc') {
    arrayWithSortedItems.reverse();
    pushedHeader.dataset.methodSort = 'asc';
  } else {
    pushedHeader.dataset.methodSort = 'desc';
  }

  for (const item of arrayWithSortedItems) {
    tableBody.append(item);
  }
}

function convertIntoNumber(arrayWithStrings) {
  const removeSign = arrayWithStrings.replace(',', '');
  const arrayWithNumrers = Number(removeSign.slice(1));

  return arrayWithNumrers;
}

// --Creare new employee--
const formNewEmployee = document.createElement('form');

formNewEmployee.className = 'new-employee-form';

formNewEmployee.innerHTML = `
    <label  data-qa="name">Name: 
        <input name="name" type="text">
    </label>
    <label data-qa="position">Position:
         <input name="position" type="text">
    </label>
    <label data-qa="office">Office: 
        <select>  
            <option value="Tokyo">Tokyo</option>  
            <option value="Singapore">Singapore</option>  
            <option value="London">London</option>  
            <option value="NewYork">New York</option>  
            <option value="Edinburgh">Edinburgh</option>  
            <option value="SanFrancisco">San Francisco</option>  
        </select>
    </label>
    <label  data-qa="age">Age:
         <input name="age" type="number">
    </label>
    <label data-qa="salary">Salary:
        <input name="salary" type="number">
    </label>
    <button type ="submit" >Save to table</button>
`;

document.body.append(formNewEmployee);

const buttonFormNewEmployee = formNewEmployee.querySelector('button');

buttonFormNewEmployee.addEventListener('click', (occurrence) => {
  occurrence.preventDefault();

  const formInformation = new FormData(formNewEmployee);
  const infoOfEmployee = Object.fromEntries(formInformation.entries());
  const selectorOfForm = formNewEmployee.querySelector('select');
  const selectedValue = selectorOfForm.options[selectorOfForm.selectedIndex];

  infoOfEmployee.office = selectedValue.text;

  if (formInformation.get('name').length < 4) {
    pushNotification('Error',
      '"Name" value has less than 4 letters', 'error');

    return;
  };

  if (formInformation.get('age') < 18
    || formInformation.get('age') > 90) {
    pushNotification('Error',
      '"Age" shouldn`t be less than 18 or more than 90', 'error');

    return;
  };

  for (const value of Object.values(infoOfEmployee)) {
    if (value.length === 0) {
      pushNotification('Error',
        'All fields are required', 'error');

      return;
    }
  };

  creareNewItemOfTable(infoOfEmployee);

  pushNotification('Success',
    'You added new employee', 'success');
});

function creareNewItemOfTable({ name: fullname, position, office,
  age, salary }) {
  const itemOfTable = document.createElement('tr');

  itemOfTable.innerHTML = `
        <td>${fullname}</td>
        <td>${position}</td>
        <td>${office}</td>
        <td>${age}</td>
        <td>${convertSalaryInRightFormat(salary)}</td>
    `;

  tableBody.append(itemOfTable);
  clearForm();
}

function clearForm() {
  const formFilds = formNewEmployee.querySelectorAll('input');
  const formSelector = formNewEmployee.querySelector('select');

  for (const item of formFilds) {
    item.value = '';
  }

  formSelector.options[0].selected = true;
}

function convertSalaryInRightFormat(salary) {
  return `$${salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

function pushNotification(title, description, className) {
  const containerOfNotification = document.createElement('div');

  containerOfNotification.dataset.qa = 'notification';
  containerOfNotification.className = 'notification';
  containerOfNotification.classList.add(className);

  document.body.append(containerOfNotification);

  containerOfNotification.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  setTimeout(() => {
    containerOfNotification.remove();
  }, 3000);
}

// --Make row selected--

tableBody.addEventListener('click', (e) => {
  const selectedRow = e.target;

  if (!tableBody.contains(selectedRow)) {
    return;
  }

  for (const row of tableBody.children) {
    if (row.className === 'active') {
      row.classList.remove('active');
    }
  }
  selectedRow.parentElement.className = 'active';
});

// --Implement editing of table--

tableBody.addEventListener('dblclick', (e) => {
  const selectedItem = e.target;

  if (!tableBody.contains(selectedItem)) {
    return;
  }

  setNewValue(selectedItem);
});

function setNewValue(selectedItem) {
  const startedValueSelectedRow = selectedItem.innerHTML;

  selectedItem.innerHTML = '<input class="cell-input">';
  selectedItem.firstElementChild.select();

  if (!isNaN(+startedValueSelectedRow)) {
    selectedItem.firstElementChild.type = 'number';
  } else {
    selectedItem.firstElementChild.type = 'text';
  }

  selectedItem.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      if (ev.target.nodeName === 'INPUT') {
        selectedItem.firstElementChild.blur();
      }
    }
  });

  selectedItem.firstElementChild.addEventListener('blur', (ev) => {
    editEnd();
  });

  function editEnd() {
    const input = selectedItem.firstElementChild;

    if (input.value.length === 0) {
      selectedItem.innerHTML = startedValueSelectedRow;

      return;
    }

    selectedItem.innerHTML = input.value;
  }
}

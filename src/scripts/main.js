'use strict';

const thead = document.querySelector('thead');
const theadChildren = thead.children[0];
const tbody = document.querySelector('tbody');
let sortBy = '';

theadChildren.children[0].setAttribute('data-sortBy', 'name');
theadChildren.children[1].setAttribute('data-sortBy', 'position');
theadChildren.children[2].setAttribute('data-sortBy', 'office');
theadChildren.children[3].setAttribute('data-sortBy', 'age');
theadChildren.children[4].setAttribute('data-sortBy', 'salary');

const officeOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const state = {
  sortDirection: 'asc',
  sort: '',
  selectedPerson: null,
  notifications: {
    error: [],
    success: [],
  },
  editedField: null,
};

function sortTable() {
  let sortedTbody = '';
  const tbodyChildren = [...tbody.children];

  switch (state.sort) {
    case 'name':
      sortedTbody = sortBodyString(tbodyChildren, 0);
      break;

    case 'position':
      sortedTbody = sortBodyString(tbodyChildren, 1);
      break;

    case 'office':
      sortedTbody = sortBodyString(tbodyChildren, 2);
      break;

    case 'age':
      sortedTbody = sortBodyNumber(tbodyChildren, 3, (num) => parseInt(num));
      break;

    case 'salary':
      sortedTbody = sortBodyNumber(tbodyChildren, 4, (num) =>
        parseInt(num.replace(/\$|,/g, ''))
      );
      break;

    default:
      break;
  }

  if (state.sortDirection === 'desc') {
    sortedTbody.reverse();
  }

  if (sortedTbody) {
    tbody.innerHTML = '';

    for (const child of sortedTbody) {
      tbody.append(child);
    }
  }
}

thead.addEventListener('click', (e) => {
  const target = e.target;

  if (target.tagName === 'TH') {
    sortBy = target.dataset.sortby;

    if (sortBy === state.sort) {
      if (state.sortDirection === 'asc') {
        state.sortDirection = 'desc';
      } else if (state.sortDirection === 'desc') {
        state.sortDirection = 'asc';
      }
    } else {
      state.sortDirection = 'asc';
      state.sort = sortBy;
    }

    sortTable();
  }
});

function sortBodyString(arr, childNumber) {
  return arr.sort((childA, childB) =>
    childA.children[childNumber].innerText.localeCompare(
      childB.children[childNumber].innerText
    )
  );
}

function sortBodyNumber(arr, childNumber, parsePattern) {
  return arr.sort(
    (childA, childB) =>
      parsePattern(childA.children[childNumber].innerText)
      - parsePattern(childB.children[childNumber].innerText)
  );
}

function formatSalary(salary) {
  let salaryCopy = salary;
  salaryCopy = salaryCopy.replace(/\$|,/g, '');

  salaryCopy = Number(salaryCopy).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return salaryCopy.replace(/\.00$/, '');
}

tbody.addEventListener('click', (e) => {
  state.selectedPerson = e.target.closest('tr');

  [...tbody.children].forEach((element) => {
    if (!state.selectedPerson) {
      return;
    }

    if (element === state.selectedPerson) {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }
  });
});

tbody.addEventListener('dblclick', (e) => {
  if (e.target.tagName) {
    const target = e.target;

    state.editedField = target;

    let value = target.innerText;

    target.innerHTML = '';

    const input = document.createElement('input');

    input.value = value;
    input.classList.add('cell-input');

    target.append(input);
    input.focus();

    const salaryField = target === target.parentElement.lastElementChild;

    const saveValue = () => {
      const inputParent = input.parentElement;

      if (inputParent.tagName === 'TD') {
        value = input.value !== '' ? input.value : value;

        if (salaryField) {
          value = formatSalary(value);
        }

        inputParent.innerText = value;

        if (state.sort) {
          sortTable();
        }
      }
    };

    input.addEventListener('blur', () => {
      saveValue();
    });

    input.addEventListener('keypress', (ev) => {
      if (ev.key === 'Enter') {
        saveValue();
      }
    });
  }
});

const newEmployeeForm = document.createElement('form');

newEmployeeForm.classList.add('new-employee-form');
newEmployeeForm.method = 'GET';
newEmployeeForm.action = '/';

newEmployeeForm.innerHTML = `
    <label>
      Name: 
      <input 
        name="name" 
        type="text" 
        data-qa="name" 
        required
      >
    </label>

    <label>
      Position: 
      <input 
        name="position" 
        type="text" 
        data-qa="position" 
        required
      >
    </label>
    
    <label>
      Office:
      <select 
        name="office"
        data-qa="office"
        required  
      >  
        ${officeOptions.map(
    (option) =>
      `<option value="${option.toLowerCase()}">${option}</option>`
  )}
      </select>
    </label>

    <label>
      Age: 
      <input 
        name="age" 
        type="number" 
        data-qa="age" 
        required
      >
    </label>

    <label>
      Salary: 
      <input 
        name="salary" 
        type="number" 
        data-qa="salary" 
        required
      >
    </label>

    <button type="submit"> 
      Save to table
    </button>
`;

newEmployeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(newEmployeeForm);
  const formData = Object.fromEntries(data.entries());

  const { age, name: nameValue, salary } = formData;

  if (age < 18) {
    state.notifications.error.push(
      'The data is invalid: minimum value for age is 18'
    );
  }

  if (age > 90) {
    state.notifications.error.push(
      'The data is invalid: maximum value for age is 90'
    );
  }

  if (nameValue.length < 4) {
    state.notifications.error.push(
      'The data is invalid: name should have at least 4 letters'
    );
  }

  if (salary < 0) {
    state.notifications.error.push(
      'The data is invalid: salaty cannot be a negative number'
    );
  }

  formData.salary = formatSalary(salary);

  if (state.notifications.error.length) {
    renderNotifications();

    return;
  }

  const tr = document.createElement('tr');

  Object.values(formData).forEach((value) => {
    const td = document.createElement('td');

    td.innerText = value;
    tr.append(td);
  });

  tbody.append(tr);

  state.notifications.success.push('New employee hab been successfully added');

  newEmployeeForm.reset();
  renderNotifications();
});

document.body.append(newEmployeeForm);

function renderNotifications() {
  const stateNotifications = Object.entries(state.notifications);

  for (const [key, value] of stateNotifications) {
    for (const message of value) {
      const notofication = document.createElement('div');

      notofication.classList.add(key);
      notofication.classList.add('notification');
      notofication.innerText = message;
      document.body.append(notofication);

      setTimeout(() => {
        document.body.removeChild(notofication);
      }, 3000);
    }
  }

  state.notifications.error = [];
  state.notifications.success = [];
};

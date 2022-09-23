'use strict';

function formatSalaryToNumber(salary) {
  return Number(salary.replace(/\$|,/gi, ''));
};

function formatNumberToSalary(num) {
  return `$${num.toLocaleString('en')}`;
};

function getEmployees(nodeListOfEmployees) {
  const employeesItems = [...nodeListOfEmployees];

  return employeesItems.map((employee) => ({
    name: employee.cells[0].textContent,
    position: employee.cells[1].textContent,
    office: employee.cells[2].textContent,
    age: Number(employee.cells[3].textContent),
    salary: formatSalaryToNumber(employee.cells[4].textContent),
  }));
};

function createSorterByKey(field, asc = true) {
  return (prev, curr) => {
    if (typeof curr[field] === 'string') {
      const sortMultiplier = asc ? 1 : -1;

      return prev[field].localeCompare(curr[field]) * sortMultiplier;
    }

    if (asc) {
      return prev[field] - curr[field];
    }

    return curr[field] - prev[field];
  };
};

function updateEmployeesMarkup(employeesList) {
  let tableBodyMarkup = '';

  for (const employee of employeesList) {
    const tableEmployeeMarkup = `
      <tr>
        <td>${employee.name}</td>
        <td>${employee.position}</td>
        <td>${employee.office}</td>
        <td>${employee.age}</td>
        <td>${formatNumberToSalary(employee.salary)}</td>
      </tr>
    `;

    tableBodyMarkup += tableEmployeeMarkup;
  }

  tableBody.innerHTML = tableBodyMarkup;
}

function createForm() {
  const formMarkup = `
    <form class="new-employee-form">
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
          <option value="Tokyo">Tokyo</option>
          <option value="Singapore">Singapore</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="San Francisco">San Francisco</option>
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
      <button type="sumbit">Save to table</button>
    </form>
  `;

  document.body.insertAdjacentHTML('beforeend', formMarkup);
}

createForm();

function isValid(formElements) {
  const minNameLength = 4;
  const minAgeValue = 18;
  const maxAgeValue = 90;

  const inputNameLength = formElements.name.value.length;
  const inputAge = formElements.age.value;

  if (
    inputNameLength < minNameLength
    || inputAge < minAgeValue
    || inputAge > maxAgeValue
  ) {
    return false;
  }

  return true;
}

function pushNotification(posTop, posRight, title, description, type) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.dataset.qa = 'notification';

  notification.innerHTML = `
    <h2 class="title">
      ${title}
    </h2>
    <p>
      ${description}
    </p>
  `;

  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;
  notification.style.transition = `opacity .3s`;
  notification.style.opacity = '0';

  document.body.insertAdjacentElement('beforeend', notification);

  setTimeout(() => {
    notification.style.opacity = '1';
  }, 0);

  setTimeout(() => {
    notification.style.opacity = '0';
  }, 1700);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

function createInput(target, previousValue) {
  const targetStyle = window.getComputedStyle(target);
  const targetPadding = Number(targetStyle.padding.slice(0, -2));
  const inputWidth = target.clientWidth - (targetPadding * 2);

  const inputMarkup = `
    <input
      type="text"
      value="${previousValue}"
      class="cell-input"
      style="width: ${inputWidth}px"
    />
  `;

  target.innerHTML = inputMarkup;
}

function saveInputValueToTable(tableDataItem, input, previousValue) {
  if (input.value.trim() === '') {
    tableDataItem.innerHTML = previousValue;

    return;
  }

  tableDataItem.innerHTML = input.value.trim();
}

const table = document.querySelector('table');
const tableBody = table.tBodies[0];
const tableHeadings = [...table.tHead.rows[0].cells];
let employees = getEmployees(tableBody.rows);
const form = document.querySelector('.new-employee-form');

tableHeadings.forEach(heading => {
  heading.sortAsASC = true;
});

document.addEventListener('click', (e) => {
  const target = e.target;
  const tableHeading = target.closest('th');
  const tableDataItem = target.closest('td');

  if (tableHeading && !tableHeading.closest('tFoot')) {
    const sortKey = tableHeading.textContent.trim('').toLowerCase();
    const isASCSort = tableHeading.sortAsASC;
    const compareFunction = createSorterByKey(sortKey, isASCSort);

    employees.sort(compareFunction);
    updateEmployeesMarkup(employees);
    tableHeading.sortAsASC = !isASCSort;
  }

  if (tableDataItem) {
    const previusActiveRow = tableBody.querySelector('.active');

    previusActiveRow && previusActiveRow.classList.remove('active');
    tableDataItem.closest('tr').classList.toggle('active');
  }

  if (tableDataItem && e.detail === 2) {
    const previousValue = tableDataItem.textContent.trim();

    createInput(tableDataItem, previousValue);

    const input = document.querySelector('.cell-input');

    input.focus();

    input.addEventListener('blur', (blurEvent) => {
      saveInputValueToTable(tableDataItem, blurEvent.target, previousValue);
      employees = getEmployees(tableBody.rows);
    });

    input.addEventListener('keypress', (keypressEvent) => {
      const currentInput = keypressEvent.target;

      if (keypressEvent.key === 'Enter') {
        saveInputValueToTable(tableDataItem, currentInput, previousValue);
        employees = getEmployees(tableBody.rows);
      }
    });
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!isValid(form.elements)) {
    pushNotification(10, 10, 'Error', 'Message example.', 'error');

    return;
  }

  const newEmployee = {
    name: form.elements.name.value,
    position: form.elements.position.value,
    office: form.elements.office.value,
    age: form.elements.age.value,
    salary: formatSalaryToNumber(form.elements.salary.value),
  };

  employees.unshift(newEmployee);
  updateEmployeesMarkup(employees);
  pushNotification(10, 10, 'Complete', 'Message example.', 'success');
});

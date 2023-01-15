'use strict';

const header = document.querySelector('thead');
const body = document.querySelector('tbody');

let counter = 0;
let currentIndex = null;

header.addEventListener('click', (evt) => {
  const indexTitle = evt.target.cellIndex;

  const container = [...body.querySelectorAll('tr')]
    .sort((x, y) => {
      const innerTextX = x.children[indexTitle].innerText;
      const innerTextY = y.children[indexTitle].innerText;

      switch (indexTitle) {
        case 0:
        case 1:
        case 2:
          return innerTextX.localeCompare(innerTextY);

        case 3:
          return +innerTextX - +innerTextY;

        case 4:
          const numX = (innerTextX.replace('$', '').replaceAll(',', ''));
          const numY = +(innerTextY.replace('$', '').replaceAll(',', ''));

          return numX - numY;

        default:
          return 0;
      }
    });

  counter = indexTitle === currentIndex
    ? counter
    : 0;

  if (counter % 2 === 1) {
    body.append(...container.reverse());
  } else {
    body.append(...container);
  }

  counter++;
  currentIndex = indexTitle;
});

body.addEventListener('click', (evt) => {
  const selectedRow = evt.target.parentElement;

  [...body.querySelectorAll('tr')].forEach(element => {
    element.classList.remove('active');
  });

  selectedRow.classList.add('active');
});

const newEmployeeForm = document.createElement('form');

newEmployeeForm.classList.add(`new-employee-form`);
document.body.append(newEmployeeForm);

newEmployeeForm.innerHTML = `
  <label> 
    Name:
      <input name="name" type="text" data-qa="name" required>
  </label>
  <label> 
    Position:
      <input name="position" type="text" data-qa="position" required>
  </label>
  <label> 
    Office:
      <select name="office" type="text" data-qa="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San francisco">San Francisco</option>
      </select>
  </label>
  <label> 
    Age:
      <input name="age" type="number" required>
  </label>
  <label> 
    Salary:
      <input name="salary" type="number" required>
  </label>
  <button type="submit">Save to table</button>
  `;

newEmployeeForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const data = Object.fromEntries(new FormData(newEmployeeForm));
  const employee = document.createElement('tr');

  employee.innerHTML = `
    <tr>
      <td>${data.name}</td>
      <td>${data.position}</td>
      <td>${data.office}</td>
      <td>${data.age}</td>
      <td>${'$' + (+data.salary).toLocaleString('en-US')}</td>
    </tr>
  `;

  if (data.name.length < 4) {
    pushNotification('Error', 'Name should have more than 3 letters');
  } else if (data.age < 18 || data > 90) {
    pushNotification('Error', 'Incorrect age', 'error');
  } else {
    body.append(employee);
    pushNotification('Success', 'Employee added successfully', 'success');
  }

  newEmployeeForm.reset();
});

body.addEventListener('dblclick', (evt) => {
  const selectedCell = evt.target;
  const previousValue = selectedCell.textContent;
  const newCell = document.createElement('input');

  newCell.classList.add('cell-input');

  switch (selectedCell.cellIndex) {
    case 3:
      newCell.setAttribute('type', 'number');

      break;

    default:
      newCell.setAttribute('type', 'text');

      break;
  }

  selectedCell.textContent = '';

  selectedCell.append(newCell);
  newCell.focus();

  const modifyCell = function() {
    switch (selectedCell.cellIndex) {
      case 0:
        if (newCell.value.length < 4) {
          pushNotification('Error', 'Name should have more than 3 letters');
          newCell.value = previousValue;
        }

        break;

      case 3:
        if (newCell.value < 18 || newCell.value > 90) {
          pushNotification('Error', 'Incorrect age', 'error');
          newCell.value = previousValue;
        }

        break;

      case 4:
        newCell.value = newCell.value !== ''
          ? '$' + Number(newCell.value).toLocaleString('en-US')
          : previousValue;

        break;

      default:
        if (newCell.value === '') {
          newCell.value = previousValue;
        }

        break;
    }
  };

  newCell.addEventListener('blur', () => {
    modifyCell();
  });

  newCell.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') {
      modifyCell();
    }
  });
});

function pushNotification(tittle, description, type) {
  const container = document.createElement('div');
  const tittleElement = document.createElement('h2');
  const descriptionElement = document.createElement('p');

  container.classList.add('notification', type);
  tittleElement.classList.add('title');
  tittleElement.textContent = tittle;
  descriptionElement.textContent = description;

  container.append(tittleElement);
  tittleElement.append(descriptionElement);
  document.body.append(container);

  setTimeout(() => {
    container.remove();
  }, 3000);
}

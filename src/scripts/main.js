'use strict';

const head = document.querySelector('thead');
const body = document.querySelector('tbody');

let count = 0;

head.addEventListener('click', (e) => {
  const sort = e.target.cellIndex;

  count++;

  const sorted = [...body.children].sort((a, b) => {
    let one = a.cells[sort].innerText;
    let two = b.cells[sort].innerText;

    if (one.includes('$')) {
      one = one.replace(/[$,]/g, '');
      two = two.replace(/[$,]/g, '');

      return one - two;
    }

    return one.localeCompare(two);
  });

  if (count % 2 === 1) {
    body.append(...sorted);
  } else {
    body.append(...sorted.reverse());
  }
});

body.addEventListener('click', (e) => {
  const target = e.target;

  [...body.rows].forEach(row => row.classList.contains('active')
    ? row.classList.remove('active')
    : target.parentNode.classList.add('active'));
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.append(form);

form.insertAdjacentHTML('afterbegin', `
<label>
  Name:
    <input name="name" data-qa="name" type="text" min = '4'>
</label>
<label>
  Position:
    <input 
      name="position"
      data-qa="position"
      type="text"
    >
</label>
<label>
  Office: 
    <select
      name="office"
      data-qa="office"
      type="text"
    >
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
    </select>
</label>
<label>
  Age: 
    <input 
      name="age"
      data-qa="age" 
      type="number"
    >
</label>
<label>
  Salary:
    <input 
      name="salary"
      data-qa="salary" 
      type="number" 
      min = '0'
    >
</label>
<button type='submit'>Save to table</button>
`);

const input = [...form.querySelectorAll('input')];
const options = form.querySelector('option').innerText;

const pushNotification = (title, description, type) => {
  const div = document.createElement('div');
  const p = document.createElement('p');
  const h2 = document.createElement('h2');

  div.dataset.qa = 'notification';
  div.classList.add('notification', type);

  p.innerText = description;
  h2.innerText = title;

  div.append(h2);
  div.append(p);
  document.body.append(div);

  setTimeout(() => div.remove(), 5000);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const salary = '$' + new Intl.NumberFormat('en-GB').format(input[3].value);
  const nameEmp = input[0].value;
  const age = Number(input[2].value);
  const position = input[1].value;

  if (nameEmp.length < 4) {
    pushNotification('Oops!',
      'Name must be longer than 4 letters', 'error');
  } else if (age < 18 || age > 90) {
    pushNotification('Oh no!',
      'Age must be between 18 & 90 years', 'error');
  } else if (!position) {
    pushNotification('Error',
      'Please enter the position', 'error');
  } else if (!input[3].value) {
    pushNotification('Error', 'Please enter the salary', 'error');
  } else {
    body.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${nameEmp}</td>
        <td>${position}</td>
        <td>${options}</td>
        <td>${age}</td>
        <td>${salary}</td>
        </tr>
      `);
    pushNotification('Success', 'New employee was added', 'success');

    input.forEach(item => {
      item.value = '';
    }
    );
  }
});

let editingArea;
let isCorrect = true;

body.addEventListener('dblclick', doubleClick => {
  const target = doubleClick.target.closest('td');
  const newInput = document.querySelector('.cell-input');

  if (newInput) {
    pushNotification(
      'Error',
      'Please finish this changes',
      'error'
    );

    return editStart(newInput.parentElement);
  }

  if (!target) {
    return;
  }

  editStart(target);
});

function editStart(td) {
  editingArea = {
    elem: td,
    data: td.innerHTML,
  };

  if (td.cellIndex === 2) {
    const cellOffice = document.createElement('select');

    cellOffice.className = 'cell-input';

    cellOffice.innerHTML = `
      <select name="office"
              data-qa="office" 
              type="text"
              class="cell-input"
              class="temporary"
      >
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    `;

    td.innerHTML = '';
    td.append(cellOffice);
    cellOffice.focus();

    cellOffice.onblur = () => {
      const office = cellOffice.selectedIndex;

      td.innerHTML = cellOffice[office].value;

      if (cellOffice.selectedIndex === 0) {
        td.innerHTML = editingArea.data;
      }

      pushNotification(
        'Success',
        'Changes exepted',
        'success');
    };

    cellOffice.onkeydown = (enter) => {
      if (enter.key === 'Enter') {
        cellOffice.onblur();
      }
    };
  } else {
    const cellInput = document.createElement('input');

    cellInput.className = 'cell-input';
    cellInput.innerHTML = td.innerHTML;
    cellInput.placeholder = td.innerHTML;
    td.innerHTML = '';
    td.append(cellInput);
    cellInput.focus();

    switch (td.cellIndex) {
      case 0:
      case 1:
        cellInput.setAttribute('type', 'text');
        break;

      case 3:
      case 4:
        cellInput.setAttribute('type', 'number');
        break;
    }

    cellInput.onblur = (e) => {
      validate(td.cellIndex, cellInput);
      editEnd(editingArea.elem, isCorrect);
      changeIsCorrect();
    };

    cellInput.onkeydown = (enter) => {
      if (enter.key === 'Enter') {
        cellInput.onblur();
      }
    };
  }
};

function validate(index, cell) {
  switch (index) {
    case 0:
    case 1:
      if (/\d/.test(cell.value)
        || cell.value.trim().length < 4) {
        isCorrect = false;

        pushNotification(
          'Errir',
          'Name must be longer than 4 letters',
          'error');
      }

      break;

    case 3:
      if (cell.value < 18
        || cell.value > 90) {
        if (cell.value === '') {
          isCorrect = false;

          return;
        }

        isCorrect = false;

        pushNotification(
          'Error',
          'Age must be between 18 & 90 years',
          'error');
      }

      break;

    case 4:
      if (+cell.value <= 0) {
        if (cell.value === '') {
          isCorrect = false;

          return;
        }

        isCorrect = false;

        pushNotification(
          'Error',
          'Enter the salary',
          'error');
      }

      break;
  }
}

function editEnd(td, isOk) {
  if (isOk) {
    switch (td.cellIndex) {
      case 4:
        td.innerHTML = `${(+td.firstChild.value)
          .toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })
          .slice(0, -3)}`;

        pushNotification(
          'Success',
          'The salary was changed.',
          'success');
        break;

      case 0:
      case 1:
      case 3:
        td.innerHTML = td.firstChild.value;

        pushNotification(
          'Changed successfully!',
          'Changes was added',
          'success');
        break;
    }
  } else {
    if (td.firstChild.value === '') {
      td.innerHTML = editingArea.data;

      return;
    }

    return editStart(td);
  }

  editingArea = null;
};

function changeIsCorrect() {
  isCorrect = true;
}

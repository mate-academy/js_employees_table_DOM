'use strict';

const head = [...document.querySelectorAll('thead th')];
const body = document.querySelector('table tbody');
let ASC = true;
let lastIndex = -1;

head.forEach((el) => {
  el.addEventListener('click', (e) => {
    const rows = [...document.querySelectorAll('tbody tr')];
    const index = head.indexOf(e.currentTarget);

    if (index === lastIndex) {
      ASC = !ASC;
    } else {
      ASC = true;
      lastIndex = index;
    }

    rows.sort((a, b) => {
      let result = 0;
      const textA = a.cells[index].textContent;
      const textB = b.cells[index].textContent;

      if (index === 3) {
        result = Number(textA) - Number(textB);
      } else if (index === 4) {
        const numberA = Number(textA.replace(/[^0-9.-]+/g, ''));
        const numberB = Number(textB.replace(/[^0-9.-]+/g, ''));

        result = numberA - numberB;
      } else {
        result = textA.localeCompare(textB);
      }

      return ASC ? result : -result;
    });

    rows.forEach((row) => body.appendChild(row));
  });
});

body.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row || !body.contains(row)) {
    return;
  }

  const activeRow = body.querySelector('tr.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  row.classList.add('active');
});

function pushNotification(message, type) {
  const block = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  block.className = 'notification';
  block.classList.add(type);
  block.setAttribute('data-qa', 'notification');

  messageTitle.textContent = type;

  messageDescription.textContent = message;

  block.appendChild(messageTitle);
  block.appendChild(messageDescription);
  document.body.appendChild(block);

  setTimeout(() => {
    block.remove();
  }, 2000);
}

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label> Name: <input type="text" name="name" data-qa="name" required/></label>
  <label> Position: <input type="text" name="position" data-qa="position" required/></label>
  <label> Office:
    <select name="office" data-qa="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label> Age: <input type="number" name="age" data-qa="age" required/></label>
  <label> Salary: <input type="number" name="salary" data-qa="salary" required/></label>
  <button type="submit">Save to table</button>
`;

document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const personName = form.name.value;
  const position = form.position.value;
  const office = form.office.value;
  const age = Number(form.age.value);
  const salary = Number(form.salary.value);
  const salaryString = '$' + salary.toLocaleString('en-US');

  if (personName.length < 4) {
    pushNotification('The name must consist of at least 4 letters.', 'error');

    return;
  }

  if (!position.trim()) {
    pushNotification('The position must not be empty.', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification('Age must be between 18 and 90 years old.', 'error');

    return;
  }

  const newRow = document.createElement('tr');
  const data = [personName, position, office, age, salaryString];

  data.forEach((text) => {
    const cell = document.createElement('td');

    cell.textContent = text;
    newRow.appendChild(cell);
  });

  body.appendChild(newRow);

  pushNotification('Employee was successfully added', 'success');

  form.reset();
});

body.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  if (document.querySelector('.cell-input')) {
    return;
  }

  const originalText = cell.textContent;
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = originalText;

  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  let isSaved = false;

  const saveChanges = () => {
    if (isSaved) {
      return;
    }

    isSaved = true;

    const newValue = input.value.trim();

    input.remove();

    cell.textContent = newValue !== '' ? newValue : originalText;
  };

  input.addEventListener(
    'blur',
    () => {
      saveChanges();
    },
    { once: true },
  );

  input.addEventListener('keydown', (k) => {
    if (k.key === 'Enter') {
      saveChanges();
    }
  });
});

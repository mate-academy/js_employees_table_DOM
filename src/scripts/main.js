'use strict';

const table = document.querySelector('table');
const form = document.querySelector('.new-employee-form');
const pushNotification = (posTop, posRight, title, description, type) => {
  const container = document.createElement('div');
  const titleMessage = document.createElement('h2');
  const descriptionMessage = document.createElement('p');

  container.classList.add('notification');
  container.setAttribute('data-qa', 'notification');

  if (['success', 'error', 'warning'].includes(type)) {
    container.classList.add(type);
  }
  container.style.top = `${posTop}px`;
  container.style.right = `${posRight}px`;

  titleMessage.textContent = title;
  titleMessage.classList.add('title');
  descriptionMessage.textContent = description;

  container.appendChild(titleMessage);
  container.appendChild(descriptionMessage);
  document.body.appendChild(container);

  setTimeout(() => {
    container.style.display = 'none';
  }, 2000);
};
const toNumber = (value) => {
  let cleaned = '';

  for (const char of value) {
    if ('0123456789'.includes(char)) {
      cleaned += char;
    }
  }

  if (cleaned === '') {
    return NaN;
  }

  return Number(cleaned);
};

if (table) {
  table.addEventListener('click', (e) => {
    const th = e.target.closest('th');

    if (th) {
      const columnIndex = th.cellIndex;
      const tBodies = [...table.tBodies];

      const order = (th.dataset.order =
        th.dataset.order === 'asc' ? 'desc' : 'asc');
      const dir = order === 'asc' ? 1 : -1;

      if (!tBodies || tBodies.length === 0) {
        return;
      }

      tBodies.forEach((tBody) => {
        const rows = [...tBody.rows];

        rows.sort((rowA, rowB) => {
          const a = rowA.cells[columnIndex].textContent.trim();
          const b = rowB.cells[columnIndex].textContent.trim();

          const numberA = toNumber(a);
          const numberB = toNumber(b);

          let result;

          if (!isNaN(numberA) && !isNaN(numberB)) {
            result = numberA - numberB;
          } else {
            result = a.localeCompare(b, undefined, {
              numeric: true,
              sensitivity: 'base',
            });
          }

          return result * dir;
        });

        tBody.append(...rows);
      });
    }

    const row = e.target.closest('tbody tr');

    if (row) {
      const prev = table.querySelector('.active');

      if (prev) {
        prev.classList.remove('active');
      }
      row.classList.add('active');
    }
  });
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = form.elements['name'];
    const positionInput = form.elements['position'];
    const officeSelect = form.elements['office'];
    const ageInput = form.elements['age'];
    const salaryInput = form.elements['salary'];

    const nameValue = nameInput.value.trim();
    const positionValue = positionInput.value.trim();
    const ageRawValue = ageInput.value.trim();
    const salaryRawValue = salaryInput.value.trim();

    if (!nameValue) {
      pushNotification(24, 24, 'Invalid name', 'Name is required.', 'error');

      return;
    }

    if (!positionValue) {
      pushNotification(
        24,
        24,
        'Invalid position',
        'Position is required.',
        'error',
      );

      return;
    }

    if (!ageRawValue) {
      pushNotification(24, 24, 'Invalid age', 'Age is required.', 'error');

      return;
    }

    if (!salaryRawValue) {
      pushNotification(
        24,
        24,
        'Invalid salary',
        'Salary is required.',
        'error',
      );

      return;
    }

    if (nameValue.length < 4) {
      pushNotification(
        24,
        24,
        'Invalid name',
        'Name must be at least 4 characters long.',
        'error',
      );

      return;
    }

    const ageValue = Number(ageRawValue);

    if (Number.isNaN(ageValue) || ageValue < 18 || ageValue > 90) {
      pushNotification(
        24,
        24,
        'Invalid age',
        'Age must be between 18 and 90.',
        'error',
      );

      return;
    }

    const salaryNumber = Number(salaryRawValue);

    if (Number.isNaN(salaryNumber)) {
      pushNotification(
        24,
        24,
        'Invalid salary',
        'Salary must be a number.',
        'error',
      );

      return;
    }

    const tr = document.createElement('tr');

    const nameTd = document.createElement('td');

    nameTd.textContent = nameValue;
    tr.appendChild(nameTd);

    const positionTd = document.createElement('td');

    positionTd.textContent = positionValue;
    tr.appendChild(positionTd);

    const officeTd = document.createElement('td');

    officeTd.textContent = officeSelect.value;
    tr.appendChild(officeTd);

    const ageTd = document.createElement('td');

    ageTd.textContent = ageValue;
    tr.appendChild(ageTd);

    const salaryTd = document.createElement('td');

    salaryTd.textContent = `$${salaryNumber.toLocaleString('en-US')}`;
    tr.appendChild(salaryTd);

    const tBodies = [...table.tBodies];
    const tBody = tBodies[0];

    tBody.appendChild(tr);

    form.reset();

    pushNotification(
      24,
      24,
      'Employee added',
      'New employee has been added to the table.',
      'success',
    );
  });
}

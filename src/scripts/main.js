'use strict';

const thead = document.querySelector('thead tr');
const tbody = document.querySelector('tbody');

const form = document.querySelector('.new-employee-form');

const headers = thead.querySelectorAll('th');

tbody.addEventListener('click', (e) => {
  const targetRow = e.target.closest('tr');

  if (!targetRow) {
    return;
  }

  const prevActive = tbody.querySelector('tr.active');

  if (prevActive) {
    prevActive.classList.remove('active');
  }

  targetRow.classList.add('active');
});

tbody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td || tbody.querySelector('.cell-input')) {
    return;
  }

  const oldValue = td.textContent.trim();
  const editInput = document.createElement('input');

  editInput.classList.add('cell-input');
  editInput.value = oldValue;

  td.textContent = '';
  td.append(editInput);
  editInput.focus();

  const save = () => {
    const newValue = editInput.value.trim();

    td.textContent = newValue !== '' ? newValue : oldValue;

    if (sortState.idx !== null) {
      applyCurrentSort();
    }
  };

  editInput.addEventListener('blur', save);

  editInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      save();
    }
  });
});

const sortState = { idx: null, dir: 1 };

function applyCurrentSort() {
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const { idx, dir } = sortState;

  rows.sort((a, b) => {
    const va = a.cells[idx].textContent.trim();
    const vb = b.cells[idx].textContent.trim();
    const na = Number(va);
    const nb = Number(vb);

    if (isFinite(na) && isFinite(nb) && va !== '' && vb !== '') {
      return (na - nb) * dir;
    }

    return va.localeCompare(vb, undefined, { sensitivity: 'base' }) * dir;
  });

  rows.forEach((r) => tbody.append(r));
}

headers.forEach((th, index) => {
  th.addEventListener('click', () => {
    if (index === sortState.idx) {
      sortState.dir *= -1;
    } else {
      sortState.idx = index;
      sortState.dir = 1;
    }
    applyCurrentSort();
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const currentFd = new FormData(form);
  const currentName = currentFd.get('name')?.trim() || '';
  const position = currentFd.get('position')?.trim() || '';
  const office = currentFd.get('office')?.trim() || '';
  const ageValue = currentFd.get('age');
  const salaryValue = currentFd.get('salary');

  if (!currentName || !position || !office || !ageValue || !salaryValue) {
    showNotification('All fields are required');

    return;
  }

  if (currentName.length < 4) {
    showNotification('Name must be at least 4 characters');

    return;
  }

  const ages = Number(ageValue);

  if (ages < 18 || ages > 90 || isNaN(ages)) {
    showNotification('Age must be between 18 and 90');

    return;
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  const formattedSalary = formatter.format(Number(salaryValue));

  const newRow = document.createElement('tr');

  [currentName, position, office, ageValue, formattedSalary].forEach((text) => {
    const td = document.createElement('td');

    td.textContent = text;
    newRow.append(td);
  });

  tbody.append(newRow);
  showNotification('Employee added!', false);
  form.reset();

  if (sortState.idx !== null) {
    applyCurrentSort();
  }
});

function showNotification(message, isError = true) {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.textContent = message;
  notification.className = isError ? 'error' : 'success';

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

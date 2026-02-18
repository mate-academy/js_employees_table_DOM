'use strict';

// write code here

function employeesTable() {
  const table = document.querySelector('table');

  if (!table) {
    return;
  }

  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');

  if (!thead || !tbody) {
    return;
  }

  const parseSalary = (text) => {
    const cleaned = String(text).replace(/[$,]/g, '');
    const n = Number(cleaned);

    return Number.isFinite(n) ? n : 0;
  };

  const formatSalary = (n) => {
    const safe = Number.isFinite(n) ? n : 0;

    return '$' + Math.round(safe).toLocaleString('en-US');
  };

  const getCellValue = (row, index) => {
    const cell = row.children[index];

    return cell ? cell.textContent.trim() : '';
  };

  let sortIndex = -1;
  let sortDir = 'asc';

  const compareRows = (a, b, index, dir) => {
    let compare = 0;

    if (index === 3) {
      const n1 = Number(getCellValue(a, index));
      const n2 = Number(getCellValue(b, index));

      compare = n1 - n2;
    } else if (index === 4) {
      const s1 = parseSalary(getCellValue(a, index));
      const s2 = parseSalary(getCellValue(b, index));

      compare = s1 - s2;
    } else {
      const t1 = getCellValue(a, index).toLowerCase();
      const t2 = getCellValue(b, index).toLowerCase();

      compare = t1.localeCompare(t2);
    }

    return dir === 'desc' ? -compare : compare;
  };

  const sortTbody = (index, dir) => {
    const rows = Array.from(tbody.querySelectorAll('tr'));

    if (rows.length === 0) {
      return;
    }

    rows.sort((r1, r2) => compareRows(r1, r2, index, dir));

    tbody.innerHTML = '';
    rows.forEach((row) => tbody.append(row));
  };

  thead.addEventListener('click', (e) => {
    const th = e.target.closest('th');

    if (!th || !thead.contains(th)) {
      return;
    }

    const headers = Array.from(th.parentElement.children);
    const index = headers.indexOf(th);

    if (index < 0) {
      return;
    }

    if (index === sortIndex) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortIndex = index;
      sortDir = 'asc';
    }

    sortTbody(sortIndex, sortDir);
  });

  tbody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (!row || !tbody.contains(row)) {
      return;
    }

    tbody.querySelectorAll('tr.active').forEach((r) => {
      r.classList.remove('active');
    });

    row.classList.add('active');
  });

  const pushNotification = (title, description, type) => {
    let safeType = type;

    const allowedTypes = ['success', 'error', 'warning'];

    if (!allowedTypes.includes(safeType)) {
      safeType = 'success';
    }

    const notification = document.createElement('div');

    notification.classList.add('notification', safeType);
    notification.dataset.qa = 'notification';

    const h2 = document.createElement('h2');

    h2.classList.add('title');
    h2.textContent = String(title);

    const p = document.createElement('p');

    p.classList.add('description');
    p.textContent = String(description);

    notification.append(h2);
    notification.append(p);

    document.querySelectorAll('[data-qa="notification"]').forEach((n) => {
      n.style.display = 'none';
    });

    document.body.append(notification);

    setTimeout(() => {
      notification.style.display = 'none';
    }, 2000);
  };

  const makeInput = (labelText, nameInpt, type = 'text', qa = nameInpt) => {
    const label = document.createElement('label');

    label.textContent = labelText + ': ';

    const input = document.createElement('input');

    input.name = nameInpt;
    input.type = type;
    input.dataset.qa = qa;

    label.append(input);

    return { label, input };
  };

  const makeOfficeSelect = () => {
    const label = document.createElement('label');

    label.textContent = 'Office: ';

    const select = document.createElement('select');

    select.name = 'office';
    select.dataset.qa = 'office';

    const offices = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    for (const office of offices) {
      const option = document.createElement('option');

      option.value = office;
      option.textContent = office;
      select.append(option);
    }

    label.append(select);

    return { label, select };
  };

  const createForm = () => {
    const newForm = document.createElement('form');

    newForm.className = 'new-employee-form';

    const { label: nameLabel, input: nameInputEl } = makeInput(
      'Name',
      'name',
      'text',
      'name',
    );

    const { label: positionLabel, input: positionInputEl } = makeInput(
      'Position',
      'position',
      'text',
      'position',
    );

    const { label: ageLabel, input: ageInputEl } = makeInput(
      'Age',
      'age',
      'number',
      'age',
    );

    const { label: salaryLabel, input: salaryInputEl } = makeInput(
      'Salary',
      'salary',
      'number',
      'salary',
    );

    const { label: officeLabel, select: officeSelectEl } = makeOfficeSelect();

    const submitBtn = document.createElement('button');

    submitBtn.type = 'submit';
    submitBtn.textContent = 'Save to table';

    newForm.append(
      nameLabel,
      positionLabel,
      officeLabel,
      ageLabel,
      salaryLabel,
      submitBtn,
    );

    table.after(newForm);

    return {
      form: newForm,
      nameInput: nameInputEl,
      positionInput: positionInputEl,
      officeSelect: officeSelectEl,
      ageInput: ageInputEl,
      salaryInput: salaryInputEl,
    };
  };

  const {
    form,
    nameInput,
    positionInput,
    officeSelect,
    ageInput,
    salaryInput,
  } = createForm();

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameSubmit = nameInput.value.trim();
    const position = positionInput.value.trim();
    const office = officeSelect.value;

    const ageRaw = ageInput.value.trim();
    const salaryRaw = salaryInput.value.trim();

    if (!nameSubmit || !position || !office || !ageRaw || !salaryRaw) {
      pushNotification('Error', 'All fields are required', 'error');

      return;
    }

    const age = Number(ageRaw);
    const salary = Number(salaryRaw);

    if (!Number.isFinite(age) || !Number.isFinite(salary)) {
      pushNotification('Error', 'All fields are required', 'error');

      return;
    }

    if (nameSubmit.length < 4) {
      pushNotification('Error', 'Name must be at least 4 letters', 'error');

      return;
    }

    if (age < 18 || age > 90) {
      pushNotification('Error', 'Age must be between 18 and 90', 'error');

      return;
    }

    if (!tbody) {
      return;
    }

    const tr = document.createElement('tr');

    const tdName = document.createElement('td');

    tdName.textContent = nameSubmit;

    const tdPos = document.createElement('td');

    tdPos.textContent = position;

    const tdOffice = document.createElement('td');

    tdOffice.textContent = office;

    const tdAge = document.createElement('td');

    tdAge.textContent = String(age);

    const tdSalary = document.createElement('td');

    tdSalary.textContent = formatSalary(salary);

    tr.append(tdName, tdPos, tdOffice, tdAge, tdSalary);
    tbody.append(tr);

    pushNotification('Success', 'Employee added', 'success');
    form.reset();
  });

  let editingCell = null;

  tbody.addEventListener('dblclick', (e) => {
    const td = e.target.closest('td');

    if (!td || editingCell) {
      return;
    }

    editingCell = td;

    const oldValue = td.textContent;

    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = oldValue;

    td.textContent = '';
    td.append(input);
    input.focus();

    function commitEdit() {
      const newValue = input.value.trim();

      td.textContent = newValue || oldValue;
      editingCell = null;
    }

    input.addEventListener('blur', commitEdit);

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        commitEdit();
      }
    });
  });
}

employeesTable();

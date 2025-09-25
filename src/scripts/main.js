'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const moneyToText = (value) => {
    if (value === '' || value == null || isNaN(+value)) {
      return '';
    }

    return (
      '$' +
      Number(value)
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    );
  };

  const textToMoneyNumber = (text) =>
    Number(String(text).replace(/[^\d.-]/g, '')) || 0;

  const table = $('table');
  const tbody = table ? $('tbody', table) : null;

  if (!table || !tbody) {
    return;
  }

  const currentSort = { index: null, dir: 1 };

  function sortBy(index, dir) {
    currentSort.index = index;
    currentSort.dir = dir;

    const rows = $$('tr', tbody);
    const getCellValue = (tr, idx) => tr.children[idx].textContent.trim();

    const compare = (a, b) => {
      const vaRaw = getCellValue(a, index);
      const vbRaw = getCellValue(b, index);

      const sa = vaRaw.replace(/[^0-9.-]/g, '');
      const sb = vbRaw.replace(/[^0-9.-]/g, '');
      const isNumA = sa !== '' && /\d/.test(sa);
      const isNumB = sb !== '' && /\d/.test(sb);

      if (isNumA && isNumB) {
        return (Number(sa) - Number(sb)) * dir;
      }

      return (
        vaRaw.localeCompare(vbRaw, undefined, { sensitivity: 'base' }) * dir
      );
    };

    rows.sort(compare).forEach((tr) => tbody.appendChild(tr));
  }

  const headerIndex = (th) => [...th.parentElement.children].indexOf(th);

  function onHeaderClick(e) {
    const th = e.target.closest('th');

    if (!th || !table.contains(th)) {
      return;
    }

    const index = headerIndex(th);

    if (currentSort.index === index) {
      sortBy(index, -currentSort.dir);
    } else {
      sortBy(index, 1);
    }
  }

  function onHeaderDblClick(e) {
    const th = e.target.closest('th');

    if (!th || !table.contains(th)) {
      return;
    }

    const index = headerIndex(th);

    sortBy(index, -1);
  }

  table.addEventListener('click', (e) => {
    if (e.target.closest('thead th') || e.target.closest('tfoot th')) {
      onHeaderClick(e);
    }
  });

  table.addEventListener('dblclick', (e) => {
    if (e.target.closest('thead th') || e.target.closest('tfoot th')) {
      onHeaderDblClick(e);
    }
  });

  tbody.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');

    if (!tr) {
      return;
    }
    $$('.active', tbody).forEach((row) => row.classList.remove('active'));
    tr.classList.add('active');
  });

  const pushNotification = (posTop, posRight, title, description, type) => {
    let n = $('[data-qa="notification"]');

    if (!n) {
      n = document.createElement('div');
      n.setAttribute('data-qa', 'notification');
      n.className = 'notification';
      document.body.appendChild(n);
    }
    n.classList.remove('success', 'error', 'warning');
    n.classList.add(type);
    n.style.top = `${posTop}px`;
    n.style.right = `${posRight}px`;
    n.innerHTML = '';

    const h2 = document.createElement('h2');

    h2.className = 'title';
    h2.textContent = title;

    const p = document.createElement('p');

    p.textContent = description;

    n.append(h2, p);
  };

  function buildForm() {
    const form = document.createElement('form');

    form.className = 'new-employee-form';

    form.innerHTML = `
      <fieldset>
        <legend>New employee</legend>
        <label>Name:
          <input data-qa="name" name="name" type="text" />
        </label>
        <label>Position:
          <input data-qa="position" name="position" type="text" />
        </label>
        <label>Office:
          <select data-qa="office" name="office">
            <option value="Tokyo">Tokyo</option>
            <option value="Singapore">Singapore</option>
            <option value="London">London</option>
            <option value="New York">New York</option>
            <option value="Edinburgh">Edinburgh</option>
            <option value="San Francisco">San Francisco</option>
          </select>
        </label>
        <label>Age:
          <input data-qa="age" name="age" type="number" inputmode="numeric" />
        </label>
        <label>Salary:
          <input data-qa="salary" name="salary" type="number" inputmode="numeric" />
        </label>
        <button type="submit">Save to table</button>
      </fieldset>
    `;
    table.insertAdjacentElement('afterend', form);

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const empName = form.name.value.trim();
      const position = form.position.value.trim();
      const office = form.office.value;
      const ageStr = String(form.age.value).trim();
      const salaryStr = String(form.salary.value).trim();

      if (
        !empName ||
        !position ||
        !office ||
        ageStr === '' ||
        salaryStr === ''
      ) {
        pushNotification(10, 10, 'Помилка', 'Усі поля обовʼязкові.', 'error');

        return;
      }

      if (empName.length < 4) {
        pushNotification(
          10,
          10,
          'Помилка',
          'Name має містити щонайменше 4 літери.',
          'error',
        );

        return;
      }

      const age = Number(ageStr);
      const salary = Number(salaryStr);

      if (!Number.isFinite(age) || age < 18 || age > 90) {
        pushNotification(
          10,
          10,
          'Помилка',
          'Age має бути числом від 18 до 90.',
          'error',
        );

        return;
      }

      if (!Number.isFinite(salary) || salary <= 0) {
        pushNotification(
          10,
          10,
          'Помилка',
          'Salary має бути додатнім числом.',
          'error',
        );

        return;
      }

      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${empName}</td>
        <td>${position}</td>
        <td>${office}</td>
        <td>${Math.trunc(age)}</td>
        <td>${moneyToText(salary)}</td>
      `;
      tbody.appendChild(tr);

      pushNotification(
        10,
        10,
        'Успіх',
        'Співробітника додано до таблиці.',
        'success',
      );
      form.reset();
    });
  }
  buildForm();

  let editing = null;

  function beginEdit(td) {
    if (editing) {
      endEdit(true);
    }

    const oldText = td.textContent;
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.type = 'text';

    input.value =
      td.cellIndex === 4 ? String(textToMoneyNumber(oldText)) : oldText;

    td.textContent = '';
    td.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => endEdit(true));

    editing = { td, oldText, input };
  }

  function endEdit(save) {
    if (!editing) {
      return;
    }

    const { td, oldText, input } = editing;
    const newVal = input.value.trim();

    if (!save || newVal === '') {
      td.textContent = oldText;
    } else {
      if (td.cellIndex === 3) {
        const num = Number(newVal);

        td.textContent = Number.isFinite(num)
          ? String(Math.trunc(num))
          : oldText;
      } else if (td.cellIndex === 4) {
        const num = Number(newVal);

        td.textContent = Number.isFinite(num) ? moneyToText(num) : oldText;
      } else {
        td.textContent = newVal;
      }
    }
    editing = null;
  }

  tbody.addEventListener('dblclick', (e) => {
    const td = e.target.closest('td');

    if (!td) {
      return;
    }
    beginEdit(td);
  });

  document.addEventListener('keydown', (e) => {
    if (!editing) {
      return;
    }

    if (e.key === 'Enter') {
      endEdit(true);
    } else if (e.key === 'Escape') {
      endEdit(false);
    }
  });
});

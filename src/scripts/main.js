'use strict';

// ===== helpers =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const make = (tag, attrs = {}, text = '') => {
  const el = document.createElement(tag);

  Object.entries(attrs).forEach(([k, v]) => {
    // eslint-disable-next-line curly
    if (k === 'class') el.className = v;
    // eslint-disable-next-line curly
    else el.setAttribute(k, v);
  });
  // eslint-disable-next-line curly
  if (text !== '') el.textContent = text;

  return el;
};

// число навіть з "$50,000"
const toNumber = (val) => {
  const n = parseFloat(String(val).replace(/[^\d.-]/g, ''));

  return Number.isFinite(n) ? n : null;
};

// ===== notifications =====
const ensureNotification = () => {
  let box = $('[data-qa="notification"]');

  if (!box) {
    box = make('div', { 'data-qa': 'notification', class: 'notification' });
    document.body.appendChild(box);
  }

  return box;
};

// eslint-disable-next-line no-shadow
const showNote = (status, title, description = '') => {
  const box = ensureNotification();

  box.classList.remove('error', 'success');

  if (['error', 'success'].includes(status)) {
    box.classList.add(status);
  }

  box.innerHTML = '';

  const h2 = make('h2', { class: 'title' }, String(title || ''));
  const p = make('p', {}, String(description || ''));

  box.append(h2, p);

  // не видаляємо з DOM — лише показуємо
  box.style.display = 'block';
};

// ===== main =====
document.addEventListener('DOMContentLoaded', () => {
  ensureNotification();

  const table = $('table');
  const thead = $('thead', table);
  const tbody = $('tbody', table);

  // ---------- Сортування ----------
  let currentSortCol = null;
  let isAsc = true;

  thead.addEventListener('click', (e) => {
    const th = e.target.closest('th');

    // eslint-disable-next-line curly
    if (!th) return;

    const colIndex = th.cellIndex;

    // скидаємо індикатори
    $$('th', thead).forEach((h) => h.classList.remove('sort-asc', 'sort-desc'));

    // клік по тій самій колонці — міняємо напрямок; по іншій — завжди ASC
    if (currentSortCol === colIndex) {
      isAsc = !isAsc;
    } else {
      currentSortCol = colIndex;
      isAsc = true;
    }

    th.classList.add(isAsc ? 'sort-asc' : 'sort-desc');

    const rows = $$('tr', tbody);

    rows.sort((ra, rb) => {
      const a = ra.cells[colIndex].textContent.trim();
      const b = rb.cells[colIndex].textContent.trim();

      const na = toNumber(a);
      const nb = toNumber(b);

      if (na !== null && nb !== null) {
        return isAsc ? na - nb : nb - na;
      }

      return isAsc ? a.localeCompare(b) : b.localeCompare(a);
    });

    rows.forEach((r) => tbody.appendChild(r));
  });

  // ---------- Вибір рядка (active) ----------
  tbody.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');

    // eslint-disable-next-line curly
    if (!tr) return;

    $$('tr', tbody).forEach((row) => row.classList.remove('active'));
    tr.classList.add('active');
  });

  // ---------- Динамічна форма ----------
  // Вимоги: .new-employee-form; labels + inputs; data-qa для інпутів;
  // select: Tokyo, Singapore, London, New York, Edinburgh, San Francisco

  const buildForm = () => {
    const form = make('form', { class: 'new-employee-form' });

    const field = (labelText, inputAttrs) => {
      const label = make('label', {}, labelText);
      const input = make('input', inputAttrs);

      label.append(' ', input);

      return { label, input };
    };

    const nameF = field('Name:', {
      type: 'text',
      name: 'name',
      'data-qa': 'name',
    });

    const positionF = field('Position:', {
      type: 'text',
      name: 'position',
      'data-qa': 'position',
    });

    // select Office
    const officeLabel = make('label', {}, 'Office:');
    const office = make('select', { name: 'office', 'data-qa': 'office' });

    [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ].forEach((city) => office.append(make('option', { value: city }, city)));
    officeLabel.append(' ', office);

    const ageF = field('Age:', {
      type: 'number',
      name: 'age',
      'data-qa': 'age',
    });

    const salaryF = field('Salary:', {
      type: 'number',
      name: 'salary',
      'data-qa': 'salary',
    });

    const btn = make('button', { type: 'submit' }, 'Save to table');

    form.append(
      nameF.label,
      positionF.label,
      officeLabel,
      ageF.label,
      salaryF.label,
      btn,
    );

    // ----- Валідація + додавання -----
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // eslint-disable-next-line no-shadow
      const name = nameF.input.value.trim();
      const position = positionF.input.value.trim();
      const officeVal = office.value;
      const ageNum = Number(ageF.input.value);
      const salNum = Number(salaryF.input.value);

      // валідність
      if (
        name.length < 4 ||
        !position ||
        !officeVal ||
        !Number.isFinite(ageNum) ||
        ageNum < 18 ||
        ageNum > 90 ||
        !Number.isFinite(salNum)
      ) {
        showNote(
          'error',
          'Invalid form data',
          // eslint-disable-next-line max-len
          'Please fill all fields correctly (name ≥ 4, age 18-90, numeric salary).',
        );

        return;
      }

      // створюємо новий рядок (порядок колонок як у таблиці)
      const tr = make('tr');

      const salaryText = `$${salNum.toLocaleString('en-US')}`;

      [name, position, officeVal, String(ageNum), salaryText].forEach((v) => {
        tr.append(make('td', {}, v));
      });

      tbody.appendChild(tr);

      showNote('success', 'Employee added', `${name} was added to the table.`);
      form.reset();
    });

    return form;
  };

  // Додаємо форму під таблицю (контейнер у розмітці не обов’язковий)
  const formHost =
    // eslint-disable-next-line max-len
    document.querySelector('.form-host') ||
    table.parentElement ||
    document.body;

  formHost.appendChild(buildForm());
});

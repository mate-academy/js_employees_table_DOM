'use strict';

const table = document.querySelector('table');
const tbody = document.querySelector('tbody');

function sortTable(parentEl, targetEl, sortingState) {
  const isAscending = !sortingState.has(targetEl.textContent.trim());

  if (!isAscending) {
    sortingState.delete(targetEl.textContent.trim());
  }

  const tbodyParent = parentEl.querySelector('tbody');
  const collectionTh = table.querySelectorAll('thead tr th');
  const thArr = Array.from(collectionTh);
  const index = thArr.findIndex(
    (el) => el.textContent.trim() === targetEl.textContent,
  );

  const collectionTr = table.querySelectorAll('tbody tr');
  const trArr = Array.from(collectionTr);
  const tRtDArr = trArr.map((tr) => {
    return Array.from(tr.querySelectorAll('td'));
  });

  tRtDArr.sort((a, b) => {
    const numA = a[index].textContent.replaceAll(/[^0-9]/g, '');
    const numB = b[index].textContent.replaceAll(/[^0-9]/g, '');

    if (numA !== '' && !Number.isNaN(+numA)) {
      return isAscending ? numA - numB : numB - numA;
    } else {
      return isAscending
        ? a[index].textContent.localeCompare(b[index].textContent)
        : b[index].textContent.localeCompare(a[index].textContent);
    }
  });

  // tRtDArr.forEach((trow, i) => {
  //   trow.forEach((td) => {
  //     collectionTr[i].insertAdjacentElement('beforeend', td);
  //   });
  //   tbodyParent.insertAdjacentElement('beforeend', collectionTr[i]);
  // });

  tbodyParent.innerHTML = '';

  tRtDArr.forEach((trow) => {
    const row = document.createElement('tr');

    trow.forEach((td) => row.insertAdjacentElement('beforeend', td));
    tbodyParent.insertAdjacentElement('beforeend', row);
  });

  if (isAscending) {
    sortingState.set(targetEl.textContent.trim(), targetEl.textContent.trim());
  }
}

function selectRow(parentEl, targetEl, className) {
  const tr = targetEl.closest('tr');
  const collectionTr = parentEl.querySelectorAll('tr');

  collectionTr.forEach((trEl) => trEl.classList.remove(className));

  tr.classList.add(className);
}

function addComa(numStr) {
  const numbersStr = numStr.split('');
  const modify = [];
  const count = Math.floor(numbersStr.length / 3);

  for (let i = 3; i <= count * 3; i += 3) {
    modify.unshift(`,${numbersStr.splice(-3, 3).join('')}`);
  }

  if (numStr.length % 3 === 0) {
    return `$${modify.join('').replace(',', '')}`;
  }
  modify.unshift(`${numbersStr.splice(0).join('')}`);

  const lengthModify = modify.join('');

  return lengthModify.padStart(lengthModify.length + 1, '$');
}

const sortState = new Map();

table.addEventListener('click', (e) => {
  if (!e.target.closest('table')) {
    return;
  }

  if (e.target.closest('tbody')) {
    selectRow(tbody, e.target, 'active');
  }

  if (e.target.tagName === 'TH') {
    sortTable(table, e.target, sortState);
  }
});

tbody.addEventListener('dblclick', (e) => {
  if (!e.target.closest('td')) {
    return;
  }

  const originText = e.target.textContent;
  const inputEl = document.createElement('input');
  const typeOriginText = parseInt(originText.replaceAll(/[^0-9]/g, ''));

  inputEl.setAttribute(
    'type',
    `${Number.isNaN(typeOriginText) ? 'text' : 'number'}`,
  );
  inputEl.classList.add('cell-input');
  inputEl.value = originText;
  e.target.textContent = '';
  e.target.appendChild(inputEl);
  inputEl.focus();

  const save = () => {
    e.target.textContent = originText.includes('$')
      ? addComa(inputEl.value)
      : inputEl.value || originText;
  };

  inputEl.addEventListener('blur', save);

  inputEl.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      inputEl.blur();
    }

    if (ev.key === 'Escape') {
      e.target.textContent = originText;
    }
  });
});

function createForm() {
  function createSelectBlock(nameAttr, values) {
    const selectEl = document.createElement('select');

    selectEl.setAttribute('name', nameAttr);
    selectEl.setAttribute('data-qa', nameAttr);

    values.forEach((option) => {
      const optionEl = document.createElement('option');

      optionEl.setAttribute(
        'value',
        `${option[0].toUpperCase()}${option.slice(1)}`,
      );
      optionEl.textContent = option;
      selectEl.insertAdjacentElement('beforeend', optionEl);
    });

    return selectEl;
  }

  function createInput(nameAttr, typeInput) {
    const inputEl = document.createElement('input');

    inputEl.setAttribute('name', `${nameAttr}`);
    inputEl.setAttribute('data-qa', `${nameAttr}`);
    inputEl.setAttribute('type', `${typeInput}`);
    inputEl.setAttribute('required', true);

    return inputEl;
  }

  function createButton(value) {
    const buttonEl = document.createElement('button');

    buttonEl.textContent = `${value}`;

    return buttonEl;
  }

  function addRowToTable(HTMLFormElements, parentEl, count) {
    let htmlStr = '';
    const values = Array.from(HTMLFormElements).map((el) => [
      el.name,
      el.value,
    ]);
    const tRow = document.createElement('tr');

    values.forEach((val, i) => {
      const [nameImput, value] = val;

      if (i < count) {
        htmlStr += `<td>${nameImput === 'salary' ? addComa(value) : value}</td>`;
      }
    });

    tRow.insertAdjacentHTML('beforeend', htmlStr);
    parentEl.insertAdjacentElement('beforeend', tRow);
  }

  const formEl = document.createElement('form');
  const fields = ['name', 'position', 'office', 'age', 'salary'];
  const offices = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  formEl.classList.add('new-employee-form');

  fields.forEach((field) => {
    const labelEl = document.createElement('label');

    labelEl.textContent = `${field[0].toUpperCase()}${field.slice(1)}:`;

    if (field === 'office') {
      labelEl.insertAdjacentElement(
        'beforeend',
        createSelectBlock('office', offices),
      );
      formEl.insertAdjacentElement('beforeend', labelEl);
    } else {
      labelEl.insertAdjacentElement(
        'beforeend',
        createInput(
          field,
          `${field === 'age' || field === 'salary' ? 'number' : 'text'}`,
        ),
      );
      formEl.insertAdjacentElement('beforeend', labelEl);
    }
  });

  const buttonElement = createButton('Save to table');

  buttonElement.addEventListener('click', (e) => {
    e.preventDefault();

    let isValid = true;
    const textForName = 'The name must contain at least four letters';
    const textForPosition = 'The position must contain at least four letters';
    const textForAge = 'You must specify an age between 18 and 90.';
    const textSuccess = 'Employee details added successfully';
    const employeeName = formEl.elements['name'].value.replaceAll(
      /[^A-Za-z]/g,
      '',
    );
    const employeeAge = +formEl.elements['age'].value;
    const employeePosition = formEl.elements['position'].value.replaceAll(
      /[^A-Za-z]/g,
      '',
    );
    const containetrEl = document.createElement('div');

    if (employeeName.length < 4) {
      containetrEl.insertAdjacentHTML('beforeend', `<p>${textForName}</p>`);
      isValid = false;
    }

    if (employeePosition.length < 4) {
      containetrEl.insertAdjacentHTML('beforeend', `<p>${textForPosition}</p>`);
      isValid = false;
    }

    if (Number.isNaN(employeeAge) || employeeAge < 18 || employeeAge > 90) {
      containetrEl.insertAdjacentHTML('beforeend', `<p>${textForAge}</p>`);
      isValid = false;
    }

    if (isValid) {
      containetrEl.insertAdjacentHTML('beforeend', `<p>${textSuccess}</p>`);
      addRowToTable(formEl.elements, tbody, 5);
    }

    containetrEl.classList.add('notification');
    containetrEl.classList.add(`${isValid ? 'success' : 'error'}`);
    containetrEl.setAttribute('data-qa', 'notification');

    document
      .querySelector('body')
      .insertAdjacentElement('beforeend', containetrEl);

    setTimeout(() => {
      containetrEl.remove();
    }, 3000);

    formEl.reset();
  });

  formEl.insertAdjacentElement('beforeend', buttonElement);

  document.querySelector('body').insertAdjacentElement('beforeend', formEl);
}

createForm();

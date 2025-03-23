'use strict';

const thead = document.body.querySelector('thead');
const tbody = document.body.querySelector('tbody');

const tBodyTr = tbody.querySelectorAll('tr');
const trArray = Array.from(tBodyTr);
let ASCorDESC = 0;
const memory = [];

/* click thead childrens */

const arrayTh = Array.from(thead.querySelectorAll('th')).slice(0, 3);

const sortOfTr = (e) => {
  const sortArray = trArray.sort((a, b) => {
    const aFirtsChild = a.firstElementChild.textContent;
    const bFirtsChild = b.firstElementChild.textContent;

    if (!memory.includes(e.target.textContent)) {
      memory.push(e.target.textContent);
      ASCorDESC = 0;
    }

    return ASCorDESC
      ? bFirtsChild.localeCompare(aFirtsChild)
      : aFirtsChild.localeCompare(bFirtsChild);
  });

  tbody.replaceChildren(...sortArray);
  ASCorDESC = 1 - ASCorDESC;
};

arrayTh.forEach((item) => {
  item.addEventListener('click', sortOfTr);
});

/* Sort salary and Age */

const SalaryAgeThArray = Array.from(thead.querySelectorAll('th')).slice(-2);

let ageSortEvent = 0;

const ageSort = (ea) => {
  const sortOfAge = trArray.sort((tr01, tr02) => {
    return ageSortEvent
      ? +tr02.children[3].textContent - +tr01.children[3].textContent
      : +tr01.children[3].textContent - +tr02.children[3].textContent;
  });

  ageSortEvent = 1 - ageSortEvent;
  tbody.replaceChildren(...sortOfAge);
};

let ageSalaryEvent = 0;

const salarySort = (ea) => {
  const sortOfSalary = trArray.sort((tr01, tr02) => {
    const numbe01 = +tr01.lastElementChild.textContent.replace(/[^\d.-]/g, '');
    const numbe02 = +tr02.lastElementChild.textContent.replace(/[^\d.-]/g, '');

    return ageSalaryEvent ? numbe02 - numbe01 : numbe01 - numbe02;
  });

  ageSalaryEvent = 1 - ageSalaryEvent;
  tbody.replaceChildren(...sortOfSalary);
};

SalaryAgeThArray[0].addEventListener('click', ageSort);
SalaryAgeThArray[1].addEventListener('click', salarySort);

/* click tbody childrens */

tBodyTr.forEach((i) => {
  i.addEventListener('click', (e) => {
    tBodyTr.forEach((item) => {
      if (item.classList.contains('activ')) {
        item.classList.remove('activ');
        item.style.background = '';
      }
    });

    e.currentTarget.classList.add('activ');
    e.currentTarget.style.background = '#999ec5';
  });
});

/* form */

const form = document.createElement('form');

form.classList.add('new-employee-form');

/* create 4 input and add to form */
/* =================================== */
const fields = [
  { label: 'Name:', dataQa: 'name' },
  { label: 'Position:', dataQa: 'position' },
  { label: 'Age:', dataQa: 'age' },
  { label: 'Salary:', dataQa: 'salary' },
];

fields.forEach((field) => {
  const label = document.createElement('label');

  label.textContent = field.label;

  const input = document.createElement('input');

  if (field === fields[0] || field === fields[1]) {
    input.setAttribute('type', 'text');
  } else {
    input.setAttribute('type', 'number');
  }

  input.setAttribute('required', '');
  input.setAttribute('data-qa', field.dataQa);

  label.append(input);
  form.append(label);
});
/* =================================== */

/* Create select.End adding option him */
const labelSelect = document.createElement('label');
const selectElement = document.createElement('select');

labelSelect.textContent = 'Office:';
labelSelect.setAttribute('for', 'office-select');
selectElement.setAttribute('id', 'office-select');

const arrayForSelect = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

arrayForSelect.forEach((item) => {
  const optionSelect = document.createElement('option');

  optionSelect.textContent = item;
  selectElement.append(optionSelect);
});

selectElement.setAttribute('required', '');
selectElement.setAttribute('data-qa', 'office');
labelSelect.append(selectElement);

/* =================SELECT finish======================= */

const buttonForm = document.createElement('button');

buttonForm.textContent = 'Save to table';
buttonForm.setAttribute('type', 'submit');

form.children[2].before(labelSelect);
form.append(buttonForm);
document.body.append(form);

/* =================ADD-NEW-Client======================= */

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let NOTIFICATION = true;

  const arrayOfFormChilds = Array.from(form.children).slice(0, -1);

  const arrayOfInputsValues = arrayOfFormChilds.map((item, i) => {
    const valuE = item.firstElementChild.value;
    const nameOfFirst = item.firstChild;

    return {
      [nameOfFirst]: valuE,
    };
  });

  /* examination */

  arrayOfFormChilds.forEach((item, i) => {
    const valyA = form.children[0].querySelector('input').value;

    if (i === 0 && valyA.length < 4) {
      NOTIFICATION = false;
    }

    const valyB = form.children[3].querySelector('input').value;

    if (i === 3 && (+valyB > 90 || +valyB < 18)) {
      NOTIFICATION = false;
    }
  });

  /* If false */

  if (NOTIFICATION === false) {
    const errorMesagge = document.querySelector('.error');

    if (errorMesagge) {
      errorMesagge.style.background = 'red';

      setTimeout(() => {
        errorMesagge.style.background = '';
      }, 500);

      return;
    }

    const mesageError = document.createElement('div');

    mesageError.setAttribute('data-qa', 'notification');
    mesageError.classList.add('error');
    mesageError.textContent = 'Errore';
    document.body.append(mesageError);

    setTimeout(() => {
      document.querySelector('.error').remove();
    }, 4000);
  } else {
    const newTr = document.createElement('tr');

    arrayOfInputsValues.forEach((item) => {
      const newTd = document.createElement('td');

      newTd.textContent = Object.values(item)[0];
      newTr.append(newTd);
    });

    tbody.prepend(newTr);

    /* add mesagge of success */

    if (document.querySelector('.success')) {
      return;
    }

    const mesageSuccess = document.createElement('div');

    mesageSuccess.setAttribute('data-qa', 'notification');
    mesageSuccess.classList.add('success');
    mesageSuccess.textContent = 'success';

    document.body.append(mesageSuccess);
  }
});

const tbodyDblclick = (e) => {
  // Перевіряємо, чи є вже редагований елемент
  const currentlyEditing = tbody.querySelector('.cell-input');

  if (currentlyEditing) {
    // Видаляємо всі події з поточної редагованої клітинки
    currentlyEditing.removeEventListener('dblclick', tbodyDblclick);
    currentlyEditing.removeAttribute('contenteditable');
    currentlyEditing.classList.remove('cell-input');
  }

  const cell = e.target;
  const memoryOfTarget = cell.textContent;

  // Включаємо редагування для поточної клітинки
  cell.setAttribute('contenteditable', 'true');
  cell.classList.add('cell-input');
  cell.focus();

  // Обробник події для натискання клавіші
  const keydown = (ea) => {
    if (ea.key === 'Enter') {
      cell.classList.remove('cell-input');
      ea.preventDefault();
      cell.blur();
      cell.removeEventListener('keydown', keydown);
    } else if (ea.key === 'Escape') {
      cell.classList.remove('cell-input');
      cell.textContent = memoryOfTarget;
      cell.blur();
      cell.removeEventListener('keydown', keydown);
    }
  };

  // Обробник події для втрати фокусу
  const blurHandler = (eb) => {
    const newContent = cell.textContent.trim();

    if (newContent.length === 0) {
      cell.textContent = memoryOfTarget;
    }
    cell.textContent = newContent;
    cell.removeEventListener('blur', blurHandler);
  };

  // Додаємо обробники подій
  cell.addEventListener('keydown', keydown);
  cell.addEventListener('blur', blurHandler);
};

tbody.addEventListener('dblclick', tbodyDblclick);

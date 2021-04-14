'use strict';

let nameSort = true;
let positionSort = true;
let officeSort = true;
let ageSort = true;
let salarySort = true;
const officeArr = ['Tokyo', 'Singapore', 'London',
  'New York', 'Edinburgh', 'San Francisco'];
const head = document.querySelector('thead').querySelector('tr');
const body = document.querySelector('tbody');

const mySort = (arr, index, order) => {
  if (index === 4) {
    if (order) {
      arr.sort((a, b) => {
        const first = Number(a.children[index].textContent
          .slice(1).split(',').join(''));
        const second = Number(b.children[index].textContent
          .slice(1).split(',').join(''));

        return first - second;
      });
    } else {
      arr.sort((a, b) => {
        const first = Number(a.children[index].textContent
          .slice(1).split(',').join(''));
        const second = Number(b.children[index].textContent
          .slice(1).split(',').join(''));

        return second - first;
      });
    }
  } else if (index === 3) {
    if (order) {
      arr.sort((a, b) => {
        return a.children[index].textContent - b.children[index].textContent;
      });
    } else {
      arr.sort((a, b) => {
        return b.children[index].textContent - a.children[index].textContent;
      });
    }
  } else {
    if (order) {
      arr.sort((a, b) => {
        return a.children[index].textContent
          .localeCompare(b.children[index].textContent);
      });
    } else {
      arr.sort((a, b) => {
        return b.children[index].textContent
          .localeCompare(a.children[index].textContent);
      });
    }
  }
};

document.querySelector('thead').addEventListener('click', (e) => {
  const item = e.target;
  const sortedBody = [...body.querySelectorAll('tr')];
  const index = [...head.querySelectorAll('th')].findIndex(td => {
    return item.textContent === td.textContent;
  });

  switch (item.textContent) {
    case 'Name':
      mySort(sortedBody, index, nameSort);
      nameSort = !nameSort;
      break;

    case 'Position':
      mySort(sortedBody, index, positionSort);
      positionSort = !positionSort;
      break;

    case 'Office':
      mySort(sortedBody, index, officeSort);
      officeSort = !officeSort;
      break;

    case 'Age':
      mySort(sortedBody, index, ageSort);
      ageSort = !ageSort;
      break;

    case 'Salary':
      mySort(sortedBody, index, salarySort);
      salarySort = !salarySort;
      break;
  }

  body.prepend(...sortedBody);
});

const list = document.querySelector('tbody');
const table = document.querySelector('table');

const createForm = () => {
  const newForm = document.createElement('form');

  newForm.className = 'new-employee-form';

  const labelName = document.createElement('label');
  const inputName = document.createElement('input');

  inputName.setAttribute('name', 'name');
  inputName.setAttribute('type', 'text');
  inputName.setAttribute('required', true);
  inputName.setAttribute('data-qa', 'name');
  labelName.textContent = 'Name: ';
  labelName.append(inputName);
  newForm.append(labelName);

  const labelPos = document.createElement('label');
  const inputPos = document.createElement('input');

  inputPos.setAttribute('name', 'position');
  inputPos.setAttribute('type', 'text');
  inputPos.setAttribute('required', true);
  inputPos.setAttribute('data-qa', 'position');
  labelPos.textContent = 'Position: ';
  labelPos.append(inputPos);
  newForm.append(labelPos);

  const labelOffice = document.createElement('label');
  const selectOffice = document.createElement('select');

  officeArr.forEach(item => {
    const selOff = document.createElement('option');

    selOff.textContent = item;
    selectOffice.append(selOff);
  });
  selectOffice.setAttribute('name', 'office');
  selectOffice.setAttribute('data-qa', 'office');
  labelOffice.textContent = 'Office: ';
  labelOffice.append(selectOffice);
  newForm.append(labelOffice);

  const labelAge = document.createElement('label');
  const inputAge = document.createElement('input');

  inputAge.setAttribute('name', 'age');
  inputAge.setAttribute('type', 'number');
  inputAge.setAttribute('required', true);
  inputAge.setAttribute('data-qa', 'age');
  labelAge.textContent = 'Age: ';
  labelAge.append(inputAge);
  newForm.append(labelAge);

  const labelSalary = document.createElement('label');
  const inputSalary = document.createElement('input');

  inputSalary.setAttribute('name', 'salary');
  inputSalary.setAttribute('type', 'number');
  inputSalary.setAttribute('required', true);
  inputSalary.setAttribute('data-qa', 'salary');
  labelSalary.textContent = 'Salary: ';
  labelSalary.append(inputSalary);
  newForm.append(labelSalary);

  const myButton = document.createElement('button');

  myButton.setAttribute('type', 'submit');
  myButton.textContent = 'Save to table';

  newForm.append(myButton);

  return newForm;
};

const notification = (type, descriptions, notClass) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.className = notClass;
  p.textContent = descriptions;
  h2.textContent = type;
  h2.className = 'title';
  div.append(h2, p);

  return div;
};

const addRow = (data) => {
  const tr = document.createElement('tr');
  let count = 0;

  for (const value of data.values()) {
    const td = document.createElement('td');

    if (count === 4) {
      td.textContent = `$${value.match(/.{1,3}/g).join(',')}`;
      tr.append(td);
    } else {
      td.textContent = value;
      tr.append(td);
    }
    count++;
  }

  return tr;
};

const form = createForm();

table.parentNode.append(form);

const bodyNode = document.querySelector('body');

form.addEventListener('submit', (e) => {
  const data = new FormData(form);

  e.preventDefault();

  if (data.get('name').length < 4 || data.get('age') < 18
  || data.get('age') > 90) {
    bodyNode.prepend(notification('Error!', 'Enter valid data, please',
      'notification error'));
  } else {
    bodyNode.prepend(notification('Success!',
      'Congratulations, new employer has been added!', 'notification success'));
    list.append(addRow(data));
    form.reset();
  }

  setTimeout(() => {
    bodyNode.children[0].remove();
  }, 2000);
});

// const selectTr = document.querySelector('tbody');

body.addEventListener('click', (e) => {
  if (document.querySelector('.active') !== null) {
    document.querySelector('.active').classList.remove('active');
  }

  e.target.closest('tr').classList.add('active');
});

body.addEventListener('dblclick', (e) => {
  const td = e.target;
  const text = td.textContent;

  td.textContent = null;

  td.insertAdjacentHTML('afterbegin', `
  <input name="name" type="text" class="cell-input">
  `);

  td.querySelector('input').addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      td.textContent = (td.querySelector('input').value === '')
        ? text
        : td.querySelector('input').value;
    }
  });

  td.querySelector('input').addEventListener('blur', (ev) => {
    td.textContent = td.querySelector('input').value;
  });
});

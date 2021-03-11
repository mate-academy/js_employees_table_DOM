'use strict';

// write code here
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const arrChildren = [...tbody.children];
let val = false;

thead.addEventListener('click', (e) => {
  switch (e.target.innerText) {
    case 'Name':
      if (val) {
        const arrName = arrChildren.sort((a, b) => {
          return b.children[0].innerText.localeCompare(a.children[0].innerText);
        });

        val = false;
        tbody.append(...arrName);
      } else {
        const arrName = arrChildren.sort((a, b) => {
          return a.children[0].innerText.localeCompare(b.children[0].innerText);
        });

        val = true;
        tbody.append(...arrName);
      }
      break;
    case 'Position':
      if (val) {
        const arrPos = arrChildren.sort((a, b) => {
          return b.children[1].innerText.localeCompare(a.children[1].innerText);
        });

        val = false;
        tbody.append(...arrPos);
      } else {
        const arrPos = arrChildren.sort((a, b) => {
          return a.children[1].innerText.localeCompare(b.children[1].innerText);
        });

        val = true;
        tbody.append(...arrPos);
      }
      break;
    case 'Office':
      if (val) {
        const arrOff = arrChildren.sort((a, b) => {
          return b.children[2].innerText.localeCompare(a.children[2].innerText);
        });

        val = false;
        tbody.append(...arrOff);
      } else {
        const arrOff = arrChildren.sort((a, b) => {
          return a.children[2].innerText.localeCompare(b.children[2].innerText);
        });

        val = true;
        tbody.append(...arrOff);
      }
      break;
    case 'Age':

      if (val) {
        const arrAge = arrChildren.sort((a, b) => {
          return b.children[3].innerText.localeCompare(a.children[3].innerText);
        });

        val = false;
        tbody.append(...arrAge);
      } else {
        const arrAge = arrChildren.sort((a, b) => {
          return a.children[3].innerText.localeCompare(b.children[3].innerText);
        });

        val = true;
        tbody.append(...arrAge);
      }
      break;
    case 'Salary':
      if (val) {
        const arrSal = arrChildren.sort((a, b) => {
          const salaryA = +a.children[4].innerText.replace(/[$,]/g, '');
          const salaryB = +b.children[4].innerText.replace(/[$,]/g, '');

          return salaryB - salaryA;
        });

        val = false;
        tbody.append(...arrSal);
      } else {
        const arrSal = arrChildren.sort((a, b) => {
          const salaryA = +a.children[4].innerText.replace(/[$,]/g, '');
          const salaryB = +b.children[4].innerText.replace(/[$,]/g, '');

          return salaryA - salaryB;
        });

        val = true;
        tbody.append(...arrSal);
      }
      break;
  }
});

tbody.addEventListener('click', (e) => {
  for (const tr of tbody.children) {
    if (tr.classList.contains('active')) {
      tr.classList.remove('active');
    }
    e.target.parentElement.className = 'active';
  }
});

const body = document.querySelector('body');
const form = document.createElement('form');

form.className = 'new-employee-form';
form.action = '/';
form.method = 'GET';
body.append(form);

const lableName = document.createElement('label');

lableName.innerText = 'Name: ';
form.append(lableName);

const inputName = document.createElement('input');

inputName.name = 'name';
inputName.type = 'text';
inputName.dataset.qa = 'name';
lableName.append(inputName);

const lablePos = document.createElement('label');

lablePos.innerText = 'Position: ';
form.append(lablePos);

const inputPos = document.createElement('input');

inputPos.name = 'position';
inputPos.type = 'text';
inputPos.dataset.qa = 'position';
lablePos.append(inputPos);

const lableOffice = document.createElement('label');

lableOffice.innerText = 'Office: ';
form.append(lableOffice);

const selectOffice = document.createElement('select');

selectOffice.className = 'select';
selectOffice.dataset.qa = 'office';

lableOffice.append(selectOffice);

const optTokyo = document.createElement('option');

optTokyo.value = 'Tokyo';
optTokyo.innerText = 'Tokyo';

selectOffice.append(optTokyo);

const optSing = document.createElement('option');

optSing.value = 'Singapore';
optSing.innerText = 'Singapore';

selectOffice.append(optSing);

const optLon = document.createElement('option');

optLon.value = 'London';
optLon.innerText = 'London';

selectOffice.append(optLon);

const optNew = document.createElement('option');

optNew.value = 'New York';
optNew.innerText = 'New York';

selectOffice.append(optNew);

const optEdin = document.createElement('option');

optEdin.value = 'Edinburgh';
optEdin.innerText = 'Edinburgh';

selectOffice.append(optEdin);

const optSan = document.createElement('option');

optSan.value = 'San Francisco';
optSan.innerText = 'San Francisco';

selectOffice.append(optSan);

const lableAge = document.createElement('label');

lableAge.innerText = 'Age: ';
form.append(lableAge);

const inputAge = document.createElement('input');

inputAge.name = 'age';
inputAge.type = 'number';
inputAge.dataset.qa = 'age';
lableAge.append(inputAge);

const lableSalary = document.createElement('label');

lableSalary.innerText = 'Salary: ';
form.append(lableSalary);

const inputSalary = document.createElement('input');

inputSalary.name = 'salary';
inputSalary.type = 'number';
inputSalary.dataset.qa = 'salary';
lableSalary.append(inputSalary);

const button = document.createElement('button');

button.innerText = 'Save to table';
button.type = 'submit';
form.append(button);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newTr = document.createElement('tr');
  const inputs = document.querySelectorAll('input');
  const tdOff = document.createElement('td');

  tdOff.innerText = selectOffice.value;

  for (let i = 0; i < inputs.length; i++) {
    const td = document.createElement('td');

    if (inputs[i].dataset.qa === 'salary') {
      td.innerText = `$${inputs[i].value
        .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    } else {
      td.innerText = inputs[i].value;
    }
    tbody.append(newTr);
    inputs[i].value = '';
    newTr.append(td);
  }
  newTr.insertBefore(tdOff, newTr.children[2]);

  if (newTr.firstChild.innerText.length < 4) {
    pushNotification('Title of Error message', 'error');
    newTr.remove();
  } else if (newTr.children[3].innerText < 18
    || newTr.children[3].innerText >= 90) {
    pushNotification('Title of Error message', 'error');
    newTr.remove();
  } else if (newTr.children[1].innerText === '') {
    pushNotification('Title of Error message', 'error');
    newTr.remove();
  } else {
    pushNotification('Title of Success message', 'success');
  }
});

const pushNotification = (title, type) => {
  const div = document.createElement('div');

  div.className = 'notification';
  div.dataset.qa = 'notification';
  div.classList.add(type);
  body.append(div);

  const h2 = document.createElement('h2');

  h2.className = 'title';
  h2.textContent = title;
  div.append(h2);
};

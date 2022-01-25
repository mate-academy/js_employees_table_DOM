'use strict';

const body = document.querySelector('body');
const tr = document.querySelectorAll('tr');
const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');

for (let i = 1; i < tr.length - 1; i++) {
  tr[i].className = 'data';
}

const dataTr = document.querySelectorAll('.data');
const list = [...dataTr];

tbody.addEventListener('click', (e) => {
  const target = e.target;

  if (active) {
    if (active !== target.closest('tr')) {
      active.classList.remove('active');
      target.closest('tr').classList.add('active');
      active = target.closest('tr');
    } else {
      active.classList.remove('active');
    }
  } else {
    target.parentElement.classList.add('active');
    active = target.parentElement;
  }
});

let currentInput;

tbody.addEventListener('dblclick', (e) => {
  if (currentInput !== e.target) {
    if (currentInput) {
      const buff = currentInput.children[0].value;

      currentInput.innerHTML = '';
      currentInput.innerText = buff;
    }
    currentInput = e.target;

    const Txt = e.target.innerText;

    e.target.innerText = '';
    currentInput.innerHTML += `<input value = "${Txt}"/>`;
  }
});

tbody.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const buff = currentInput.children[0].value;

    currentInput.innerHTML = '';
    currentInput.innerHTML = buff;
    currentInput = undefined;
  }
});

let active;

thead.addEventListener('click', (e) => {
  const target = e.target;

  switch (target.innerText) {
    case 'Name':
      if (active !== e.target) {
        list.sort((a, b) => {
          const nameA = a.children[0].innerText.toLowerCase();
          const nameB = b.children[0].innerText.toLowerCase();

          if (nameA > nameB) {
            return 1;
          }

          if (nameA < nameB) {
            return -1;
          }

          return 0;
        });
        active = e.target;
      } else {
        list.reverse();
      }
      tbody.innerHTML = '';
      tbody.append(...list);
      break;
    case 'Position':
      if (active !== tr[0].children[1]) {
        list.sort((a, b) => {
          const positionA = a.children[1].innerText.toLowerCase();
          const positionB = b.children[1].innerText.toLowerCase();

          if (positionA > positionB) {
            return 1;
          }

          if (positionA < positionB) {
            return -1;
          }

          return 0;
        });
        active = tr[0].children[1];
      } else {
        list.reverse();
      }
      tbody.innerHTML = '';
      tbody.append(...list);
      break;
    case 'Office':
      if (active !== tr[0].children[2]) {
        list.sort((a, b) => {
          const officeA = a.children[2].innerText.toLowerCase();
          const officeB = b.children[2].innerText.toLowerCase();

          if (officeA > officeB) {
            return 1;
          }

          if (officeA < officeB) {
            return -1;
          }

          return 0;
        });
        active = tr[0].children[2];
      } else {
        list.reverse();
      }
      tbody.innerHTML = '';
      tbody.append(...list);
      break;
    case 'Age':
      if (active !== tr[0].children[3]) {
        list.sort(
          (a, b) => +a.children[3].innerText - +b.children[3].innerText
        );
        active = tr[0].children[3];
      } else {
        list.reverse();
      }
      tbody.innerHTML = '';
      tbody.append(...list);
      break;
    case 'Salary':
      if (active !== tr[0].children[4]) {
        list.sort((a, b) => {
          return (
            +a.children[4].innerText.split('$')[1].split(',').join('')
            - +b.children[4].innerText.split('$')[1].split(',').join('')
          );
        });
        active = tr[0].children[4];
      } else {
        list.reverse();
      }
      tbody.innerHTML = '';
      tbody.append(...list);
      break;
  }
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.append(form);

form.insertAdjacentHTML(
  'beforeend',
  `<label>Name: <input class = "inputs"
  name="name" data-qa="name" type="text" /></label>
  <label>Position: <input class = "inputs"
  name="position" data-qa="position" type="text" /></label>
  <label>Office: <select class = "inputs"
  name="office" data-qa="office" type="search" /></select></label>
  <label>Age: <input class = "inputs"
  name="age" data-qa="age" type="text" /></label>`
);

form.insertAdjacentHTML(
  'beforeend',
  `<label>Salary: <input class = "inputs"`
  + `name="salary" data-qa="salary" type="text" /></label>`
);

const select = document.querySelector('select');

select.insertAdjacentHTML(
  'afterbegin',
  `
  <option>Tokyo</option>
  <option>Singapore</option>
  <option>Singapore</option>
  <option>New York</option>
  <option>Edinburgh</option>
  <option>San Francisco</option>
`
);

function NameValidation(inputName) {
  let ok = true;

  if (inputName.length < 4) {
    ok = false;
  }

  return ok;
}

function ageValidation(inputAge) {
  let ok = true;

  if (+inputAge < 18 || +inputAge > 90) {
    ok = false;
  }

  return ok;
}

const button = document.createElement('button');

button.innerText = 'Save to table';
form.append(button);

const errorNotification = document.createElement('div');
const h2Error = document.createElement('h2');
const pError = document.createElement('p');

pError.innerText = 'please, input correct data';
h2Error.innerText = 'Invalid inputs';
errorNotification.append(h2Error);
errorNotification.append(pError);
errorNotification.setAttribute('data-qa', 'notification');
errorNotification.classList.add('notification');
errorNotification.classList.add('error');

const successNotification = document.createElement('div');

successNotification.setAttribute('data-qa', 'notification');
successNotification.classList.add('notification');
successNotification.classList.add('success');

const h2Success = document.createElement('h2');
const pSuccess = document.createElement('p');

h2Success.innerText = 'Success';
pSuccess.innerText = 'new employer was added';
successNotification.append(h2Success);
successNotification.append(pSuccess);

button.addEventListener('click', (e) => {
  const newTr = document.createElement('tr');
  const inputs = document.querySelectorAll('.inputs');

  e.preventDefault();

  if (!NameValidation(inputs[0].value)) {
    body.append(errorNotification);

    setTimeout(() => {
      body.removeChild(errorNotification);
    }, 3000);

    return;
  }

  if (!ageValidation(inputs[3].value) || isNaN(inputs[3].value)) {
    body.append(errorNotification);

    setTimeout(() => {
      body.removeChild(errorNotification);
    }, 3000);

    return;
  }

  if (!inputs[1].value) {
    body.append(errorNotification);

    setTimeout(() => {
      body.removeChild(errorNotification);
    }, 3000);

    return;
  }

  if (!inputs[2].value) {
    body.append(errorNotification);

    setTimeout(() => {
      body.removeChild(errorNotification);
    }, 3000);

    return;
  }

  if (!inputs[4].value || isNaN(inputs[4].value)) {
    body.append(errorNotification);

    setTimeout(() => {
      body.removeChild(errorNotification);
    }, 3000);

    return;
  }

  for (let i = 0; i < inputs.length; i++) {
    const td = document.createElement('td');

    if (i === 4) {
      const strValue = +inputs[i].value;

      td.innerText = `$${strValue.toLocaleString('en-US')}`;
      newTr.append(td);
      tbody.append(newTr);
      continue;
    }

    td.innerText = inputs[i].value;
    newTr.append(td);
    list.push(newTr);
    tbody.append(newTr);
  }

  body.append(successNotification);
});

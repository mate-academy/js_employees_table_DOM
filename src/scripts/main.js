'use strict';

const table = document.querySelector('table');
const thead = table.querySelector('thead');
const thHead = thead.querySelectorAll('th');
const tbody = table.querySelector('tbody');
const [...trBody] = tbody.querySelectorAll('tr');
const form = document.createElement('form');

let isDescOrder = true;

document.body.appendChild(form);
form.classList.add('new-employee-form');

thHead.forEach((item, i) => {
  item.addEventListener('click', () => {
    isDescOrder = !isDescOrder;
    sortInfo(i);
  });
});

function sortInfo(i) {
  trBody.forEach(item => tbody.removeChild(item));

  trBody.sort((a, b) => {
    const firstItem = a.cells[i].textContent;
    const secondItem = b.cells[i].textContent;

    return firstItem.localeCompare(secondItem, undefined, { numeric: true });
  });

  if (isDescOrder) {
    trBody.reverse();
  }

  trBody.forEach(item => tbody.append(item));
}

tbody.addEventListener('click', (e) => {
  if (document.querySelector('.active')) {
    document.querySelector('.active').classList.remove('active');
  }

  e.target.closest('tr').classList.add('active');
});

for (let i = 0; i < [...thHead].length; i++) {
  const label = document.createElement('label');

  const valueInputOff
  = ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'];

  label.textContent = thHead[i].textContent;

  if (thHead[i].textContent === 'Office') {
    const select = document.createElement('select');

    select.setAttribute('data-qa', `${thHead[i].textContent.toLowerCase()}`);

    for (let j = 0; j < valueInputOff.length; j++) {
      const optionSelect = document.createElement('option');

      optionSelect.value = valueInputOff[j];
      optionSelect.text = valueInputOff[j];
      select.append(optionSelect);
    }

    label.append(select);
  } else {
    const input = document.createElement('input');
    const textThHead = thHead[i].textContent;

    input.setAttribute('data-qa', `${thHead[i].textContent.toLowerCase()}`);
    input.setAttribute('type', 'text');

    if (textThHead === 'Age') {
      input.type = 'number';
    } else if (textThHead === 'Salary') {
      input.type = 'number';
    }

    label.appendChild(input);
  }

  form.appendChild(label);
}

const formBtn = document.createElement('button');

formBtn.textContent = 'Save to table';
form.append(formBtn);

formBtn.addEventListener('click', (e) => {
  const newTr = document.createElement('tr');
  const [...labelForm] = form.querySelectorAll('label');
  const allInput = document.querySelectorAll('input');
  let exValue = true;

  e.preventDefault();

  labelForm.forEach(item => {
    const newTd = document.createElement('td');

    newTd.innerText = item.children[0].value;

    if (item.children[0].dataset.qa === 'salary') {
      const text
      = Number(item.children[0].value).toLocaleString({ numeric: true });

      newTd.innerHTML = `$${text}`;
    }

    if (Math.sign(Number(item.children[0].value)) === -1) {
      exValue = false;
    }

    if (!item.children[0].value.trim()) {
      exValue = false;
    }

    newTr.appendChild(newTd);
  });

  if (exValue) {
    tbody.appendChild(newTr);
  }

  for (const input of allInput) {
    input.value = '';
  }
});

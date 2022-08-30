'use strict';

const main = document.querySelector('table');
let count;
let trigger = true;
let temp;

main.addEventListener('click', (e) => {
  switch (e.target.tagName) {
    case 'TH':

      if (temp !== e.target || trigger === true) {
        do {
          count = 0;

          const rows = main.rows;

          for (let i = 2; i < (rows.length - 1); i++) {
            const prev
            = rows[i - 1].getElementsByTagName('TD')[e.target.cellIndex];
            const prevStr = prev.innerHTML.toLowerCase()
              .split(',').join('').split('$').join('');

            const current
            = rows[i].getElementsByTagName('TD')[e.target.cellIndex];
            const currentStr = current.innerHTML.toLowerCase()
              .split(',').join('').split('$').join('');

            switch (e.target.innerHTML) {
              case 'Age':
              case 'Salary':
                if (Number(prevStr) > Number(currentStr)) {
                  rows[i].parentNode.insertBefore(rows[i], rows[i - 1]);
                  count++;
                }
                break;
              default:
                if (prevStr.localeCompare(currentStr) === 1) {
                  rows[i].parentNode.insertBefore(rows[i], rows[i - 1]);
                  count++;
                }
                break;
            }
          }
        } while (count > 0);

        trigger = false;

        temp = e.target;
      } else {
        do {
          count = 0;

          const rows = main.rows;

          for (let i = 2; i < (rows.length - 1); i++) {
            const prev
            = rows[i - 1].getElementsByTagName('TD')[e.target.cellIndex];
            const prevStr = prev.innerHTML.toLowerCase()
              .split(',').join('').split('$').join('');

            const current
            = rows[i].getElementsByTagName('TD')[e.target.cellIndex];
            const currentStr = current.innerHTML.toLowerCase()
              .split(',').join('').split('$').join('');

            switch (e.target.innerHTML) {
              case 'Age':
              case 'Salary':
                if (Number(prevStr) < Number(currentStr)) {
                  rows[i].parentNode.insertBefore(rows[i], rows[i - 1]);
                  count++;
                }
                break;
              default:
                if (prevStr.localeCompare(currentStr) === -1) {
                  rows[i].parentNode.insertBefore(rows[i], rows[i - 1]);
                  count++;
                }
                break;
            }
          }
        } while (count > 0);
        trigger = true;
      }
  }
});

main.addEventListener('click', (e) => {
  const rows = main.rows;

  for (let i = 0; i < (rows.length); i++) {
    rows[i].classList.remove('active');
  }

  for (let i = 1; i < (rows.length - 1); i++) {
    if (e.target.parentNode === rows[i]) {
      rows[i].classList.add('active');
    }
  }
});

const form = document.createElement('form');

form.action = '/';
form.method = 'get';
form.classList.add('new-employee-form');

document.body.appendChild(form);

const inputArray = ['Name', 'Position', 'Age', 'Salary'];

for (let i = 0; i < inputArray.length; i++) {
  const input = document.createElement('input');
  const label = document.createElement('label');

  input.setAttribute('data-qa', inputArray[i]);
  input.id = inputArray[i];
  input.name = inputArray[i];
  input.type = 'text';
  label.htmlFor = inputArray[i];
  label.innerHTML = inputArray[i];

  label.appendChild(input);
  form.appendChild(label);
}

const age = document.getElementById('Age');
const salary = document.getElementById('Salary');

age.type = 'number';
salary.type = 'number';

// SELECT

const selectList = document.createElement('select');
const selectLabel = document.createElement('label');

selectList.id = 'mySelect';
selectLabel.id = 'myLabel';
selectLabel.htmlFor = 'mySelect';
selectLabel.innerHTML = 'Office:';

const array = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (let i = 0; i < array.length; i++) {
  const option = document.createElement('option');

  option.value = array[i];
  option.text = array[i];
  selectList.appendChild(option);
}

selectLabel.appendChild(selectList);
form.children[1].after(selectLabel);

// SUBMIT

const button = document.createElement('button');

button.type = 'submit';
button.name = 'Save to table';
button.innerHTML = 'Save to table';
form.append(button);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const tr = document.createElement('tr');
  const obj = Object.fromEntries(data.entries());

  for (const item in obj) {
    const td = document.createElement('td');

    if (item === 'Salary') {
      td.innerHTML = `$${obj[item]}`;
      tr.append(td);
      continue;
    }

    td.innerText = obj[item];
    tr.append(td);
  }

  const tdSelect = document.createElement('td');

  tdSelect.innerHTML = selectList.value;
  tr.children[1].after(tdSelect);

  // Notification

  function spawnNotification(title, description, resultClass) {
    const container = document.createElement('DIV');

    container.className = 'notification';
    container.classList.add(resultClass);
    container.setAttribute('data-qa', 'notification');

    container.innerHTML = ` 
    <h2 class = 'title'>${title}</h2>
    <p>${description}</p>
  `;

    document.body.appendChild(container);

    setTimeout(() => container.remove(), 3000);
  }

  if (tr.children[0].innerHTML.length < 4
     || tr.children[3].innerHTML < 18
     || tr.children[3].innerHTML > 90) {
    spawnNotification('Error', 'Please enter correct values', 'error');
  } else {
    main.append(tr);

    spawnNotification('Success', 'Employee is successfully added', 'success');
  }
});

// Editing of table cells

let tempClick = true;

main.addEventListener('dblclick', (e) => {
  const rows = main.rows;

  if (tempClick === true) {
    for (let i = 1; i < (rows.length - 1); i++) {
      if (e.target.parentNode === rows[i]) {
        const input = document.createElement('input');
        const item = e.target;
        const index = item.cellIndex;
        const itemWidth = item.clientWidth;

        input.style.width = `${itemWidth}px`;
        input.id = item.innerHTML;
        input.name = item.innerHTML;

        if (index === 3 || index === 4) {
          input.type = 'number';
        } else {
          input.type = 'text';
        }

        input.classList.add('cell-input');

        rows[i].replaceChild(input, item);

        tempClick = false;

        input.addEventListener('keyup', (evnt) => {
          if (evnt.code !== 'Enter') {
            return;
          }

          if (input.value === '') {
            input.value = item.innerHTML;
          }

          switch (index) {
            case 0:
            case 1:
            case 2:
              item.innerHTML = input.value;
              break;

            case 3:
              item.innerHTML = input.value;
              break;

            case 4:
              if (input.value !== '') {
                item.innerHTML
                = `$${(Number(input.value)).toLocaleString('en')}`;
              }
              break;
          }

          rows[i].replaceChild(item, input);

          tempClick = true;
        });
      }
    }
  }
});

'use strict';

const body = document.querySelector('body');
const table = document.querySelector('tbody');
const headers = [...document.querySelectorAll('thead th')];
const counters = Array(headers.length).fill(0);

document.addEventListener('click', e => {
  const rows = [...table.querySelectorAll('tr')];
  for (const element of headers) {
    if (e.target === element){
      const i = headers.indexOf(e.target);
      if (counters[i] === 0) {
        counters[i] = 1;
        rows.sort(function(a, b) {
          if (a.cells[i].textContent.includes('$')) {
            return parseInt(a.cells[i].textContent.slice(1))
              - parseInt(b.cells[i].textContent.slice(1));
          } else {
            return a.cells[i].textContent.localeCompare(b.cells[i].textContent);
          }
        });
    
        for (const rowElement of rows) {
          table.append(rowElement);
        }
      } else {
        counters[i] = 0;
        rows.sort(function(a, b) {
          if (a.cells[i].textContent.includes('$')) {
            return parseInt(b.cells[i].textContent.slice(1))
              - parseInt(a.cells[i].textContent.slice(1));
          } else {
            return b.cells[i].textContent.localeCompare(a.cells[i].textContent);
          }
        });
    
        for (const rowElement of rows) {
          table.append(rowElement);
        }
      }
    }
  }

  for (let j = 0; j < table.childElementCount; j++) {
    if (rows[j].classList.contains('active')) {
      rows[j].classList.remove('active');
    }
    for (let k = 0; k < rows[j].childElementCount; k++) {
      if (e.target === rows[j].cells[k]) {
        rows[j].classList.add('active');
      }
    }
  }
});

const form = document.createElement('form');
form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name: <input
    name="name"
    type="text"
    data-qa="name"
    required>
  </label>
  <label>Position: <input
    name="position"
    type="text"
    data-qa="position"
    required>
  </label>
  <label>Office: 
    <select name="office" data-qa="office" required>
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input
    name="age"
    type="number"
    data-qa="age"
    required>
  </label>
  <label>Salary: <input
    name="salary"
    type="number"
    data-qa="salary"
    required>
  </label>
`;

body.append(form);
const button = document.createElement('button');
button.innerText = 'Save to table';
form.append(button);

button.addEventListener('click', ev => {
  const message = document.createElement('div');
  message.classList.add('notification');
  message.dataset.qa = 'notification';
  message.style.display = 'flex';
  message.style.justifyContent = 'center';
  message.style.alignItems = 'center';
  message.style.fontWeight = 'bold';
  message.style.fontSize = '40px';

  const newRow = document.createElement('tr');
  newRow.innerHTML += `
    <td>${form.children[0].lastElementChild.value}</td>
    <td>${form.children[1].lastElementChild.value}</td>
    <td>${form.children[2].lastElementChild.value}</td>
    <td>${form.children[3].lastElementChild.value}</td>
    <td>$${parseInt(form.children[4].lastElementChild.value).toLocaleString('en-US')}</td>
  `;

  if (form.children[0].lastElementChild.value.length < 4) {
    message.classList.add('error');
    message.textContent = 'ERROR';
    body.append(message);
  } else if (form.children[1].lastElementChild.value.length === 0) {
    message.classList.add('warning', 'error');
    message.textContent = 'WARNING';
    body.append(message);
  } else if (form.children[3].lastElementChild.value < 18
      || form.children[3].lastElementChild.value > 90) {
        message.classList.add('error');
        message.textContent = 'ERROR!';
        body.append(message);
  } else if (form.children[4].lastElementChild.value.length === 0) {
    message.classList.add('warning');
    message.textContent = 'WARNING!';
    body.append(message);
  } else {
      table.appendChild(newRow);
      message.classList.add('success');
      message.textContent = 'SUCCESS!';
      body.append(message);
  }
    setTimeout(() => {
      message.remove()
    }, 1500);
    ev.preventDefault();
});

let clicked = false;

table.addEventListener('dblclick', evt => {
  const cellCount = document.querySelectorAll('td');
  for (let x = 0; x < cellCount.length; x++) {
      if (evt.target === cellCount[x] && clicked === false) {
        clicked = true;
        let oldValue = cellCount[x].textContent;
        cellCount[x].innerHTML = `
          <input class='cell-input'>
        `;

      table.addEventListener('keydown', enter => {
        const newTD = document.createElement('td');
        if (enter.key === 'Enter') {
          let cellValue = document.getElementsByClassName('cell-input')[0].value;

          if (cellValue !== '') {
            newTD.textContent = cellValue;
            cellCount[x].replaceWith(newTD);
          } else {
            newTD.textContent = oldValue;
            cellCount[x].replaceWith(newTD);
          }
        }
        clicked = false;
      });

      table.addEventListener('blur', () => {
        const newTD = document.createElement('td');
        let cellValue = document.getElementsByClassName('cell-input')[0].value;

        if (cellValue !== '') {
          newTD.textContent = cellValue;
          cellCount[x].replaceWith(newTD);
        } else {
          newTD.textContent = oldValue;
          cellCount[x].replaceWith(newTD);
        }

        clicked = false;
      }, true);
    }
  }
});

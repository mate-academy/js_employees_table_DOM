'use strict';

// write code here

const headerTable = document.querySelector('tr');
const table = document.querySelector('tbody');
let nameTitle = '';
const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
<label>Name: 
  <input 
    minlength="4" 
    required 
    data-qa="name" 
    name="name" 
    type="text"
  >
</label>
<label>Position: 
  <input 
    required 
    data-qa="position" 
    name="position" 
    type="text"
  >
</label>
<label>Offic 
  <select 
    required 
    data-qa="office" 
    name="Office" 
    id=""
  >
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore">TSingapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
</select>
</label>
<label>Age:
  <input 
    min="18" 
    max="90" 
    required 
    data-qa="age" 
    name="age" 
    type="number"
  >
</label>
<label>Salary: 
  <input 
    required 
    data-qa="salary" 
    name="salary" 
    type="number"
  >
</label>
<button>Save to table</button>
`;

document.querySelector('table').after(form);

const convertNum = salary => +salary.slice(1).split(',').join('');

headerTable.addEventListener('click', e => {
  const listTable = [...document.querySelectorAll('tr')].slice(1, -1);
  let sort;

  if (nameTitle === e.target.innerText) {
    nameTitle = '';

    switch (e.target.innerText) {
      case 'Name':
        sort = listTable.sort((a, b) => {
          return b.children[0].innerText.localeCompare(a.children[0].innerText);
        });

        table.append(...sort);
        break;

      case 'Position':
        sort = listTable.sort((a, b) => {
          return b.children[1].innerText.localeCompare(a.children[1].innerText);
        });

        table.append(...sort);
        break;

      case 'Office':
        sort = listTable.sort((a, b) => {
          return b.children[2].innerText.localeCompare(a.children[2].innerText);
        });

        table.append(...sort);
        break;

      case 'Age':
        sort = listTable.sort((a, b) => {
          return b.children[3].innerText - a.children[3].innerText;
        });

        table.append(...sort);
        break;

      case 'Salary':
        sort = listTable.sort((a, b) => {
          return convertNum(b.children[4].innerText)
            - convertNum(a.children[4].innerText);
        });

        table.append(...sort);
    }
  } else {
    nameTitle = e.target.innerText;

    switch (e.target.innerText) {
      case 'Name':
        sort = listTable.sort((a, b) => {
          return a.children[0].innerText.localeCompare(b.children[0].innerText);
        });

        table.append(...sort);
        break;

      case 'Position':
        sort = listTable.sort((a, b) => {
          return a.children[1].innerText.localeCompare(b.children[1].innerText);
        });

        table.append(...sort);
        break;

      case 'Office':
        sort = listTable.sort((a, b) => {
          return a.children[2].innerText.localeCompare(b.children[2].innerText);
        });

        table.append(...sort);
        break;

      case 'Age':
        sort = listTable.sort((a, b) => {
          return a.children[3].innerText - b.children[3].innerText;
        });

        table.append(...sort);
        break;

      case 'Salary':
        sort = listTable.sort((a, b) => {
          return convertNum(a.children[4].innerText)
            - convertNum(b.children[4].innerText);
        });

        table.append(...sort);
    }
  }
});

table.addEventListener('click', (e) => {
  [...document.querySelectorAll('tr')].slice(1, -1).forEach((item) => {
    item.classList = '';
  });

  e.path[1].className = 'active';
});

const massageResultTrue = Promise.resolve('new employer create');
const massageResultFalse = Promise.reject(Error('some wrong, write correct'));

document.querySelector('button').addEventListener('click', e => {
  const div = document.createElement('div');

  div.dataset.qa = 'notification';

  e.preventDefault();

  const dataInput = document.querySelectorAll('input');
  const selectSity = document.querySelector('select');
  const optionName = document.querySelectorAll('option');

  let controlForm = true;

  if (dataInput[0].value.length < 4 || +dataInput[0].value) {
    controlForm = false;
  }

  if (dataInput[1].value.length < 4 || +dataInput[1].value) {
    controlForm = false;
  }

  if (dataInput[2].value < 18) {
    controlForm = false;
  }

  if (dataInput[3].value < 1000) {
    controlForm = false;
  }

  if (controlForm === false) {
    massageResultFalse
      .catch((error) => {
        div.classList = ('notification error');
        div.innerText = error;
        document.body.append(div);

        setTimeout(function() {
          div.remove();
        }, 2000);
      });

    return;
  }

  const itemTable = document.createElement('tr');

  itemTable.innerHTML = `
    <td>${dataInput[0].value}</td>
    <td>${dataInput[1].value}</td>
    <td>${optionName[selectSity.selectedIndex].value}</td>
    <td>${dataInput[2].value}</td>
    <td>${`$` + Number(dataInput[3].value).toLocaleString(`en-ES`)}</td>
  `;

  document.querySelector('tbody').append(itemTable);

  massageResultTrue
    .then((result) => {
      div.classList = ('notification success');
      div.innerText = result;
      document.body.append(div);

      setTimeout(function() {
        div.remove();
      }, 2000);
    });
});

const input = document.createElement('input');
let previousText;

document.querySelector('tbody').addEventListener('dblclick', e => {
  if (e.target.tagName !== 'TD') {
    return;
  }

  previousText = e.target.textContent;

  input.className = 'cell-input';

  e.target.textContent = '';
  e.target.append(input);

  input.focus();
});

input.addEventListener('keypress', e => {
  if (e.code !== 'Enter') {
    return;
  }

  changeText(e.target);
});

input.addEventListener('blur', e => {
  changeText(e.target);
});

function changeText(targ) {
  const div = document.createElement('div');
  const td = targ.closest('TD');
  let newText = input.value;

  if (td.cellIndex === 0 || td.cellIndex === 1 || td.cellIndex === 2) {
    for (const letter of input.value) {
      if ('0123456789'.includes(letter)) {
        newText = previousText;

        massageResultFalse
          .catch((error) => {
            div.classList = ('notification error');
            div.innerText = error;
            document.body.append(div);

            setTimeout(function() {
              div.remove();
            }, 2000);
          });
      }
    }
  }

  if (td.cellIndex === 0) {
    if (input.value.length < 4) {
      newText = previousText;

      massageResultFalse
        .catch((error) => {
          div.classList = ('notification error');
          div.innerText = error;
          document.body.append(div);

          setTimeout(function() {
            div.remove();
          }, 2000);
        });
    }
  }

  if (td.cellIndex === 3) {
    if (!+input.value || input.value < 18 || input.value > 90) {
      newText = previousText;

      massageResultFalse
        .catch((error) => {
          div.classList = ('notification error');
          div.innerText = error;
          document.body.append(div);

          setTimeout(function() {
            div.remove();
          }, 2000);
        });
    }
  }

  if (td.cellIndex === 4) {
    if (!+input.value) {
      newText = previousText;

      massageResultFalse
        .catch((error) => {
          div.classList = ('notification error');
          div.innerText = error;
          document.body.append(div);

          setTimeout(function() {
            div.remove();
          }, 2000);
        });
    } else {
      const formatter = new Intl.NumberFormat('en-US');
      const salary = `$${formatter.format(input.value)}`;

      newText = salary;
    }
  }

  if (input.value.length === 0) {
    td.textContent = previousText;
  } else {
    td.textContent = newText;
  }

  input.value = '';
}

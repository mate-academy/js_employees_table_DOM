'use strict';

// write code here

// * Add Form
// * Valid Notification
// * Edit Cells
// * Sort By Cols up\down
// * Select Row

const pushNotification = (posTop, posRight, title, description, type) => {
  const mess = document.createElement('div');

  mess.dataset.qa = 'notification';
  mess.className = `notification ${type}`;
  mess.style.top = `${posTop}px`;
  mess.style.right = `${posRight}px`;

  mess.innerHTML = `<h2 class="title">${title}</h2><p class='description'>${description}</p>`;

  document.body.appendChild(mess);

  setTimeout(() => {
    mess.style.display = 'none';
  }, 2000);
};

function AddForm() {
  function ValidateForm(inps) {
    if (inps[0].children[0].value.length < 4) {
      pushNotification(
        20,
        20,
        'Error',
        'Name must be at least 4 characters long.',
        'error',
      );

      return false;
    }

    if (
      parseInt(inps[3].children[0].value) < 18 ||
      parseInt(inps[3].children[0].value) > 90
    ) {
      pushNotification(
        20,
        20,
        'Error',
        'Age must be between 18 and 90',
        'error',
      );

      return false;
    }

    if (inps[1].children[0].value === '') {
      pushNotification(20, 20, 'Error', 'Position must be written.', 'error');

      return false;
    }

    pushNotification(20, 20, 'Success', 'Data seccessfully added', 'success');

    return true;
  }

  function SaveData(inps) {
    if (ValidateForm(inps)) {
      const table = document.querySelector('table');

      const row = table.insertRow(table.rows.length - 1);
      const cells = [
        row.insertCell(),
        row.insertCell(),
        row.insertCell(),
        row.insertCell(),
        row.insertCell(),
      ];

      cells.forEach((el, i) => {
        el.innerText = inps[i].children[0].value;
      });
    }
  }

  const form = document.createElement('form');

  form.className = 'new-employee-form';

  const inputs = [
    document.createElement('label'),
    document.createElement('label'),
    document.createElement('label'),
    document.createElement('label'),
    document.createElement('label'),
  ];

  inputs[0].innerHTML = `Name: <input required name="name" type="text" data-qa="name">`;
  inputs[1].innerHTML = `Position: <input required name="position" type="text" data-qa="position">`;

  inputs[2].innerHTML = `Office: <select name="office" data-qa="office">
  <option value="Tokyo">Tokyo</option>
  <option value="Singapore">Singapore</option>
  <option value="London">London</option>
  <option value="New York">New York</option>
  <option value="Edinburgh">Edinburgh</option>
  <option value="San Francisco">San Francisco</option>
  </select>`;

  inputs[3].innerHTML = `Age: <input required important name="age" type="text" data-qa="age">`;
  inputs[4].innerHTML = `Salary: <input required name="salary" type="text" data-qa="salary">`;

  inputs.forEach((el) => {
    form.appendChild(el);
  });

  const btn = document.createElement('button');

  btn.innerText = 'Save to table';

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    SaveData(inputs);
  });

  form.appendChild(btn);

  document.body.appendChild(form);
}

function SelectableRows() {
  const rows = Array.from(document.querySelector('table').rows).filter(
    (el, id, arr) => id !== 0 && id !== arr.length - 1,
  );

  rows.forEach((row) => {
    row.addEventListener('click', (e) => {
      rows.forEach((el) => {
        el.classList.remove('active');
      });

      row.classList.add('active');
    });
  });
}

function EditableCells() {
  const cells = Array.from(document.querySelector('table').rows)
    .filter((el, id, arr) => id !== 0 && id !== arr.length - 1)
    .reduce((acc, el) => acc.concat(Array.from(el.cells)), []);

  cells.forEach((cell) => {
    cell.addEventListener('dblclick', (e) => {
      const input = document.createElement('input');

      input.type = 'text';
      input.value = cell.innerText;

      cell.innerHTML = '';
      cell.appendChild(input);

      input.addEventListener('blur', (ev) => {
        cell.innerText = ev.target.value;
      });
    });
  });
}

function SortByColumn() {
  function SortBy(id, byAsc) {
    if (byAsc) {
      if (
        !isNaN(tBody[0].cells[id].innerText) ||
        tBody[0].cells[id].innerText.includes('$')
      ) {
        tBody.sort(
          (a, b) =>
            parseFloat(a.cells[id].innerText.replace('$', '')) -
            parseFloat(b.cells[id].innerText.replace('$', '')),
        );

        tBody.forEach(
          (row) => document.querySelector('table').appendChild(row),
          // eslint-disable-next-line prettier/prettier
        );
      } else {
        tBody.sort(
          (a, b) => a.cells[id].innerText.localeCompare(b.cells[id].innerText),
          // eslint-disable-next-line prettier/prettier
        );

        tBody.forEach(
          (row) => document.querySelector('table').appendChild(row),
          // eslint-disable-next-line prettier/prettier
        );
      }

      return false;
    } else {
      if (
        !isNaN(tBody[0].cells[id].innerText) ||
        tBody[0].cells[id].innerText.includes('$')
      ) {
        tBody.sort(
          (a, b) =>
            parseFloat(b.cells[id].innerText.replace('$', '')) -
            parseFloat(a.cells[id].innerText.replace('$', '')),
        );

        tBody.forEach(
          (row) => document.querySelector('table').appendChild(row),
          // eslint-disable-next-line prettier/prettier
        );
      } else {
        tBody.sort(
          (a, b) => b.cells[id].innerText.localeCompare(a.cells[id].innerText),
          // eslint-disable-next-line prettier/prettier
        );

        tBody.forEach(
          (row) => document.querySelector('table').appendChild(row),
          // eslint-disable-next-line prettier/prettier
        );
      }

      return true;
    }
  }

  const bnts = Array.from(document.querySelector('table').rows[0].cells);
  const tBody = Array.from(document.querySelector('table').rows).filter(
    (el, id, arr) => id !== 0 && id !== arr.length - 1,
  );

  bnts.forEach((el, i) => {
    // eslint-disable-next-line prefer-const
    let byAsc = true;

    el.addEventListener('click', (e) => {
      byAsc = SortBy(i, byAsc);
    });
  });
}

SortByColumn();
SelectableRows();
EditableCells();
AddForm();

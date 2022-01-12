'use strict';

// write code here
const form = document.createElement('form');
const table = document.querySelector('table');
const tBody = document.querySelector('tbody');

const createForm = () => {
  form.classList = 'new-employee-form';
  document.body.append(form);

  form.insertAdjacentHTML('afterbegin', `
  <label>Name: 
    <input 
      name="name"
      type="text"
      >
  </label>
  <label>Position: 
    <input 
      name="position"
      type="text"
      >
  </label>
  <label for="office">Office:
    <select name="office" id="office">
      <option value="Tokyo">Tokyo</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: 
    <input name="age" type="number">
  </label>
  <label>Salary: 
    <input name="salary" type="number">
  </label>
  <button>Save to table</button>`);

  const allLabel = document.querySelectorAll('label');

  allLabel.forEach((dataSet) => {
    dataSet.children[0].dataset.qa = dataSet.children[0].name;
  });
};

const addDataAppending = () => {
  const office = document.querySelector('select');

  office.value = '';

  form.addEventListener('click', (e) => {
    e.preventDefault();

    const target = e.target;
    const input = document.querySelectorAll('input');
    const fullName = input[0];
    const position = input[1];
    const age = input[2];
    const salary = input[3];
    const div = document.createElement('div');
    const h2 = document.createElement('h2');
    const p = document.createElement('p');
    const regex = /[A-Za-z]/;
    const str = `${salary.value}`;
    const dig = str.split('');
    let newValue = '';

    if (dig.length > 3) {
      for (let i = dig.length - 3; i > 0; i = i - 3) {
        dig.splice(i, 0, ',');
      }
      newValue = dig.join('');
    };

    if (fullName.value.length >= 4
      && (age.value >= 18 && age.value <= 90)
      && position.value.length > 0 && salary.value > 0
      && office.value !== '' && target.tagName === 'BUTTON') {
      const colsLength = table.rows[0].cells.length;
      const newRow = table.insertRow(-1);
      const tr = document.createElement('tr');

      div.dataset.qa = 'notification';
      div.classList = 'notification success';
      h2.classList = 'title';
      h2.textContent = 'Success!';
      p.textContent = 'Added to the table successfully!';
      document.body.append(div);
      div.append(h2, p);

      setTimeout(() => {
        div.remove();
      }, 2000);

      for (let i = 0; i < colsLength; i++) {
        tr.appendChild(newRow.insertCell(-1));
        tBody.appendChild(tr);
      }
      tr.children[0].innerText = fullName.value;
      tr.children[1].textContent = position.value;
      tr.children[2].textContent = office.value;
      tr.children[3].textContent = `${age.value}`;

      if (salary.value.length > 3) {
        tr.children[4].textContent = `$${newValue}`;
      } else {
        tr.children[4].textContent = `$${salary.value}`;
      }
    };

    if (((fullName.value.length > 0 && fullName.value.length < 4)
      || (age.value < 18 || age.value > 90)
      || salary.value === '0')
      && target.tagName === 'BUTTON') {
      div.dataset.qa = 'notification';
      div.classList = 'notification error';
      h2.classList = 'title';
      h2.textContent = 'Error!';

      p.textContent = 'The name must be at least 4 characters long.\n '
      + 'Age must be between 18 and 90 years old.\n '
      + 'Salary should not be equal to zero.';
      document.body.append(div);
      div.append(h2, p);

      setTimeout(() => {
        div.remove();
      }, 2000);
    };

    function validate(eve) {
      const chars = eve.target.value.split('');
      const char = chars.pop();

      if (!regex.test(char)) {
        eve.target.value = chars.join('');
        div.dataset.qa = 'notification';
        div.classList = 'notification error';
        h2.classList = 'title';
        h2.textContent = 'Error!';

        p.textContent = 'Change the language to English!!!\n '
        + 'Only for letters';
        document.body.append(div);
        div.append(h2, p);

        setTimeout(() => {
          div.remove();
        }, 2000);
      }
    }
    fullName.addEventListener('input', validate);
    position.addEventListener('input', validate);

    if ((!fullName.value
      || !age.value.length
      || !position.value
      || !salary.value
      || office.value === '')
      && target.tagName === 'BUTTON') {
      div.dataset.qa = 'notification';

      div.classList = 'notification warning';
      h2.classList = 'title';
      h2.textContent = 'Warning!!!';
      p.textContent = 'All fields must be filled';
      document.body.append(div);
      div.append(h2, p);

      setTimeout(() => {
        div.remove();
      }, 2000);
    }
  });
};

const addTableSorting = () => {
  const sortTable = (index, order) => {
    const collator = new Intl.Collator([], { numeric: true });
    const compare = (rowA, rowB) => {
      const rowDataA = rowA.cells[index].innerHTML;
      const rowDataB = rowB.cells[index].innerHTML;

      if (order === 1) {
        return collator.compare(rowDataA, rowDataB);
      }

      return -(collator.compare(rowDataA, rowDataB));
    };
    const column = [].slice.call(tBody.rows);

    column.sort(compare);
    table.removeChild(tBody);

    for (let i = 0; i < column.length; i++) {
      tBody.appendChild(column[i]);
    }

    table.appendChild(tBody);
  };

  table.addEventListener('click', (e) => {
    const el = e.target;

    if (el.nodeName !== 'TH') {
      return;
    }

    const order = (el.dataset.type = -(el.dataset.type || -1));
    const index = el.cellIndex;

    sortTable(index, order);
  });
};

const addRowSelecting = () => {
  table.addEventListener('click', (e) => {
    const el = e.target;

    if (el.nodeName !== 'TH') {
      for (const trBody of tBody.children) {
        if (trBody.classList.contains('active')) {
          trBody.classList.remove('active');
        }
      }

      const rowClass = el.parentNode;

      return rowClass.classList.toggle('active');
    }
  });
};

const addTableEditing = () => {
  let td;

  table.addEventListener('dblclick', function func(events) {
    if (td) {
      return;
    };
    td = events.target.closest('td');

    if (!td) {
      return;
    };

    const tr = events.target.closest('tr');
    const editInput = document.createElement('input');
    const editOffice = document.querySelector('select').cloneNode(true);
    const oldTD = td.innerHTML;

    editOffice.value = '';
    editInput.value = '';
    editInput.classList.add('cell-input');
    td.style.display = 'none';
    td.classList.remove('edit');

    if (td !== tr.children[2]) {
      td.after(editInput);
      editInput.focus();

      const keyUp = (e) => {
        if (td === tr.children[3]) {
          editInput.type = 'number';

          if (editInput && e.key === 'Enter') {
            if (editInput.value !== '') {
              td.classList.add('edit');
              td.innerHTML = editInput.value;
              editInput.remove();
              td.style.display = '';
              td = '';
            }

            if (editInput.value === '') {
              td.classList.add('edit');
              td.innerHTML = oldTD;
              editInput.remove();
              td.style.display = '';
              td = '';
            }
          }
        }

        if (td === tr.children[4]) {
          editInput.type = 'number';

          if (editInput && e.key === 'Enter') {
            if (editInput.value !== '') {
              td.classList.add('edit');

              td.innerHTML = '$' + Intl.NumberFormat('en-US')
                .format(editInput.value);
              editInput.remove();
              td.style.display = '';
              td = '';
            }

            if (editInput.value === '') {
              td.classList.add('edit');
              td.innerHTML = oldTD;
              editInput.remove();
              td.style.display = '';
              td = '';
            }
          }
        }

        if (td === tr.children[0]
          || td === tr.children[1]) {
          if (editInput && e.key === 'Enter') {
            if (editInput.value !== '') {
              td.classList.add('edit');
              td.innerHTML = editInput.value;
              editInput.remove();
              td.style.display = '';
              td = '';
            }

            if (editInput.value === '') {
              td.classList.add('edit');
              td.innerHTML = oldTD;
              editInput.remove();
              td.style.display = '';
              td = '';
            }
          }
        }
      };
      const blurFocus = () => {
        if (td !== tr.children[4]) {
          if (td.className !== 'edit' && editInput.value !== '') {
            td.innerHTML = editInput.value;
            editInput.remove();
            td.style.display = '';
            td = '';
          }

          if (td.className !== 'edit' && editInput.value === '') {
            td.innerHTML = oldTD;
            editInput.remove();
            td.style.display = '';
            td = '';
          }
        } else {
          if (editInput.value !== '' && td.className !== 'edit') {
            td.innerHTML = '$' + Intl.NumberFormat('en-US')
              .format(editInput.value);
            editInput.remove();
            td.style.display = '';
            td = '';
          }

          if (editInput.value === '' && td.className !== 'edit') {
            td.innerHTML = oldTD;
            editInput.remove();
            td.style.display = '';
            td = '';
          }
        }
      };

      editInput.addEventListener('keyup', keyUp);
      editInput.addEventListener('blur', blurFocus);
    }

    if (td === tr.children[2]) {
      td.after(editOffice);
      editOffice.focus();

      editOffice.addEventListener('change', () => {
        if (editOffice.value !== '') {
          td.classList.add('edit');
          td.innerHTML = editOffice.value;
          editOffice.remove();
          td.style.display = '';
          td = '';
        }

        if (editOffice.value === '') {
          td.classList.add('edit');
          td.innerHTML = oldTD;
          editOffice.remove();
          td.style.display = '';
          td = '';
        }
      });

      editOffice.addEventListener('blur', () => {
        if (td.className !== 'edit' && editOffice.value !== '') {
          td.innerHTML = editOffice.value;
          editOffice.remove();
          td.style.display = '';
          td = '';
        }

        if (td.className !== 'edit' && editOffice.value === '') {
          td.innerHTML = oldTD;
          editOffice.remove();
          td.style.display = '';
          td = '';
        }
      });
    }
  });
};

createForm();
addTableSorting();
addRowSelecting();
addDataAppending();
addTableEditing();

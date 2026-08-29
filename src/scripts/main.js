'use strict';

// write code here
const headLinks = document.querySelectorAll('thead th');
const tbody = document.querySelector('tbody');

headLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    headLinks.forEach((item) => {
      if (item !== e.target) {
        item.removeAttribute('data-order');
      }
    });

    const coord = e.target.cellIndex;
    const strList = [...document.querySelectorAll('tbody tr')];
    let order = e.target.getAttribute('data-order');

    if (order === 'asc') {
      e.target.setAttribute('data-order', 'desc');
      order = 'desc';
    } else {
      e.target.setAttribute('data-order', 'asc');
      order = 'asc';
    }

    strList.sort((a, b) => {
      const textA = a.cells[coord].textContent;
      const textB = b.cells[coord].textContent;

      if (coord === 4 || coord === 3) {
        const numA = Number(textA.replace(/[^\d]/g, ''));
        const numB = Number(textB.replace(/[^\d]/g, ''));

        return order === 'asc' ? numA - numB : numB - numA;
      }

      return order === 'asc'
        ? textA.localeCompare(textB)
        : textB.localeCompare(textA);
    });

    tbody.append(...strList);
  });
});

tbody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  const previousActive = document.querySelector('tr.active');

  if (previousActive) {
    previousActive.classList.remove('active');
  }

  clickedRow.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
    <label>Name:<input name="name" type="text" data-qa="name"></label>
    <label>Position:<input name="position" type="text" data-qa="position"></label>
    <label>Office:
      <select name="office" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age:<input name="age" type="number" data-qa="age"></label>
    <label>Salary:<input name="salary" type="number" data-qa="salary"></label>
    <button type="submit">Save to table</button>`;

document.body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const intName = form.querySelector('[name="name"]').value;
  const intAge = form.querySelector('[name="age"]').value;
  const intPosition = form.querySelector('[name="position"]').value;
  const intOffice = form.querySelector('[name="office"]').value;
  const intSalary = form.querySelector('[name="salary"]').value;

  if (
    intName.length < 4 ||
    intAge < 18 ||
    intAge > 90 ||
    !intSalary ||
    !intOffice ||
    !intPosition
  ) {
    const message = document.createElement('div');

    message.classList.add('notification', 'error');
    message.dataset.qa = 'notification';
    message.textContent = 'Error!';

    return document.body.append(message);
  } else {
    const message1 = document.createElement('div');

    message1.classList.add('notification', 'success');
    message1.dataset.qa = 'notification';
    message1.textContent = 'Success!!';

    document.body.append(message1);
  }

  const newPersone = document.createElement('tr');

  newPersone.innerHTML = `
    <td>${intName}</td>
    <td>${intPosition}</td>
    <td>${intOffice}</td>
    <td>${intAge}</td>
    <td>$${Number(intSalary).toLocaleString('en-US')}</td>`;

  tbody.append(newPersone);
});

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  const actInp = document.querySelector('.cell-input');

  if (actInp) {
    const newText = actInp.value;
    const olldCell = actInp.parentElement;

    actInp.remove();

    olldCell.textContent = newText;
  }

  const cellText = cell.textContent;
  const inp = document.createElement('input');

  inp.className = 'cell-input';
  inp.value = cellText;
  cell.textContent = '';
  cell.append(inp);

  const save = () => {
    const newText = inp.value;

    if (!newText) {
      cell.textContent = cellText;
    } else {
      cell.textContent = newText;
    }
  };

  inp.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      save();
    }
  });

  inp.addEventListener('blur', save);
});

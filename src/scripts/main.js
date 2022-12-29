'use strict';

// write code here
const table = document.querySelector('table');

document.addEventListener('DOMContentLoaded', function() {
  const headers = table.querySelectorAll('th');
  const tableBody = table.querySelector('tbody');

  const directions = Array.from(headers).map(function(header) {
    return '';
  });

  const transform = function(index, content) {
    const type = headers[index].getAttribute('data-type');

    switch (type) {
      case 'number':
        return parseFloat(content.slice(1, -1));
      case 'string':
      default:
        return content;
    }
  };

  const sortColumn = function(index) {
    const direction = directions[index] || 'asc';
    const multiplier = (direction === 'asc') ? 1 : -1;

    const rows = tableBody.querySelectorAll('tr');

    const newRows = Array.from(rows);

    newRows.sort(function(rowA, rowB) {
      const cellA = rowA.querySelectorAll('td')[index].innerHTML;
      const cellB = rowB.querySelectorAll('td')[index].innerHTML;

      const a = transform(index, cellA);
      const b = transform(index, cellB);

      if (a > b) {
        return 1 * multiplier;
      } else if (a < b) {
        return -1 * multiplier;
      } else if (a === b) {
        return 0;
      }
    });

    [].forEach.call(rows, function(row) {
      tableBody.removeChild(row);
    });

    directions[index] = direction === 'asc' ? 'desc' : 'asc';

    newRows.forEach(function(newRow) {
      tableBody.appendChild(newRow);
    });
  };

  [].forEach.call(headers, function(header, index) {
    header.addEventListener('click', function() {
      sortColumn(index);
    });
  });
});

const newForm = document.createElement('form');

newForm.className = 'new-employee-form';

newForm.innerHTML
= `
<label>Name:
  <input
    name="name"
    type="text"
    data-qa="name"
    required
    id="name"
    value="">
</label>
<label>Position:
<input
name="position"
type="text"
data-qa="position"
required
id="position"
value="">
</label>
<label>Office:
  <select name="office" required data-qa="office" id="office">
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
  </select>
</label>
<label>Age:
  <input
    name="age"
    type="number"
    data-qa="age"
    required
    id="age"
    value="">
  </label>
<label>Salary:
  <input
    name="salary"
    type="number"
    data-qa="salary"
    required
    id="salary"
    value="">
  </label>
<button>Save to table</button>`;

const body = document.querySelector('body');

body.append(newForm);

let selectedTr;

table.addEventListener('click', function() {
  const tr = event.target.closest('tr');

  function highlight() {
    if (selectedTr) {
      selectedTr.classList.remove('active');
    }
    selectedTr = tr;
    selectedTr.classList.add('active');
  }

  if (!tr) {
    return;
  }

  if (!table.contains(tr)) {
    return;
  }

  highlight(tr);
});

function tableNotification(info) {
  const push = document.createElement('div');
  const title = document.createElement('h2');
  const p = document.createElement('p');

  push.className = 'notification success';
  title.className = 'title';
  title.innerText = 'Sucess!';
  p.innerText = 'You have changed employer data';
  push.setAttribute('data-qa', 'notification');

  if (!info) {
    push.className = 'notification error';
    title.className = 'title';
    title.innerText = 'Error!';
    p.innerText = 'Please, enter valid data';
  }

  push.append(title, p);
  body.append(push);

  setTimeout(() => {
    push.remove();
  }, 2000);
}

function validateForm() {
  const nameF = document.querySelector('[data-qa="name"]');
  const x = nameF.value;

  if (x.length < 5) {
    return false;
  }

  const ageF = document.querySelector('[data-qa="age"]');
  const y = ageF.value;

  if (y < 18) {
    return false;
  }

  if (y > 90) {
    return false;
  }

  return true;
}

document.querySelector('form').addEventListener('submit',
  function() {
    event.preventDefault();
    tableNotification(validateForm());

    const tr = document.createElement('tr');
    const cols = ['name', 'position', 'office', 'age', 'salary'];

    for (let q = 0; q < cols.length; ++q) {
      const tdNew = document.createElement('td');

      tdNew.textContent = document.getElementById(cols[q]).value;

      if (cols[q] === 'salary') {
        tdNew.textContent = formatSalary(document.getElementById(cols[q]).value
        );
      }

      tr.appendChild(tdNew);
    }

    document.querySelector('tbody').appendChild(tr);
  });

function formatSalary(salary) {
  return '$' + new Intl.NumberFormat('en-GB').format(salary);
}

let area = null;

table.addEventListener('dblclick',
  function() {
    event.preventDefault();

    const td = event.target.closest('td');

    editStart(td);
  });

function editStart(td) {
  const innitualValue = td.textContent;

  if (td.cellIndex === 2) {
    area = document.createElement('select');

    area.innerHTML = `<option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>`;
  } else {
    area = document.createElement('input');
    area.value = '';
  }
  area.className = 'cell-input';

  area.onkeydown = function() {
    if (event.key === 'Enter') {
      this.blur();
    }
  };

  area.onblur = function() {
    editEnd(td, area.value || innitualValue);
  };

  td.replaceWith(area);
  area.focus();
}

function editEnd(td, value) {
  td.innerHTML = value;
  area.replaceWith(td);
}

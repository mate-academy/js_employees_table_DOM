'use strict';

// write code here
document.addEventListener('DOMContentLoaded', function() {
  const table = document.querySelector('table');
  const headers = table.querySelectorAll('th');
  const tableBody = table.querySelector('tbody');
  const rows = tableBody.querySelectorAll('tr');

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

    const newRows = Array.from(rows);

    newRows.sort(function(rowA, rowB) {
      const cellA = rowA.querySelectorAll('td')[index].innerHTML;
      const cellB = rowB.querySelectorAll('td')[index].innerHTML;

      const a = transform(index, cellA);
      const b = transform(index, cellB);

      switch (true) {
        case a > b: return 1 * multiplier;
        case a < b: return -1 * multiplier;
        case a === b: return 0;
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

newForm.innerHTML = `<label>Name:
<input
name="name"
type="text" data-qa="name" required minlength="4" id="name" value=""></label>
<label>Position: <input
name="position"
type="text" data-qa="position" required id="position" value=""></label>
<label>Office: <select name="office" required data-qa="office" id="office">
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
  </select>
</label>
<label>Age: <input name="age"
  type="number"
  data-qa="age" required min="18" max="90" id="age" value=""></label>
<label>Salary: <input name="salary"
  type="number" data-qa="salary" required id="salary" value=""
  ></label>
<button>Save to table</button>`;

const tableN = document.querySelector('table');
const tody = document.querySelector('body');

tody.append(newForm);

let selectedTr;

tableN.addEventListener('click', function() {
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

  if (!tableN.contains(tr)) {
    return;
  }

  highlight(tr);
});

document.querySelector('form').addEventListener('submit',
  function() {
    event.preventDefault();

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

const form = document.querySelector('.new-employee-form');

const nameEmployee = document.getElementById('name');

const age = document.getElementById('age');
const notification = document.createElement('div');

notification.setAttribute('data-qa', 'notification');

nameEmployee.addEventListener('input', function() {
  if (nameEmployee.validity.valid) {
    notification.textContent = '';
    notification.className = 'notification error';
  } else {
    showError();
  }
});

age.addEventListener('input', function() {
  if (age.validity.valid) {
    notification.textContent = '';
    notification.className = 'notification';
  } else {
    showError();
    notification.className = 'notification error';
  }
});

form.addEventListener('submit', function() {
  if (!nameEmployee.validity.valid) {
    showError();
    event.preventDefault();
    notification.className = 'notification error';
  }

  if (!age.validity.valid) {
    showError();
    event.preventDefault();
    notification.className = 'notification error';
  }
});

function showError() {
  if (nameEmployee.validity.valueMissing) {
    notification.textContent = 'you need enter a name';
  } else if (nameEmployee.validity.tooShort) {
    notification.textContent
      = `Name to short`;
  }

  if (age.validity.rangeUnderflow) {
    notification.textContent = 'you have to be adult';
  } else if (age.validity.rangeOverflow) {
    notification.textContent = 'you have to be younger';
  }
  document.querySelector('table').appendChild(notification);
}

let area = null;
const view = document.querySelector('table');

view.addEventListener('dblclick',
  function() {
    event.preventDefault();

    const td = event.target.closest('td');

    editStart(td);
  });

function editStart(td) {
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
    editEnd(td);
  };

  td.replaceWith(area);
  area.focus();
}

function editEnd(td) {
  td.innerHTML = area.value;
  area.replaceWith(td);
}

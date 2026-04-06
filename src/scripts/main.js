'use strict';

class MyTable {
  constructor(elementTable) {
    /**
     * @type {HTMLTableElement}
     */
    this.table = elementTable;
    this.tBody = this.table.tBodies[0];
    this.tHead = this.table.tHead;

    this.actionHead = null;
    this.actionBodyRow = null;
    this.editingCell = null;
    this.startEvents();

    [...this.tHead.rows[0].cells].forEach((elem) => {
      elem.dataset.sortOrder = null;
    });
  }

  /**
   *
   * @param {HTMLTableRowElement} newValue
   * @returns
   */
  setActionBodyRow(newValue) {
    const oldValue = this.actionBodyRow;

    this.actionBodyRow = newValue;

    if (oldValue === newValue) {
      return;
    }

    oldValue?.classList.remove('active');

    newValue?.classList.add('active');
  }

  setActionHead(newValue) {
    if (!newValue) {
      return;
    }

    const oldValue = this.actionHead;
    let sortOrder = 'ASC';

    this.actionHead = newValue;

    if (oldValue === newValue) {
      sortOrder = newValue.dataset.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    }

    newValue.dataset.sortOrder = sortOrder;
    this.sort(newValue, sortOrder);
  }

  startEvents() {
    this.tHead.addEventListener('click', (e) => {
      /**
       * @type {HTMLTableCellElement}
       */
      const cellHead = e.target.closest('th');

      this.setActionHead(cellHead);
    });

    this.tBody.addEventListener('click', (e) => {
      const SelectedBodyRow = e.target.closest('tr');

      this.setActionBodyRow(SelectedBodyRow);
    });

    this.tBody.addEventListener('dblclick', (e) => {
      /**
       * @type {HTMLTableCellElement}
       */
      const selectedCell = e.target.closest('td');

      if (!e) {
        return;
      }

      if (!selectedCell || this.editingCell) {
        return;
      }

      const input = document.createElement('input');

      const originalInput = selectedCell.textContent;

      const styles = getComputedStyle(selectedCell);
      const width =
        selectedCell.clientWidth -
        parseFloat(styles.paddingLeft) -
        parseFloat(styles.paddingRight);

      selectedCell.textContent = '';
      input.value = originalInput;
      input.style.width = width + 'px';
      input.classList.add('cell-input');
      selectedCell.append(input);
      input.focus();
      this.editingCell = selectedCell;

      input.addEventListener('blur', (e2) => {
        const inputValue = input.value;

        input.remove();
        this.editingCell = null;

        if (inputValue === '') {
          selectedCell.textContent = originalInput;
        } else {
          selectedCell.textContent = inputValue;
        }
      });

      input.addEventListener('keydown', (e2) => {
        if (e2.key === 'Enter') {
          input.blur();
        }
      });
    });
  }

  sort(cellHead, sortOrder) {
    if (cellHead === null) {
      return;
    }

    const indexColumn = cellHead.cellIndex;
    const isNumberColumn =
      cellHead.textContent.trim() === 'Age' ||
      cellHead.textContent.trim() === 'Salary';

    const bodyRows = [...this.tBody.rows];

    bodyRows.sort((rowA, rowB) => {
      const cellA = rowA.cells[indexColumn].textContent.trim();
      const cellB = rowB.cells[indexColumn].textContent.trim();

      if (sortOrder === 'ASC') {
        if (isNumberColumn) {
          return this.strToNumber(cellA) - this.strToNumber(cellB);
        }

        return cellA.localeCompare(cellB);
      } else {
        if (isNumberColumn) {
          return this.strToNumber(cellB) - this.strToNumber(cellA);
        }

        return cellB.localeCompare(cellA);
      }
    });

    this.tBody.append(...bodyRows);
  }

  strToNumber(str) {
    return Number(str.replace(/[^\d.-]/g, ''));
  }
}

function showNotification(message, isError = false) {
  const notification = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  p.textContent = message;

  h2.classList.add('title');
  h2.textContent = isError ? 'error' : 'success';
  notification.append(h2);
  notification.append(p);
  notification.classList.add('notification');
  notification.classList.add(isError ? 'error' : 'success');

  notification.setAttribute('data-qa', 'notification');

  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

function createForm() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.innerHTML = `
    <label>Name: <input name="name" type="text" data-qa="name"></label>
    <label>Position: <input name="position" type="text" data-qa="position"></label>
    <label>Office:
      <select name="office" data-qa="office">
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" data-qa="age"></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
    <button type="submit">Save to table</button>
    `;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(form));

    if (
      !formData.name ||
      !formData.position ||
      !formData.office ||
      !formData.age ||
      !formData.salary
    ) {
      return showNotification('Please fill all fields', true);
    }

    if (formData.name.length < 4) {
      return showNotification('Name must be at least 4', true);
    }

    if (formData.age < 18 || formData.age > 90) {
      return showNotification('Age must be between 18 and 90', true);
    }

    const formattedSalary = `$${Number(formData.salary).toLocaleString('en-US')}`;

    const row = table.table.tBodies[0].insertRow(-1);

    row.insertCell(-1).textContent = formData.name;
    row.insertCell(-1).textContent = formData.position;
    row.insertCell(-1).textContent = formData.office;
    row.insertCell(-1).textContent = formData.age;
    row.insertCell(-1).textContent = formattedSalary;
    showNotification('Employee added successfully');
    form.reset();
  });

  document.body.append(form);
}

const table = new MyTable(document.querySelector('table'));

createForm();

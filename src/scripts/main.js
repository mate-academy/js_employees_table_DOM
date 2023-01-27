'use strict';

window.addEventListener('DOMContentLoaded', () => {
  const MIN_LENGTH_NAME = 4;
  const MIN_AGE = 18;
  const MAX_AGE = 90;

  const invalidNameMessage = `No valid name (min ${MIN_LENGTH_NAME} letters)`;
  const invalidAgeMessage = `No valid age (min ${MIN_AGE} max ${MAX_AGE})`;
  const validMessage = `Success added`;

  const table = document.querySelector('table');
  const tableBody = table.querySelector('tbody');

  let tHeadClickCount = {};
  let notificationTimeOut;

  class CreateElement {
    constructor(selector, className, attribute = null) {
      this.selector = selector;
      this.className = className;
      this.attribute = attribute;
    }

    get tag() {
      const element = document.createElement(this.selector);

      element.classList.add(this.className);

      if (this.attribute !== null) {
        element.setAttribute(this.attribute[0], this.attribute[1]);
      }

      return element;
    }
  }

  const notification = new CreateElement(
    'div', 'notification',
    ['data-qa', 'notification']
  ).tag;

  const form = new CreateElement('form', 'new-employee-form').tag;

  form.innerHTML = `
    <label>Name:
      <input
        name="name"
        type="text"
        data-qa="name"
        required
      >
    </label>
    <label>Position:
      <input
        name="position"
        type="text"
        data-qa="position"
        required
      >
    </label>
    <label>Office
      <select data-qa="office" required>
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label>Age:
      <input
        name="age"
        type="number"
        data-qa="age"
        required
      >
    </label>
    <label>Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
        required
      >
    </label>
    <button type="submit">
      Save to table
    </button>
  `;

  table.after(form);

  function callNotification(valueName, valueAge) {
    clearInterval(notificationTimeOut);

    const isValidName = valueName.length >= MIN_LENGTH_NAME;
    const isValidAge = (valueAge >= MIN_AGE) && (valueAge <= MAX_AGE);

    if (isValidAge && isValidName) {
      notification.classList.remove('error');
      notification.classList.add('success');

      notification.innerHTML = `
        <h2 class="title">${validMessage}</h2
      `;
    } else {
      notification.classList.remove('success');
      notification.classList.add('error');

      if (!isValidName) {
        notification.innerHTML = `
          <h2 class="title">${invalidNameMessage}</h2
        `;
      } else if (!isValidAge) {
        notification.innerHTML = `
          <h2 class="title">${invalidAgeMessage}</h2
        `;
      }
    }

    form.after(notification);

    notificationTimeOut = setTimeout(() => {
      notification.remove();
    }, 2000);
  }

  function addFormatUSD(numbers) {
    return '$' + (+numbers).toLocaleString();
  }

  table.addEventListener('click', e => {
    const { target } = e;
    const { cellIndex } = target;
    const copyTableChildren = [...tableBody.children];

    function sortElements(ascendingOrder = true) {
      return copyTableChildren.sort((x, y) => {
        const childX = x.children[cellIndex].textContent;
        const childY = y.children[cellIndex].textContent;

        switch (cellIndex) {
          case 4:
          case 3:
            const parsedX = childX.replace(/\D/g, '');
            const parsedY = childY.replace(/\D/g, '');

            return ascendingOrder
              ? parsedX - parsedY
              : parsedY - parsedX;
          default:
            return ascendingOrder
              ? childX.localeCompare(childY)
              : childY.localeCompare(childX);
        }
      });
    }

    function addSortedElements(arr) {
      tableBody.innerHTML = '';

      arr.forEach(person => {
        tableBody.append(person);
      });
    }

    if (target.closest('thead') && target.tagName === 'TH') {
      if (tHeadClickCount[cellIndex] === undefined) {
        tHeadClickCount = {};

        tHeadClickCount[cellIndex] = 0;
      }

      if (tHeadClickCount[cellIndex] === 0) {
        addSortedElements(sortElements());

        tHeadClickCount[cellIndex]++;
      } else {
        addSortedElements(sortElements(false));

        tHeadClickCount[cellIndex]--;
      }
    }

    if (target.closest('tbody') && target.tagName === 'TD') {
      copyTableChildren.forEach(el => {
        if (el.classList.contains('active')) {
          el.classList.remove('active');
        }
      });

      target.parentElement.classList.add('active');
    }
  });

  tableBody.addEventListener('dblclick', e => {
    const { target } = e;
    const currentData = target.textContent;
    const cellInput = new CreateElement(
      'input',
      'cell-input',
      ['type', 'text']
    ).tag;

    target.innerHTML = '';
    target.append(cellInput);

    cellInput.focus();

    cellInput.addEventListener('focusout', () => {
      if (cellInput.value) {
        if (target.cellIndex === 4) {
          target.textContent = addFormatUSD(cellInput.value);
        } else {
          target.textContent = cellInput.value;
        }
      } else {
        target.textContent = currentData;
      }

      cellInput.remove();
    });

    cellInput.addEventListener('keydown', ev => {
      if (ev.code === 'Enter') {
        cellInput.blur();
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form);
    const citiesList = form.querySelector('select');
    const { selectedIndex } = citiesList;
    const {
      name: inputName,
      position,
      age,
      salary,
    } = Object.fromEntries(data.entries());

    callNotification(inputName, age);

    if (notification.classList.contains('success')) {
      const newPerson = `
      <tr>
        <td>${inputName}</td>
        <td>${position}</td>
        <td>${citiesList[selectedIndex].textContent}</td>
        <td>${age}</td>
        <td>${addFormatUSD(salary)}
        </td>
      </tr>
    `;

      tableBody.insertAdjacentHTML('beforeend', newPerson);

      form.reset();
    }
  });
});

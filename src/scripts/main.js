'use strict';

// start everything
initSorting();
initSelection();
initEdition();
initFormAddingAndWorking();

// init sorting functionality
function initSorting() {
  // init necessary helpfull data
  const tbody = document.querySelector('tbody');
  const ascOrders = {
    name: true,
    position: true,
    office: true,
    age: true,
    salary: true,
  };

  // init heplhull functions
  function appendListToTbody(list) {
    list.forEach(tr => {
      tbody.append(tr);
    });
  }

  function setOtherToDefault(exception) {
    for (const key in ascOrders) {
      if (key !== exception) {
        ascOrders[key] = true;
      }
    }
  }

  // init sorting sunctions
  function sortNumbers(order, columnName) {
    const list = [...tbody.querySelectorAll('tr')];

    if (ascOrders[columnName]) {
      list.sort((a, b) => a.children[order].innerText
        - b.children[order].innerText);
    } else {
      list.sort((a, b) => b.children[order].innerText
        - a.children[order].innerText);
    }
    ascOrders[columnName] = !ascOrders[columnName];
    setOtherToDefault(columnName);

    appendListToTbody(list);
  }

  function sortStrings(order, columnName) {
    const list = [...tbody.querySelectorAll('tr')];

    if (ascOrders[columnName]) {
      list.sort((a, b) =>
        a.children[order].innerText.localeCompare(b.children[order].innerText));
    } else {
      list.sort((a, b) =>
        b.children[order].innerText.localeCompare(a.children[order].innerText));
    }
    ascOrders[columnName] = !ascOrders[columnName];
    setOtherToDefault(columnName);

    appendListToTbody(list);
  }

  function sortSalaries(order, columnName) {
    function getNumberFromSalaryString(str) {
      return +str.toString().slice(1).split(',').join('');
    }

    const list = [...tbody.querySelectorAll('tr')];

    if (ascOrders[columnName]) {
      list.sort((a, b) => getNumberFromSalaryString(a.children[order].innerText)
      - getNumberFromSalaryString(b.children[order].innerText));
    } else {
      list.sort((a, b) => getNumberFromSalaryString(b.children[order].innerText)
      - getNumberFromSalaryString(a.children[order].innerText));
    }
    ascOrders[columnName] = !ascOrders[columnName];

    setOtherToDefault(columnName);
    appendListToTbody(list);
  }

  // init events
  document.querySelectorAll('th')[0].onclick = () => {
    sortStrings(0, 'name');
  };

  document.querySelectorAll('th')[1].onclick = () => {
    sortStrings(1, 'position');
  };

  document.querySelectorAll('th')[2].onclick = () => {
    sortStrings(2, 'office');
  };

  document.querySelectorAll('th')[3].onclick = () => {
    sortNumbers(3, 'age');
  };

  document.querySelectorAll('th')[4].onclick = () => {
    sortSalaries(4, 'salary');
  };
}

// init selecting functionality
function initSelection() {
  const tbody = document.querySelector('tbody');
  let previousActiveElement;

  // selection functionality
  tbody.addEventListener('click', (event) => {
    if (previousActiveElement) {
      previousActiveElement.classList.remove('active');
    }

    previousActiveElement = event.target.parentElement;

    event.target.parentElement.classList.add('active');
  });

  // if customer want reset selection, he will intuitive touch on empty place
  document.body.addEventListener('click', (event) => {
    if (event.target.tagName === 'BODY' && previousActiveElement) {
      previousActiveElement.classList.remove('active');
    }
  });
}

// init editing functionality
function initEdition() {
  const tbody = document.querySelector('tbody');

  let currentEdited;
  let previousTextValue;

  function stopEditioning() {
    currentEdited.parentElement.innerText = (currentEdited.value)
      ? currentEdited.value
      : previousTextValue;
    currentEdited.remove();
    currentEdited = null;
  }

  tbody.addEventListener('dblclick', (event) => {
    previousTextValue = event.target.innerText;
    event.target.innerText = '';

    const input = document.createElement('input');

    input.classList.add('cell-input');

    input.style.width = `${event.target.offsetWidth
      - parseFloat(window.getComputedStyle(event.target).padding) * 2}px`;
    input.value = previousTextValue;
    event.target.append(input);
    input.select();

    currentEdited = input;
  });

  tbody.addEventListener('click', (event) => {
    if (!currentEdited) {
      return;
    }

    if (event.target !== currentEdited) {
      stopEditioning();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (currentEdited && event.code === 'Enter') {
      stopEditioning();
    }
  });
}

// init form functionality
function initFormAddingAndWorking() {
  const tbody = document.querySelector('tbody');

  document.body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form">
    <label>Name: <input name="name" type="text" required></label>
    <label>Position: <input name="position" type="text" required></label>
    <label>Office:
      <select name="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" min="18" max="90"
      required></label>
    <label>Salary: <input name="salary" type="number" required></label>
    <button type="submit" value="Submit" name="submit">Save to table</button>
  </form>
  `);

  const form = document.querySelector('.new-employee-form');

  form.submit.addEventListener('click', validation);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${form.name.value}</td>
        <td>${form.position.value}</td>
        <td>${form.office.value}</td>
        <td>${form.age.value}</td>
        <td>$${form.salary.value.toLocaleString('en-AU')}</td>
      </tr>
  `);
  });

  function validation() {
    for (let i = 0; i < form.querySelectorAll('input').length; i++) {
      if (!form.querySelectorAll('input')[i].value) {
        window.alert('all fields are required');

        return;
      }
    }

    if (form.name.value.length <= 4) {
      window.alert('Name should be longer then 4 letters');

      return;
    }

    if (form.age.value < 18 || form.age.value > 90) {
      window.alert('age should be from 18 till 90');

      return;
    }

    window.alert('Succesfully added');

    return true;
  }
}

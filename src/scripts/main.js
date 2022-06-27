'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

// 1
const obj = {
  name: null,
  position: null,
  office: null,
  age: null,
  salary: null,
};

thead.addEventListener('click', (e) => {
  const name1 = thead.children[0].children[0];
  const position = thead.children[0].children[1];
  const office = thead.children[0].children[2];
  const age = thead.children[0].children[3];
  const salary = thead.children[0].children[4];
  const rows = document.querySelectorAll('tr');

  function sortDESC() {
    let number = null;
    let callback = (a, b) => b.childNodes[number]
      .textContent.localeCompare(a.childNodes[number].textContent);

    switch (e.target) {
      case name1:
        number = 1;
        break;
      case position:
        number = 3;
        break;
      case office:
        number = 5;
        break;
      case age:
        number = 7;
        break;
      case salary:
        number = 9;

        callback = (a, b) => b.childNodes[number].textContent
          .slice(1).split(',').join('')
                - a.childNodes[number].textContent
                  .slice(1).split(',').join('');
        break;
    }

    const result = [...rows].sort(callback);

    for (const tr in result) {
      if (result[tr].parentElement === tbody) {
        tbody.append(result[tr]);
      }
    }
  }

  function sortASC() {
    let number = null;
    let callback = (a, b) => a.childNodes[number].textContent
      .localeCompare(b.childNodes[number].textContent);

    switch (e.target) {
      case name1:
        number = 1;
        break;
      case position:
        number = 3;
        break;
      case office:
        number = 5;
        break;
      case age:
        number = 7;
        break;
      case salary:
        number = 9;

        callback = (a, b) => a.childNodes[number].textContent
          .slice(1).split(',').join('')
                - b.childNodes[number].textContent
                  .slice(1).split(',').join('');
        break;
    }

    const result = [...rows].sort(callback);

    for (const tr in result) {
      if (result[tr].parentElement === tbody) {
        tbody.append(result[tr]);
      }
    }
  }

  if (e.target === name1) {
    if (obj.name === 'ASC') {
      sortDESC();
      obj.name = 'DESC';
    } else if (obj.name === 'DESC' || obj.name === null) {
      sortASC();
      obj.name = 'ASC';
    }
  } else if (e.target === position) {
    if (obj.position === 'ASC') {
      sortDESC();
      obj.position = 'DESC';
    } else if (obj.position === 'DESC' || obj.position === null) {
      sortASC();
      obj.position = 'ASC';
    }
  } else if (e.target === office) {
    if (obj.office === 'ASC') {
      sortDESC();
      obj.office = 'DESC';
    } else if (obj.office === 'DESC' || obj.office === null) {
      sortASC();
      obj.office = 'ASC';
    }
  } else if (e.target === age) {
    if (obj.age === 'ASC') {
      sortDESC();
      obj.age = 'DESC';
    } else if (obj.age === 'DESC' || obj.age === null) {
      sortASC();
      obj.age = 'ASC';
    }
  } else if (e.target === salary) {
    if (obj.salary === 'ASC') {
      sortDESC();
      obj.salary = 'DESC';
    } else if (obj.salary === 'DESC' || obj.salary === null) {
      sortASC();
      obj.salary = 'ASC';
    }
  }
});

// 2
tbody.addEventListener('click', (e) => {
  const tr = e.target.parentElement;
  const all = tbody.querySelectorAll('tr');

  for (const currentTr of all) {
    if (currentTr.className === 'active') {
      currentTr.classList.remove('active');
    }
  }

  tr.classList.toggle('active');
});

// 3
const form = document.createElement('form');

form.className = 'new-employee-form';

const body = document.querySelector('body');
const data = ['name', 'position', 'office', 'age', 'salary'];

for (const i of data) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  if (i === 'office') {
    const cities = ['Tokyo', 'Singapore', 'London', 'New York',
      'Edinburgh', 'San Francisco'];

    const select = document.createElement('select');

    select.name = i;
    select.dataset.qa = i;

    label.textContent = i[0].toUpperCase() + i.slice(1) + ':';

    for (const city of cities) {
      const option = document.createElement('option');

      option.value = city;
      option.textContent = city;

      select.append(option);
    }
    select.setAttribute('required', '');

    label.append(select);
    form.append(label);
  } else {
    label.textContent = i[0].toUpperCase() + i.slice(1) + ':';
    input.name = i;
    input.type = 'text';

    if (i === 'age' || i === 'salary') {
      input.type = 'number';
    }

    input.dataset.qa = i;

    input.setAttribute('required', '');

    label.append(input);
    form.append(label);
  }
};

const button = document.createElement('button');

button.textContent = 'Save to table';
form.append(button);
body.append(form);

// 4)
const titleError = 'Error!';
const titleSuccess = 'Success';
const descriptionError = 'The employee has not been added to the table.';
const descriptionSuccess = 'The employee has been successfully'
                            + ' added to the table.';

const pushNotification = (nameClass, title, description) => {
  const newElement = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  newElement.className = `notification ${nameClass}`;
  newElement.dataset.qa = 'notification';
  h2.className = `title`;
  h2.textContent = title;
  p.textContent = description;

  newElement.append(h2, p);
  body.append(newElement);

  setTimeout(() => {
    newElement.remove();
  }, 5000);
};

button.addEventListener('click', (e) => {
  const tr = document.createElement('tr');
  const labels = document.querySelectorAll('label');
  const values = [];

  for (const input of labels) {
    const inputValue = input.childNodes[1].value;

    if (String(inputValue) === '') {
      return;
    }

    values.push(inputValue);

    if (input.childNodes[1].name === 'name' && inputValue.length < 4) {
      pushNotification('error', titleError, descriptionError);
      values.pop();

      break;
    }

    if (input.childNodes[1].name === 'age') {
      if (Number(inputValue) < 18 || Number(inputValue) > 90) {
        pushNotification('error', titleError, descriptionError);
        values.pop();
      }
    }
  }

  if (values.length === labels.length) {
    for (const input of labels) {
      const inputValue = input.childNodes[1].value;
      const td = document.createElement('td');

      if (input.childNodes[1].name === 'salary') {
        td.textContent = `$${Number(inputValue).toLocaleString('en-US')}`;
      } else {
        td.textContent = inputValue;
      }

      if (input.childNodes[1].name === 'office') {
        input.childNodes[1].value = 'Tokyo';
      } else {
        input.childNodes[1].value = '';
      }

      tr.append(td);
    }

    tbody.append(tr);

    pushNotification('success', titleSuccess, descriptionSuccess);
  }

  e.preventDefault();
});

// 5)
const tds = tbody.querySelectorAll('td');

for (let i = 0; i < tds.length; i++) {
  tds[i].addEventListener('dblclick', () => {
    const input = document.createElement('input');

    input.classList.add('.cell-input');

    input.value = tds[i].innerHTML;
    tds[i].innerHTML = '';
    tds[i].appendChild(input);
    input.focus();

    function updateValue(inputParam, startValueParam) {
      const newValue = inputParam.value;

      if (newValue === '') {
        tds[i].textContent = startValueParam;
      } else {
        tds[i].textContent = newValue;
      }
    }

    const startValue = input.value;

    input.addEventListener('blur', () => {
      updateValue(input, startValue);
    });

    input.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        updateValue(input, startValue);
      }
    });
  });
}

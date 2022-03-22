'use strict';

let secondClickName = 0;
let secondClickPosition = 0;
let secondClickOffice = 0;
let secondClickAge = 0;
let secondClickSalary = 0;
const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');
const form = document.createElement('form');
const message = document.createElement('div');
const titleOfMessage = document.createElement('h2');
const text = document.createElement('p');

const pushNotification = (title, description, type) => {
  message.className = `notification ${type}`;
  message.setAttribute('data-qa', `notification`);
  titleOfMessage.className = 'title';
  titleOfMessage.textContent = title;
  text.textContent = description;

  message.append(titleOfMessage, text);
  document.body.append(message);

  setTimeout(() => {
    message.remove();
  }, 3000);
};

const createForm = () => {
  form.setAttribute('class', 'new-employee-form');
  document.body.append(form);

  form.insertAdjacentHTML('afterbegin', `
    <label>Name: <input name="name" type="text" data-qa="name"></label>
    <label>Position:
      <input name="position" type="text" data-qa="position"></label>
    <label>Office: <select name="office" type="text" data-qa="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select></label>
    <label>Age: <input name="age" type="number" data-qa="age"></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
    <button type="button">Save to table</button>
  `);

  form.addEventListener('click', (e) => {
    if (e.target.closest('button')) {
      const newPeson = document.createElement('tr');

      for (let i = 0; i < form.length - 1; i++) {
        if (form[i].value === '') {
          message.remove();

          pushNotification('Error', 'All fields are required.', 'error');

          return;
        };

        if (form[0].value.length < 4) {
          message.remove();

          pushNotification('Error',
            'Name value has less than 4 letters', 'error');

          return;
        };

        if (form[3].value < 18 || form[3].value > 90) {
          message.remove();

          pushNotification('Error',
            'Age value is less than 18 or more than 90.', 'error');

          return;
        };

        if (i === form.length - 2) {
          const td = document.createElement('td');

          td.textContent = `$${(+form[i].value).toLocaleString('en-US')}`;

          newPeson.append(td);
        } else {
          const td = document.createElement('td');

          td.textContent = form[i].value;

          newPeson.append(td);
        };
      };

      message.remove();

      for (let i = 0; i < form.length - 1; i++) {
        if (i === 2) {
          form[i].value = `${form[2].children[0].textContent}`;
        } else {
          form[i].value = '';
        };
      };

      pushNotification('Success',
        'A new employee is successfully added to the table.', 'success');

      tbody.append(newPeson);
    };
  });
};

createForm();

thead.addEventListener('click', (e) => {
  const order = e.target;
  const newList = tbody.querySelectorAll('tr');

  if (order.textContent === 'Name') {
    if (secondClickPosition === 1
      || secondClickOffice === 1
      || secondClickAge === 1
      || secondClickSalary === 1) {
      secondClickPosition = 0;
      secondClickOffice = 0;
      secondClickAge = 0;
      secondClickSalary = 0;
    };

    const persons = [...newList];

    if (secondClickName === 0) {
      persons.sort((a, b) =>
        ((a.children[0].textContent).localeCompare(b.children[0].textContent)));

      for (const key of persons) {
        tbody.append(key);
      };

      secondClickName = 1;

      return;
    };

    if (secondClickName === 1) {
      persons.sort((a, b) =>
        ((b.children[0].textContent).localeCompare(a.children[0].textContent)));

      for (const key of persons) {
        tbody.append(key);
      };

      secondClickName = 0;

      return;
    };
  };

  if (order.textContent === 'Position') {
    if (secondClickName === 1
      || secondClickOffice === 1
      || secondClickAge === 1
      || secondClickSalary === 1) {
      secondClickName = 0;
      secondClickOffice = 0;
      secondClickAge = 0;
      secondClickSalary = 0;
    };

    const persons = [...newList];

    if (secondClickPosition === 0) {
      persons.sort((a, b) =>
        ((a.children[1].textContent).localeCompare(b.children[1].textContent)));

      for (const key of persons) {
        tbody.append(key);
      };

      secondClickPosition = 1;

      return;
    };

    if (secondClickPosition === 1) {
      persons.sort((a, b) =>
        ((b.children[1].textContent).localeCompare(a.children[1].textContent)));

      for (const key of persons) {
        tbody.append(key);
      };

      secondClickPosition = 0;

      return;
    };
  };

  if (order.textContent === 'Office') {
    if (secondClickName === 1
      || secondClickPosition === 1
      || secondClickAge === 1
      || secondClickSalary === 1) {
      secondClickName = 0;
      secondClickPosition = 0;
      secondClickAge = 0;
      secondClickSalary = 0;
    };

    const persons = [...newList];

    if (secondClickOffice === 0) {
      persons.sort((a, b) =>
        ((a.children[2].textContent).localeCompare(b.children[2].textContent)));

      for (const key of persons) {
        tbody.append(key);
      };

      secondClickOffice = 1;

      return;
    };

    if (secondClickOffice === 1) {
      persons.sort((a, b) =>
        ((b.children[2].textContent).localeCompare(a.children[2].textContent)));

      for (const key of persons) {
        tbody.append(key);
      };

      secondClickOffice = 0;

      return;
    };
  };

  if (order.textContent === 'Age') {
    if (secondClickName === 1
      || secondClickPosition === 1
      || secondClickOffice === 1
      || secondClickSalary === 1) {
      secondClickName = 0;
      secondClickPosition = 0;
      secondClickOffice = 0;
      secondClickSalary = 0;
    };

    const persons = [...newList];

    if (secondClickAge === 0) {
      persons.sort((a, b) =>
        (+(a.children[3].textContent)
    - +(b.children[3].textContent)));

      for (const key of persons) {
        tbody.append(key);
      };

      secondClickAge = 1;

      return;
    };

    if (secondClickAge === 1) {
      persons.sort((a, b) =>
        (+(b.children[3].textContent)
    - +(a.children[3].textContent)));

      for (const key of persons) {
        tbody.append(key);
      };

      secondClickAge = 0;

      return;
    };
  };

  if (order.textContent === 'Salary') {
    if (secondClickName === 1
      || secondClickPosition === 1
      || secondClickOffice === 1
      || secondClickAge === 1) {
      secondClickName = 0;
      secondClickPosition = 0;
      secondClickOffice = 0;
      secondClickAge = 0;
    };

    const persons = [...newList];

    if (secondClickSalary === 0) {
      persons.sort((a, b) =>
        (+a.children[4].textContent.slice(1).replace(/,/g, ''))
    - (+b.children[4].textContent.slice(1).replace(/,/g, '')));

      for (const key of persons) {
        tbody.append(key);
      };

      secondClickSalary = 1;

      return;
    };

    if (secondClickSalary === 1) {
      persons.sort((a, b) =>
        (+b.children[4].textContent.slice(1).replace(/,/g, ''))
    - (+a.children[4].textContent.slice(1).replace(/,/g, '')));

      for (const key of persons) {
        tbody.append(key);
      };

      secondClickSalary = 0;

      return;
    };
  };
});

tbody.addEventListener('click', (e) => {
  const newList = tbody.querySelectorAll('tr');

  for (let i = 0; i < newList.length; i++) {
    newList[i].className = '';
  };

  if (e.target.closest('tr')) {
    e.target.closest('tr').className = 'active';
  };
});

tbody.addEventListener('dblclick', (e) => {
  const dbl = e.target;

  const style = getComputedStyle(dbl);
  const copyName = dbl.textContent;

  if (dbl === dbl.parentElement.children[2]) {
    dbl.textContent = '';

    dbl.insertAdjacentHTML('afterbegin', `
    <select class ="cell-input" style ="width: ${style.width}">
      <option value ="Tokyo">Tokyo</option>
      <option value ="Singapore">Singapore</option>
      <option value ="London">London</option>
      <option value ="New York">New York</option>
      <option value ="Edinburgh">Edinburgh</option>
      <option value ="San Francisco">San Francisco</option>
    </select>`);

    const options = document.querySelector('select');

    for (const key of options) {
      if (key.textContent === copyName) {
        key.setAttribute('selected', `true`);
      };
    };

    options.focus();
  } else {
    const newInput = document.createElement('input');

    newInput.className = 'cell-input';
    newInput.setAttribute('style', `width: ${style.width}`);
    newInput.value = dbl.textContent;
    newInput.setAttribute('type', `text`);

    dbl.textContent = '';
    dbl.append(newInput);

    newInput.focus();
  };

  let isHandled = false;

  dbl.children[0].addEventListener('keydown', (ev) => {
    const input = ev.target;

    if (ev.code === 'Enter' || ev.code === 'Tab') {
      isHandled = true;

      if (input.value === '') {
        dbl.textContent = copyName;

        pushNotification('Error',
          'Empty input value', 'error');

        return;
      };

      if (ev.target.parentElement === dbl.parentElement.children[0]) {
        if (input.value.length < 4) {
          dbl.textContent = copyName;

          pushNotification('Error',
            'Name value has less than 4 letters', 'error');

          return;
        };
      };

      if (ev.target.parentElement === dbl.parentElement.children[3]) {
        if (+input.value < 18 || +input.value > 90 || !isFinite(input.value)) {
          dbl.textContent = copyName;

          pushNotification('Error',
            'Age value is incorrect or less than 18 and more than 90.',
            'error');

          return;
        };
      };

      if (ev.target.parentElement === dbl.parentElement.children[4]) {
        for (let i = 0; i < input.value.length; i++) {
          if (!isFinite(+input.value[i])) {
            dbl.textContent = copyName;

            pushNotification('Error',
              'Salary value is incorrect.', 'error');

            return;
          } else {
            dbl.textContent = `$${(+input.value).toLocaleString('en-US')}`;

            return;
          };
        };
      };

      dbl.textContent = input.value;
    };
  });

  dbl.children[0].addEventListener('blur', (eve) => {
    const input = eve.target;

    if (isHandled === true) {
      return;
    };

    if (input.value === '') {
      dbl.textContent = copyName;

      pushNotification('Error',
        'Empty input value', 'error');

      return;
    };

    if (eve.target.parentElement === dbl.parentElement.children[0]) {
      if (input.value.length < 4) {
        dbl.textContent = copyName;

        pushNotification('Error',
          'Name value has less than 4 letters', 'error');

        return;
      };
    };

    if (eve.target.parentElement === dbl.parentElement.children[3]) {
      if (+input.value < 18 || +input.value > 90 || !isFinite(input.value)) {
        dbl.textContent = copyName;

        pushNotification('Error',
          'Age value is incorrect or less than 18 and more than 90.',
          'error');

        return;
      };
    };

    if (eve.target.parentElement === dbl.parentElement.children[4]) {
      for (let i = 0; i < input.value.length; i++) {
        if (!isFinite(+input.value[i])) {
          dbl.textContent = copyName;

          pushNotification('Error',
            'Salary value is incorrect.', 'error');

          return;
        } else {
          dbl.textContent = `$${(+input.value).toLocaleString('en-US')}`;

          return;
        };
      };
    };

    dbl.textContent = input.value;
  });
});

'use strict';

const trHead = document.querySelector('thead tr');
const tBody = document.querySelector('tbody');
const form = document.createElement('form');
const body = document.querySelector('body');
const button = document.createElement('button');

const sortedASC = {
  title: '',
  switcher: false,
};

const firstTimeHeppendSorting = (objTitle, type) =>
  objTitle === '' || objTitle !== type;
const secondTimeHeppendSorting = (objTitle, type, objSwitcher) =>
  objTitle === type && !objSwitcher;

form.addEventListener('submit', (e) => {
  const tr = document.createElement('tr');

  e.preventDefault();

  const formData = new FormData(form);
  const clearInputsFields = [...e.target.querySelectorAll('input')];
  const [userNameValue, , ageValue] = clearInputsFields;

  if (!/[a-zA-Z]{4,}/.test(userNameValue.value)) {
    const notification = document.createElement('p');
    const success = document.querySelector('.success');

    if (success) {
      success.remove();
    }

    notification.textContent = '';

    notification.setAttribute('data-qa', 'notification');
    notification.setAttribute('class', 'error');

    notification.textContent = 'The should be consist of at list 4 letters';
    notification.style.position = 'absolute';
    notification.style.top = 20 + 'px';
    notification.style.right = 20 + 'px';
    notification.style.backgroundColor = 'red';

    body.append(notification);
    clearInputsFields.forEach((el) => (el.value = ''));
  }

  if (ageValue.value < 18 || ageValue.value > 90) {
    const notification = document.createElement('p');
    const success = document.querySelector('.success');

    if (success) {
      success.remove();
    }

    notification.textContent = '';

    notification.setAttribute('data-qa', 'notification');
    notification.setAttribute('class', 'error');

    notification.textContent =
      'The Age should be not less than 18 and not bigger than 90';
    notification.style.position = 'absolute';
    notification.style.top = 40 + 'px';
    notification.style.right = 20 + 'px';
    notification.style.backgroundColor = 'red';

    body.append(notification);
    clearInputsFields.forEach((el) => (el.value = ''));
  }

  if (
    (/[a-zA-Z]{4,}/.test(userNameValue.value) && ageValue.value >= 18) ||
    (/[a-zA-Z]{4,}/.test(userNameValue.value) && ageValue.value <= 90)
  ) {
    const notification = document.createElement('p');
    const removeErorClass = document.querySelectorAll('.error');

    if (removeErorClass) {
      removeErorClass.forEach((el) => el.remove());
    }

    notification.setAttribute('data-qa', 'notification');

    for (const [typeName, value] of formData.entries()) {
      const td = document.createElement('td');

      if (typeName === 'Salary') {
        td.textContent = `$${Number(value).toLocaleString()}`;
      } else {
        td.textContent = value;
      }

      tr.append(td);
    }

    notification.setAttribute('class', 'success');
    notification.textContent = 'Success';
    notification.style.position = 'absolute';
    notification.style.top = 20 + 'px';
    notification.style.right = 20 + 'px';
    notification.style.color = 'green';
    body.append(notification);
  }

  tBody.append(tr);
  clearInputsFields.forEach((el) => (el.value = ''));
});

trHead.addEventListener('click', (e) => {
  const title = e.target.innerText;
  const trList = [...document.querySelectorAll('tbody tr')];

  switch (title) {
    case 'Name':
    case 'Position':
    case 'Office':
      const titleIndex = [...trHead.children].findIndex(
        (el) => el.innerText === title,
      );

      if (firstTimeHeppendSorting(sortedASC.title, title)) {
        sortedASC.title = title;
        sortedASC.switcher = false;
      }

      if (
        secondTimeHeppendSorting(sortedASC.title, title, sortedASC.switcher)
      ) {
        trList.sort((a, b) => {
          return a.children[titleIndex].innerText.localeCompare(
            b.children[titleIndex].innerText,
          );
        });

        sortedASC.switcher = !sortedASC.switcher;
      } else {
        trList.sort((a, b) => {
          return b.children[titleIndex].innerText.localeCompare(
            a.children[titleIndex].innerText,
          );
        });

        sortedASC.switcher = !sortedASC.switcher;
      }

      break;

    case 'Age':
      if (firstTimeHeppendSorting(sortedASC.title, title)) {
        sortedASC.title = title;
        sortedASC.switcher = false;
      }

      if (
        secondTimeHeppendSorting(sortedASC.title, title, sortedASC.switcher)
      ) {
        trList.sort((a, b) => {
          return (
            Number(a.children[3].innerText) - Number(b.children[3].innerText)
          );
        });

        sortedASC.switcher = !sortedASC.switcher;
      } else {
        trList.sort((a, b) => {
          return (
            Number(b.children[3].innerText) - Number(a.children[3].innerText)
          );
        });

        sortedASC.switcher = !sortedASC.switcher;
      }

      break;

    case 'Salary':
      if (firstTimeHeppendSorting(sortedASC.title, title)) {
        sortedASC.title = title;
        sortedASC.switcher = false;
      }

      if (
        secondTimeHeppendSorting(sortedASC.title, title, sortedASC.switcher)
      ) {
        trList.sort((a, b) => {
          return (
            Number(a.children[4].innerText.replace(/[$,]/g, '')) -
            Number(b.children[4].innerText.replace(/[$,]/g, ''))
          );
        });

        sortedASC.switcher = !sortedASC.switcher;
      } else {
        trList.sort((a, b) => {
          return (
            Number(b.children[4].innerText.replace(/[$,]/g, '')) -
            Number(a.children[4].innerText.replace(/[$,]/g, ''))
          );
        });

        sortedASC.switcher = !sortedASC.switcher;
      }
  }

  trList.forEach((el) => tBody.append(el));
});

tBody.addEventListener('click', (e) => {
  [...tBody.querySelectorAll('tr')].forEach((el) => {
    if (el === e.target.parentNode && !el.querySelector('.active')) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
});

form.method = 'POST';
form.action = '#';

button.textContent = 'Save to table';
button.setAttribute('type', 'submit');

const options = [
  { value: 'Tokyo', text: 'Tokyo' },
  { value: 'Singapore', text: 'Singapore' },
  { value: 'London', text: 'London' },
  { value: 'New York', text: 'New York' },
  { value: 'Edinbirgh', text: 'EdinBurgh' },
  { value: 'San Francisko', text: 'San Francisko' },
];

const inputData = [
  {
    type: 'text',
    name: 'Name',
    data__qa: 'name',
    label: 'Name',
  },
  {
    type: 'text',
    name: 'Position',
    data__qa: 'position',
    label: 'Position',
  },
  {
    name: 'Office',
    data__qa: 'office',
    label: 'Office',
    tag: 'selected',
  },
  {
    type: 'number',
    name: 'Age',
    data__qa: 'age',
    label: 'Age',
  },
  {
    type: 'number',
    name: 'Salary',
    data__qa: 'salary',
    label: 'Salary',
  },
];

const inputPattern = (data) => {
  data.forEach((el) => {
    const input = document.createElement('input');
    const label = document.createElement('label');
    const selectTag = document.createElement('select');

    if (el.tag) {
      selectTag.setAttribute('name', el.name);
      selectTag.setAttribute('data-qa', el.data__qa);
      selectTag.setAttribute('required', true);
      label.textContent = `${el.label}:`;
      label.append(selectTag);

      options.forEach((optionEl) => {
        const option = document.createElement('option');

        option.value = optionEl.value;
        option.textContent = optionEl.text;
        selectTag.append(option);
      });
    } else {
      input.setAttribute('type', el.type);
      input.setAttribute('name', el.name);
      input.setAttribute('data-qa', el.data__qa);
      input.setAttribute('required', true);
      label.textContent = `${el.label}:`;
      label.append(input);
    }

    form.append(label);
  });
};

inputPattern(inputData);

form.setAttribute('class', 'new-employee-form');
form.append(button);

body.append(form);

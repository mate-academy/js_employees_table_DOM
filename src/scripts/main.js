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
  const showNotification = (typeError, color, selectedErrMess, topPx) => {
    const notification = document.createElement('p');
    const warningMes = [
      'The should be consist of at list 4 letters',
      'The should be consist of at list 2 letters',
      'The Age should be not less than 18 and not bigger than 90',
      'Success',
    ];

    notification.setAttribute('data-qa', 'notification');
    notification.setAttribute('class', typeError);

    notification.textContent = warningMes[selectedErrMess];
    notification.style.position = 'absolute';
    notification.style.top = topPx + 'px';
    notification.style.right = 20 + 'px';
    notification.style.backgroundColor = color;

    body.append(notification);
  };

  body.querySelectorAll('p').forEach((el) => el.remove());

  e.preventDefault();

  const formData = new FormData(form);
  const clearInputsFields = [...e.target.querySelectorAll('input')];
  const [userNameValue, position, ageValue] = clearInputsFields;

  if (!/[a-zA-Z]{4,}/.test(userNameValue.value)) {
    showNotification('error', 'red', 0, 20);
  }

  if (!/^[a-zA-Z\s]{2,}$/.test(position.value)) {
    showNotification('error', 'red', 1, 40);
  }

  if (ageValue.value < 18 || ageValue.value > 90) {
    showNotification('error', 'red', 2, 60);
  }

  if (
    /[a-zA-Z]{4,}/.test(userNameValue.value) &&
    Number(ageValue.value) >= 18 &&
    Number(ageValue.value) <= 90 &&
    /^[a-zA-Z\s]{2,}$/.test(position.value)
  ) {
    for (const [typeName, value] of formData.entries()) {
      const td = document.createElement('td');

      if (typeName === 'Salary') {
        td.textContent = `$${Number(value).toLocaleString()}`;
      } else {
        td.textContent = value;
      }

      tr.append(td);
      tBody.append(tr);
    }

    showNotification('success', 'green', 3, 20);
  }

  form.reset();
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

button.textContent = 'Save to table';
button.setAttribute('type', 'submit');

const options = [
  { value: 'Tokyo', text: 'Tokyo' },
  { value: 'Singapore', text: 'Singapore' },
  { value: 'London', text: 'London' },
  { value: 'New York', text: 'New York' },
  { value: 'Edinburgh', text: 'EdinBurgh' },
  { value: 'San Francisco', text: 'San Francisco' },
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

form.method = 'POST';
form.action = '#';
form.setAttribute('class', 'new-employee-form');
form.append(button);

body.append(form);

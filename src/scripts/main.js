'use strict';

const form = document.createElement('form');
let newEmployy = [];

function createForm() {
  const formField = [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'position',
      type: 'text',
    },
    {
      name: 'age',
      type: 'number',
    },
    {
      name: 'salary',
      type: 'number',
    },
  ];

  const selectValues = ['Tokyo', 'Singapore',
    'London', 'New York', 'Edinburgh', 'San Francisco'];

  form.className = 'new-employee-form';

  form.innerHTML = formField.map(field => `
    <label>
      ${field.name[0].toUpperCase() + field.name.slice(1)}:
        <input
          name="${field.name}"
          type="${field.type}"
          data-qa="${field.name}"
        >
    </label>
  `).join('');

  form.querySelector('[name="age"]').setAttribute('min', 18);
  form.querySelector('[name="age"]').setAttribute('max', 90);

  document.querySelector('table').insertAdjacentElement('afterend', form);

  form.children[1].insertAdjacentHTML('afterend', `
    <label>Office:
      <select name="office" data-qa="office">
      <option value="" disabled selected>
        ${selectValues.map(value => `
        <option value="${value}">
          ${value}
        </option>`).join('')}
      </select>
    </label>
  `);

  form.insertAdjacentHTML('beforeend', `
    <button type="submit">
      Save to table
    </button>
  `);
}
createForm();

[...document.querySelectorAll('thead tr th')].forEach((element, index) => {
  element.addEventListener('click', (e) => {
    if (!element.hasAttribute('direction')
      || element.getAttribute('direction') === 'DESC') {
      element.setAttribute('direction', 'ASC');
    } else {
      element.setAttribute('direction', 'DESC');
    }

    const rows = document.querySelectorAll('tbody tr');

    const sortedRows = [...rows].sort((a, b) => {
      let compareA = a.querySelectorAll('td')[index].innerText;
      let compareB = b.querySelectorAll('td')[index].innerText;

      if (element.getAttribute('direction') === 'DESC') {
        compareA = b.querySelectorAll('td')[index].innerText;
        compareB = a.querySelectorAll('td')[index].innerText;
      }

      if (e.target.innerText === 'Salary') {
        return compareA.slice(1).split(',').join('.')
          - compareB.slice(1).split(',').join('.');
      }

      if (typeof (compareA) === 'string') {
        return compareA.localeCompare(compareB);
      }

      return compareA - compareB;
    });

    document.querySelector('tbody').replaceChildren(...rows, ...sortedRows);
  });
});

[...document.querySelectorAll('tbody tr')].forEach(element => {
  element.addEventListener('click', (e) => {
    const activeElement = document.getElementsByClassName('active')[0];

    if (activeElement) {
      activeElement.classList.remove('active');
    }

    e.target.closest('tr').classList.add('active');
  });
});

function pushNotification(title, type) {
  const messageWindow = document.createElement('div');

  messageWindow.classList.add('notification', type);
  messageWindow.setAttribute('data-qa', 'notification');

  messageWindow.innerHTML = `
    <h2 class="title">${title}</h2>
  `;

  form.append(messageWindow);

  setTimeout(() => {
    messageWindow.remove();
  }, 2000);
};

function valideData() {
  if (newEmployy.includes('')) {
    pushNotification('All fields must be filled', 'warning');
  } else {
    const fName = form.querySelector('[name="name"]');
    const fAge = form.querySelector('[name="age"]');

    if (fName.value.length < 4) {
      pushNotification('Name minimum length is 4', 'error');
      fName.focus();

      return false;
    } else if (fAge.value.includes(',') || fAge.value.includes('.')) {
      pushNotification('Just an integer', 'error');
      fAge.focus();

      return false;
    } else if (fAge.value > 90 || fAge.value < 18) {
      pushNotification('Age value is less than 18 or more than 90', 'error');
      fAge.focus();

      return false;
    } else {
      pushNotification('New employee is successfully', 'success');

      return true;
    }
  }
}

const button = document.querySelector('button');

button.addEventListener('click', (evt) => {
  evt.preventDefault();

  newEmployy = [...form.querySelectorAll('label')].map(person => {
    return person.children[0].value;
  });

  valideData();

  if (valideData() === true) {
    const newPerson = document.createElement('tr');

    newEmployy[4] = '$' + (Math.round(newEmployy[4] * 1000) / 1000)
      .toFixed(3).toString().replace('.', ',');
    form.reset();

    newPerson.innerHTML = newEmployy.map(el => `<td>${el}</td>`).join('');

    document.querySelector('tbody')
      .insertAdjacentElement('beforeend', newPerson);

    newPerson.addEventListener('click', (e) => {
      const activeElement = document.getElementsByClassName('active')[0];

      if (activeElement) {
        activeElement.classList.remove('active');
      }

      e.target.closest('tr').classList.add('active');
    });
  }
});

let targetData;

[...document.querySelectorAll('td')].forEach(element => {
  element.addEventListener('dblclick', (evt) => {
    targetData = evt.target;

    const newData = document.createElement('td');
    const inputField = document.createElement('input');

    inputField.classList.add('cell-input');
    newData.insertAdjacentElement('afterbegin', inputField);
    targetData.parentNode.replaceChild(newData, targetData);

    newData.children[0].addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        if (e.target.value.length > 0) {
          newData.innerHTML = newData.children[0].value;
        } else {
          newData.innerHTML = targetData.innerText;
        }
      }
    });

    // newData.children[0].addEventListener('blur', (e) => {
    //   if (newData.children[0].value > 0) {
    //     newData.innerHTML = newData.children[0].value;
    //   } else {
    //     newData.innerHTML = targetData.innerText;
    //   }
    // });
  });
});

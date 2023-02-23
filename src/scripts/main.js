'use strict';

const thead = document.body.querySelector('thead');
const titles = [ ...thead.querySelectorAll('th') ];
const tbody = document.body.querySelector('tbody');

thead.addEventListener('click', (e) => {
  const people = [ ...tbody.rows ];
  const index = e.target.cellIndex;

  titles.forEach(title => {
    if (title.classList.contains('sorted-ASC') && title !== e.target) {
      title.classList.remove('sorted-ASC');
    }
  });

  e.target.classList.toggle('sorted-ASC');

  people.sort((a, b) => {
    const aText = a.cells[index].textContent;
    const bText = b.cells[index].textContent;

    if (e.target.textContent === 'Age') {
      if (e.target.classList.contains('sorted-ASC')) {
        return Number(aText) - Number(bText);
      } else {
        return Number(bText) - Number(aText);
      }
    }

    if (e.target.textContent === 'Salary') {
      const aSalary = Number(aText.replace(/[$,]/g, ''));
      const bSalary = Number(bText.replace(/[$,]/g, ''));

      if (e.target.classList.contains('sorted-ASC')) {
        return aSalary - bSalary;
      } else {
        return bSalary - aSalary;
      }
    } else {
      if (e.target.classList.contains('sorted-ASC')) {
        return aText.localeCompare(bText);
      } else {
        return bText.localeCompare(aText);
      }
    }
  });

  people.forEach(person => tbody.append(person));
});

// // #2

tbody.addEventListener('click', (e) => {
  const people = [ ...tbody.rows ];

  people.forEach(person => {
    person.classList.remove('active');
  });
  e.target.parentElement.classList.add('active');
});

// // #3

const form = document.createElement('form');

titles.forEach(title => {
  const label = document.createElement('label');
  const titleName = title.textContent.toLowerCase();

  label.textContent = `${title.textContent}: `;

  if (title.textContent === 'Office') {
    const selectCity = document.createElement('select');
    const cityOptions = ['Tokyo', 'Singapore', 'London',
      'New York', 'Edinburgh', 'San Francisco'];

    cityOptions.forEach(city => {
      const option = document.createElement('option');

      option.textContent = city;
      selectCity.append(option);
    });

    selectCity.name = titleName;
    selectCity.dataset.qa = titleName;
    label.append(selectCity);
  } else {
    const input = document.createElement('input');

    if (title.textContent === 'Age' || title.textContent === 'Salary') {
      input.type = 'number';
    } else {
      input.type = 'text';
    }

    input.name = titleName;
    input.dataset.qa = titleName;
    label.append(input);
  }

  form.append(label);
});

form.classList.add('new-employee-form');
document.body.append(form);

// #4

const submitButton = document.createElement('button');

submitButton.textContent = 'Save to table';
submitButton.type = 'submit';
form.append(submitButton);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (form.querySelector('.notif')) {
    form.querySelector('.notif').remove();
  }

  const data = new FormData(form);
  const dataObj = Object.fromEntries(data.entries());
  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.classList.add('notif');

  if (dataObj.name.length < 4) {
    notification.classList.add('error');
    notification.textContent = '"Name" value should have more than 4 letters';
  } else if (Number(dataObj.age) < 18 || Number(dataObj.age) > 90) {
    notification.classList.add('error');
    notification.textContent = '"Age" value is not valid';
  } else {
    const row = document.createElement('tr');
    const usFormatter = new Intl.NumberFormat('en-US');

    dataObj.salary = `$${usFormatter.format(dataObj.salary)}`;

    const values = Object.values(dataObj);

    values.forEach(value => {
      const cell = document.createElement('td');

      cell.textContent = value;
      row.append(cell);
    });

    tbody.append(row);
    notification.classList.add('success');
    notification.textContent = 'Employee is successfully added';
  }

  form.append(notification);
});

// #5

tbody.addEventListener('dblclick', (e) => {
  const text = e.target.textContent;

  e.target.textContent = '';

  const input = document.createElement('input');

  input.classList.add('.cell-input');
  input.value = text;
  e.target.append(input);
  input.focus();

  input.addEventListener('blur', (ev) => {
    if (input.value.length === 0) {
      e.target.textContent = text;
    } else {
      e.target.textContent = input.value;
    }
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      if (input.value.length === 0) {
        e.target.textContent = text;
      } else {
        e.target.textContent = input.value;
      }
    }
  });
});

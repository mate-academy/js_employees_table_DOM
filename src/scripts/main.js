'use strict';

const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');
const titles = thead.querySelectorAll('th');

// #region Sort
thead.addEventListener('click', (evnt) => {
  titles.forEach((title) => {
    if (title.classList.contains('asc') && title !== evnt.target) {
      title.classList.remove('asc');
    }
  });

  evnt.target.classList.toggle('asc');

  const index = evnt.target.cellIndex;
  const sorted = [...tbody.rows].sort((a, b) => {
    let cellA = a.cells[index].innerHTML;
    let cellB = b.cells[index].innerHTML;

    if (index === 4) {
      cellA = +cellA.slice(1).replace(',', '');
      cellB = +cellB.slice(1).replace(',', '');

      if (evnt.target.classList.contains('asc')) {
        return cellA - cellB;
      } else {
        return cellB - cellA;
      }
    }

    if (index === 3) {
      if (evnt.target.classList.contains('asc')) {
        return cellA - cellB;
      } else {
        return cellB - cellA;
      }
    }

    if (evnt.target.classList.contains('asc')) {
      return cellA.localeCompare(cellB);
    } else {
      return cellB.localeCompare(cellA);
    }
  });

  tbody.innerHTML = '';

  sorted.forEach((row) => {
    tbody.append(row);
  });
});
// #endregion

// #region Select
tbody.addEventListener('click', (evnt) => {
  [...tbody.rows].forEach((person) => {
    person.classList.remove('active');
  });

  evnt.target.parentElement.classList.add('active');
});
// #endregion

// #region Form
const form = document.createElement('form');

titles.forEach((title) => {
  const label = document.createElement('label');
  const titleName = title.textContent.toLowerCase();

  label.textContent = title.textContent;

  if (title.textContent === 'Office') {
    const selectCity = document.createElement('select');
    const cityList = [
      `Tokyo`,
      `Singapore`,
      `London`,
      `New York`,
      `Edinburgh`,
      `San Francisco`,
    ];

    cityList.forEach((city) => {
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
// #endregion

// #region submitButton
const submitButton = document.createElement('button');

submitButton.textContent = 'Save to table';
form.append(submitButton);

submitButton.addEventListener('click', (evnt) => {
  evnt.preventDefault();

  const data = new FormData(form);
  const dataObj = Object.fromEntries(data.entries());

  if (dataObj.name.length < 4) {
    showNotification('error', 'Name value should have more than 4 letters');
  } else if (+dataObj.age < 18 || +dataObj.age > 90) {
    showNotification(
      'error',
      'Age value is not valid. Employee must be an adult'
    );
  } else if (dataObj.salary < 0) {
    showNotification(
      'error',
      'Salary value is not valid. It must be more than zero'
    );
  } else if (!dataObj.position || !dataObj.salary) {
    showNotification('error', 'All fields are required');
  } else {
    showNotification('success', 'Employee is successfully added');

    const newRow = document.createElement('tr');

    dataObj.salary = '$' + Number(dataObj.salary).toLocaleString('en-US');

    const values = Object.values(dataObj);

    values.forEach((value) => {
      const cell = document.createElement('td');

      cell.textContent = value;
      newRow.append(cell);
    });

    tbody.append(newRow);

    form.querySelectorAll('input').forEach((field) => {
      field.value = '';
    });
  }
});
// #endregion

// #region Notification
const showNotification = (type, description) => {
  const message = document.createElement('div');
  const title = document.createElement('h2');
  const desc = document.createElement('p');

  message.classList.add('notification', type);
  message.dataset.qa = 'notification';

  title.innerText = type.toUpperCase();
  desc.innerText = description;

  message.append(title, desc);
  document.querySelector('body').append(message);

  setTimeout(() => {
    message.remove();
  }, 3000);
};
// #endregion

// #region Edit by double-clicking
tbody.addEventListener('dblclick', (evnt) => {
  const text = evnt.target.textContent;
  const index = evnt.target.cellIndex;

  evnt.target.textContent = '';

  let input = document.createElement('input');

  input.classList.add('.cell-input');

  if (index === 2) {
    const selectCity = document.createElement('select');
    const cityList = [
      `Tokyo`,
      `Singapore`,
      `London`,
      `New York`,
      `Edinburgh`,
      `San Francisco`,
    ];

    cityList.forEach((option) => {
      const city = document.createElement('option');

      city.textContent = option;
      selectCity.append(city);
    });
    input = selectCity;
  }

  evnt.target.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    switch (index) {
      case 0:
        if (input.value.length < 4) {
          showNotification(
            'error',
            'Name value should have more than 4 letters'
          );
          evnt.target.textContent = text;
        } else {
          evnt.target.textContent = input.value;
        }
        break;

      case 1:
        if (input.value) {
          evnt.target.textContent = input.value;
        } else {
          showNotification('error', 'All fields are required');
          evnt.target.textContent = text;
        }
        break;

      case 2:
        if (input.value) {
          evnt.target.textContent = input.value;
        } else {
          evnt.target.textContent = text;
        }
        break;

      case 3:
        if (input.value < 18 || input.value > 90) {
          showNotification(
            'error',
            'Age value is not valid. Employee must be an adult'
          );

          evnt.target.textContent = text;
        } else {
          evnt.target.textContent = input.value;
        }
        break;

      case 4:
        if (input.value && input.value > 0) {
          evnt.target.textContent
            = '$' + Number(input.value).toLocaleString('en-US');
        } else {
          showNotification(
            'error',
            'Salary value is not valid. It must be more than zero'
          );
          evnt.target.textContent = text;
        }
        break;
    }
    input.remove();
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      input.blur();
    }
  });
});
// #endregion

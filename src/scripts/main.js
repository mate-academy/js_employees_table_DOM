'use strict';

const table = document.querySelector('table');
const thead = table.querySelector('thead');
const headerElements = thead.querySelectorAll('th');
const tbody = table.querySelector('tbody');
let bodyRows = Array.from(tbody.querySelectorAll('tr'));
let actualValue = '';

headerElements.forEach((headerElement) => {
  headerElement.addEventListener('click', () => {
    const clickValue = headerElement.textContent;

    if (clickValue === 'Name') {
      if (actualValue !== 'Name') {
        bodyRows.sort((person1, person2) => {
          return person1.cells[0].textContent.localeCompare(
            person2.cells[0].textContent,
          );
        });
        actualValue = 'Name';
      } else if (actualValue === 'Name') {
        bodyRows.sort((person1, person2) => {
          return person2.cells[0].textContent.localeCompare(
            person1.cells[0].textContent,
          );
        });
        actualValue = '';
      }
      tbody.innerHTML = '';
      bodyRows.forEach((row) => tbody.appendChild(row));
    }

    if (clickValue === 'Position') {
      if (actualValue !== 'Position') {
        bodyRows.sort((person1, person2) => {
          return person1.cells[1].textContent.localeCompare(
            person2.cells[1].textContent,
          );
        });
        actualValue = 'Position';
      } else if (actualValue === 'Position') {
        bodyRows.sort((person1, person2) => {
          return person2.cells[1].textContent.localeCompare(
            person1.cells[1].textContent,
          );
        });
        actualValue = '';
      }
      tbody.innerHTML = '';
      bodyRows.forEach((row) => tbody.appendChild(row));
    }

    if (clickValue === 'Office') {
      if (actualValue !== 'Office') {
        bodyRows.sort((person1, person2) => {
          return person1.cells[2].textContent.localeCompare(
            person2.cells[2].textContent,
          );
        });

        actualValue = 'Office';
      } else if (actualValue === 'Office') {
        bodyRows.sort((person1, person2) => {
          return person2.cells[2].textContent.localeCompare(
            person1.cells[2].textContent,
          );
        });

        actualValue = '';
      }

      tbody.innerHTML = '';
      bodyRows.forEach((row) => tbody.appendChild(row));
    }

    if (clickValue === 'Age') {
      if (actualValue !== 'Age') {
        bodyRows.sort((person1, person2) => {
          return (
            Number(person1.cells[3].textContent) -
            Number(person2.cells[3].textContent)
          );
        });
        actualValue = 'Age';
      } else if (actualValue === 'Age') {
        bodyRows.sort((person1, person2) => {
          return (
            Number(person2.cells[3].textContent) -
            Number(person1.cells[3].textContent)
          );
        });
        actualValue = '';
      }
      tbody.innerHTML = '';
      bodyRows.forEach((person) => tbody.appendChild(person));
    }

    if (clickValue === 'Salary') {
      if (actualValue !== 'Salary') {
        bodyRows.sort((person1, person2) => {
          return (
            Number(person1.cells[4].textContent.replace(/\$|,/g, '')) -
            Number(person2.cells[4].textContent.replace(/\$|,/g, ''))
          );
        });

        actualValue = 'Salary';
      } else if (actualValue === 'Salary') {
        bodyRows.sort((person1, person2) => {
          return (
            Number(person2.cells[4].textContent.replace(/\$|,/g, '')) -
            Number(person1.cells[4].textContent.replace(/\$|,/g, ''))
          );
        });

        actualValue = '';
      }

      tbody.innerHTML = '';
      bodyRows.forEach((row) => tbody.appendChild(row));
    }
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('td')) {
    bodyRows.forEach((row) => {
      row.classList.remove('active');
    });
  }
});

function addRowToTable(row) {
  tbody.appendChild(row);
  bodyRows = Array.from(tbody.querySelectorAll('tr'));

  row.addEventListener('click', () => {
    bodyRows.forEach((elem) => {
      elem.classList.remove('active');
    });
    row.classList.add('active');
  });
}

bodyRows.forEach((row) => {
  row.addEventListener('click', () => {
    bodyRows.forEach((elem) => {
      elem.classList.remove('active');
    });
    row.classList.add('active');
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
form.setAttribute('action', '#');
document.body.append(form);
form.addEventListener('submit', (e) => e.preventDefault());

const nameLabel = document.createElement('label');

nameLabel.htmlFor = 'name';
nameLabel.innerHTML = `Name: <input id="name" name="name" type="text" data-qa="name" required">`;

const positionLabel = document.createElement('label');

positionLabel.htmlFor = 'position';
positionLabel.innerHTML = `Position: <input id="position" name="position" type="text" data-qa="position" required>`;

const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const officeLabel = document.createElement('label');

officeLabel.innerHTML = `Office: `;
officeLabel.htmlFor = 'office';

const officeSelect = document.createElement('select');

officeSelect.id = 'office';
officeSelect.name = 'office';
officeSelect.dataset.qa = 'office';
officeLabel.appendChild(officeSelect);

cities.forEach((city) => {
  officeSelect.innerHTML += `<option value="${city}">${city}</option>`;
});

const ageLabel = document.createElement('label');

ageLabel.htmlFor = 'age';
ageLabel.innerHTML = `Age: <input id="age" name="age" type="number" data-qa="age" required>`;

const salaryLabel = document.createElement('label');

salaryLabel.htmlFor = 'salary';
salaryLabel.innerHTML = `Salary: <input id="salary" name="salary" type="number" data-qa="salary" required>`;

const buttonForm = document.createElement('button');

buttonForm.textContent = 'Save to table';

form.append(
  nameLabel,
  positionLabel,
  officeLabel,
  ageLabel,
  salaryLabel,
  buttonForm,
);

const pushNotification = (posTop, posRight, title, description, type) => {
  const div = document.createElement('div');

  div.classList.add('notification', type);
  div.dataset.qa = 'notification';
  document.body.appendChild(div);

  div.style.top = `${posTop}px`;
  div.style.right = `${posRight}px`;

  const h2 = document.createElement('h2');

  h2.classList.add('title');
  h2.textContent = title;

  const p = document.createElement('p');

  p.textContent = description;
  div.appendChild(h2);
  div.appendChild(p);

  setTimeout(() => (div.hidden = !div.hidden), 2000);
};

buttonForm.addEventListener('click', () => {
  const nameValue = nameLabel.children[0].value.trim();
  const ageValue = ageLabel.children[0].value;

  if (nameValue.length < 4) {
    pushNotification(
      10,
      10,
      "Correct the employee's name",
      'It must be at least 4 characters long',
      'error',
    );
  } else if (ageValue < 18 || ageValue > 90) {
    pushNotification(
      10,
      10,
      "Correct the employee's age",
      'Only allowed from 18 to 90 years of age',
      'error',
    );
  } else {
    const newRow = document.createElement('tr');

    for (let i = 0; i < 5; i++) {
      const newCell = document.createElement('td');

      newRow.appendChild(newCell);
    }

    const arrayTd = Array.from(newRow.children);

    arrayTd[0].textContent = nameLabel.children[0].value;
    arrayTd[1].textContent = positionLabel.children[0].value;
    arrayTd[2].textContent = officeLabel.children[0].value;
    arrayTd[3].textContent = ageLabel.children[0].value;

    arrayTd[4].textContent =
      '$' +
      (salaryLabel.children[0].value / 1000).toFixed(3).replace(/\./g, ',');

    addRowToTable(newRow);
    form.reset();

    pushNotification(
      10,
      10,
      'Employee successfully added',
      'All data entered correctly',
      'success',
    );
  }
});

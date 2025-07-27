'use strict';

const pushNotification = (posTop, posRight, title, description, type) => {
  // write code here
  const notification = document.createElement('div');
  const titleEl = document.createElement('h2');
  const descrEl = document.createElement('p');

  titleEl.innerText = title;
  descrEl.innerText = description;

  notification.classList.add('notification', `${type}`);
  notification.setAttribute('data-qa', 'notification');

  notification.style.transition = 'all 0.5s ease-in-out';
  titleEl.classList.add('title');
  notification.append(titleEl, descrEl);

  if (document.body.contains(document.querySelector('.notification'))) {
    const lll = document.querySelectorAll('.notification').length;

    document.body.append(notification);
    notification.style.top = `${posTop + 130 * lll}px`;
    notification.style.right = `${posRight}px`;
  } else {
    document.body.append(notification);
    notification.style.top = `${posTop}px`;
    notification.style.right = `${posRight}px`;
  }

  setTimeout(() => {
    notification.style.opacity = 0;
    notification.style.transform = 'translate(0, -20px)';
  }, 2000);
  setTimeout(() => notification.remove(), 2500);
};

const table = document.querySelector('tbody');
const rows = [...table.children];
const cells = rows.reduce((empt, a) => [...empt, ...a.children], []);
const headers = document.querySelectorAll('th');
const head = document.querySelector('thead');

// turning salary into #s
const toNum = (x) => Number(x.split(',').join('').slice(1));
// formatting salary from form
const toSal = (x) => {
  const salary = x.split('');

  for (let i = salary.length - 3; i > 0; i -= 3) {
    salary.splice(i, 0, ',');
  }
  salary.unshift('$');

  return salary.join('');
};
// sorting function for rows
const sorting = (line, type) => {
  switch (line) {
    case 'Name': {
      rows.sort((a, b) => {
        return a.children[0].innerText.localeCompare(b.children[0].innerText);
      });
      break;
    }

    case 'Position': {
      rows.sort((a, b) => {
        return a.children[1].innerText.localeCompare(b.children[1].innerText);
      });
      break;
    }

    case 'Office': {
      rows.sort((a, b) => {
        return a.children[2].innerText.localeCompare(b.children[2].innerText);
      });
      break;
    }

    case 'Age': {
      rows.sort((a, b) => {
        return +a.children[3].innerText - +b.children[3].innerText;
      });
      break;
    }

    case 'Salary': {
      rows.sort((a, b) => {
        return toNum(a.children[4].innerText) - toNum(b.children[4].innerText);
      });
      break;
    }
  }

  switch (type) {
    case 'ASC': {
      table.append(...rows);
      break;
    }

    case 'DSC': {
      table.append(...rows.reverse());
      break;
    }
  }
};

// adding sorting
for (const i of headers) {
  i.addEventListener('click', () => {
    if (head.className.includes(`${i.innerText}-ASC`)) {
      sorting(i.innerText, 'DSC');
      head.className = `${i.innerText}-DSC`;
    } else if (head.className.includes(`${i.innerText}-DSC`)) {
      sorting(i.innerText, 'ASC');
      head.className = `${i.innerText}-ASC`;
    } else {
      sorting(i.innerText, 'ASC');
      head.className = `${i.innerText}-ASC`;
    }
  });
}

// adding selecting rows
for (const i of rows) {
  i.addEventListener('click', () => {
    if (rows.some((a) => a.classList.contains('active'))) {
      rows
        .find((a) => a.classList.contains('active'))
        .classList.remove('active');

      i.classList.add('active');
    } else {
      i.classList.add('active');
    }
  });
}

const form = document.createElement('form');
const select = document.createElement('select');
const button = document.createElement('button');

document.body.append(form);
form.classList.add('new-employee-form');

button.innerText += 'Save to table';

form.append(
  document.createElement('label'),
  document.createElement('label'),
  document.createElement('label'),
  document.createElement('label'),
  document.createElement('label'),
  button,
);

const inputName = document.createElement('input');
const inputPosition = document.createElement('input');
const inputAge = document.createElement('input');
const inputSalary = document.createElement('input');
const cities = [
  'Select a city',
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const inputs = [inputName, inputPosition, inputAge, inputSalary, select];

inputs.forEach((a) => (a.required = true));

inputName.name = 'name';
inputName.type = 'text';
inputName.setAttribute('data-qa', 'name');

inputPosition.name = 'position';
inputPosition.type = 'text';
inputPosition.setAttribute('data-qa', 'position');

select.name = 'office';
select.setAttribute('data-qa', 'office');

inputAge.name = 'age';
inputAge.type = 'number';
inputAge.setAttribute('data-qa', 'age');

inputSalary.name = 'salary';
inputSalary.type = 'number';
inputSalary.setAttribute('data-qa', 'salary');

select.append(
  document.createElement('option'),
  document.createElement('option'),
  document.createElement('option'),
  document.createElement('option'),
  document.createElement('option'),
  document.createElement('option'),
  document.createElement('option'),
);

for (const i of select.children) {
  i.value = cities[0];
  i.innerText = cities[0];
  cities.shift();

  if (i.innerText.includes('Select')) {
    i.disabled = true;
  }
}

const labels = document.querySelectorAll('label');

labels[0].append('Name:', inputName);
labels[1].append('Position:', inputPosition);
labels[2].append('Office:', select);
labels[3].append('Age:', inputAge);
labels[4].append('Salary:', inputSalary);

form.addEventListener('submit', (x) => {
  x.preventDefault();
});

button.addEventListener('click', () => {
  if (
    inputs.some((a) => a.value.length < 1) ||
    select.value.includes('Select')
  ) {
    pushNotification(
      150,
      10,
      'Fields are empty',
      'Fill out all required fields.',
      'error',
    );
  } else if (inputName.value.length < 4) {
    pushNotification(
      150,
      10,
      'Name is too short',
      'Name should be longer then 4 letters.',
      'error',
    );
  } else if (inputAge.value < 18 || inputAge.value > 90) {
    pushNotification(
      150,
      10,
      'Age field is wrong',
      'Age should be between 18 & 90 years.',
      'error',
    );
  } else {
    const newRow = rows[0].cloneNode(true);

    newRow.children[0].innerText = inputName.value.trim();
    newRow.children[1].innerText = inputPosition.value.trim();
    newRow.children[2].innerText = select.value.trim();
    newRow.children[3].innerText = inputAge.value.trim();
    newRow.children[4].innerText = toSal(inputSalary.value.trim());

    table.prepend(newRow);

    pushNotification(
      150,
      10,
      'Success!',
      'Added a new person to the table',
      'success',
    );
  }
});

for (const i of cells) {
  i.addEventListener('dblclick', () => {
    const cellInput = document.createElement('input');
    const text = i.innerText;

    cellInput.style.width = `${i.clientWidth - 36}px`;

    setTimeout(() => {
      cellInput.focus();
    }, 0);

    cellInput.addEventListener('blur', () => {
      if (document.querySelector('.cell-input').value.length > 0) {
        i.innerText = document.querySelector('.cell-input').value;
      } else {
        i.innerText = text;
      }
    });

    cellInput.addEventListener('keypress', (press) => {
      if (press.key === 'Enter') {
        if (document.querySelector('.cell-input').value.length > 0) {
          i.innerText = document.querySelector('.cell-input').value;
        } else {
          i.innerText = text;
        }
      }
    });

    cellInput.className = 'cell-input';
    i.innerHTML = '';
    i.append(cellInput);
  });
}

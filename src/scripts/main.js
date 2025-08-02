'use strict';

const table = document.querySelector('table');
const titleList = table.querySelectorAll('th');
const tbody = table.tBodies[0];

function createLabeledInput(labelText, id, type = 'text') {
  const label = document.createElement('label');
  const input = document.createElement('input');

  input.setAttribute('id', id);
  input.setAttribute('type', type);
  input.setAttribute('name', id);
  input.setAttribute('data-qa', id);

  label.setAttribute('for', id);
  label.textContent = `${labelText}: `;
  label.appendChild(input);

  return label;
}

const pushNotification = (posTop, posRight, title, description, type) => {
  const message = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  h2.textContent = title;
  h2.classList.add('title');
  p.textContent = description;
  message.appendChild(h2);
  message.appendChild(p);
  message.classList.add('notification', type);
  message.setAttribute('data-qa', 'notification');

  message.style.position = 'fixed';
  message.style.top = posTop + 'px';
  message.style.right = posRight + 'px';

  document.body.appendChild(message);

  setTimeout(() => {
    message.style.display = 'none';
  }, 2000);
};

tbody.addEventListener('click', (ev) => {
  const clickedRow = ev.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((row) => row.classList.remove('active'));

  clickedRow.classList.add('active');
});

titleList.forEach((title) => {
  title.addEventListener('click', (ev) => {
    const indexOfTitle = title.cellIndex;
    const [...rows] = tbody.querySelectorAll('tr');

    const currentSort = title.getAttribute('data-sort');
    const newSort = currentSort === 'asc' ? 'desc' : 'asc';

    titleList.forEach((th) => th.removeAttribute('data-sort'));

    title.setAttribute('data-sort', newSort);
    rows.forEach((r) => r.classList.remove('active'));

    rows.sort((a, b) => {
      const aText = a.children[indexOfTitle].textContent;
      const bText = b.children[indexOfTitle].textContent;

      let result;

      if (indexOfTitle === 3 || indexOfTitle === 4) {
        const aNum = Number(aText.replace(/[^0-9]/g, ''));
        const bNum = Number(bText.replace(/[^0-9]/g, ''));

        result = aNum - bNum;
      } else {
        result = aText.localeCompare(bText);
      }

      return result;
    });

    if (newSort === 'desc') {
      rows.reverse();
    }

    tbody.innerHTML = '';
    rows.forEach((row) => tbody.appendChild(row));
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.appendChild(createLabeledInput('Name', 'name'));

form.appendChild(createLabeledInput('Position', 'position'));

const select = document.createElement('select');

select.setAttribute('data-qa', 'office');
select.setAttribute('id', 'office');
select.setAttribute('name', 'office');

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

offices.forEach((city) => {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;
  select.appendChild(option);
});

const labelOffice = document.createElement('label');

labelOffice.setAttribute('for', 'office');
labelOffice.textContent = 'Office: ';
labelOffice.appendChild(select);
form.appendChild(labelOffice);

form.appendChild(createLabeledInput('Age', 'age'));

form.appendChild(createLabeledInput('Salary', 'salary'));

const button = document.createElement('button');

button.textContent = 'Save to table';
button.setAttribute('type', 'submit');
form.appendChild(button);

document.body.append(form);

form.addEventListener('submit', (ev) => {
  ev.preventDefault();

  let isValid = true;

  const name = form.elements.name.value;
  const position = form.elements.position.value;
  const age = form.elements.age.value;
  const salary = form.elements.salary.value;
  const office = form.elements.office.value;

  if (name.length < 4) {
    isValid = false;
  }

  if (+age < 18 || +age > 90 || isNaN(+age)) {
    isValid = false;
  }

  if (isValid === true) {
    const newRow = document.createElement('tr');

    [name, position, office, age, salary].forEach((value) => {
      const td = document.createElement('td');

      td.textContent = value;
      newRow.appendChild(td);
    });

    tbody.appendChild(newRow);

    pushNotification(10, 20, 'Title of Success message', 'Success.', 'success');
  } else {
    pushNotification(
      10,
      20,
      'Title of Error message',
      'Error enter valid information.',
      'error',
    );
  }
});

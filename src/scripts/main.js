'use strict';

const form = document.createElement('form');

form.className = 'new-employee-form';

form.insertAdjacentHTML('beforeend', `
<label>
Name:
<input name="name" type="text" data-qa="name" minlength="4">
</label>
<label>
Position:
<input name="position" type="text" data-qa="position">
</label>
<label for="office">
Office:
<select id="office" name="office" data-qa="office">
<option value="Tokyo">Tokio</option>
<option value="Singapore">Singapore</option>
<option value="London">London</option>
<option value="New York">New York</option>
<option value="Edinburgh">Edinburgh</option>
<option value="San Francisco">San Francisco</option>
</select>
</label>
<label>
Age:
<input name="age" type="number" data-qa="age">
</label>
<label>Salary: <input name="salary" type="number" data-qa="salary"></label>
<button type="submit">Save to table</button>
`);

document.body.append(form);

const pushNotification = (title, description, type) => {
  const element = document.querySelector('body');
  const notifications = document.createElement('div');

  notifications.className = `notification` + ` ${type}`;
  notifications.setAttribute('data-qa', 'notification');

  notifications.insertAdjacentHTML('afterbegin', `
  <h2>${title}</h2>
  <p>${description}</p>
  `);

  element.append(notifications);

  setTimeout(() => {
    notifications.style.display = 'none';
  }, 1999);
};

const headNames = document.querySelector('thead');
let [...positionList] = document.querySelectorAll('tr');
let newPosition = positionList.slice(1, -1);
const button = document.querySelector('button');

button.addEventListener('click', (e) => {
  e.preventDefault();

  const names = document.querySelector("input[data-qa='name']").value;
  const position = document.querySelector("input[data-qa='position']").value;
  const office = document.querySelector('select').value;
  const age = document.querySelector("input[data-qa='age']").value;
  const salary = document.querySelector("input[data-qa='salary']").value;

  for (let i = 0; i < form.elements.length - 1; i++) {
    if (form.elements[i].value.length === 0) {
      pushNotification('Error message',
        'All form fields must be completed.', 'error');

      return;
    }
  }

  if (names.length < 4) {
    pushNotification('Warning message',
      '"Name" should have minimum 4 symbols.', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification('Warning message',
      '"Age" is less than 18 or more than 90.', 'error');

    return;
  }

  const line = document.createElement('tr');

  line.insertAdjacentHTML('afterbegin', `
    <td>${names}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${Math.floor(salary / 1000)},${salary.slice(-3)}</td>
  `);

  const list = document.querySelector('tbody');

  list.append(line);

  pushNotification('Success message',
    'Сongratulations. You have successfully added an employee.', 'success');

  form.reset();

  [...positionList] = document.querySelectorAll('tr');
  newPosition = positionList.slice(1, -1);
});

const clickBoolean = {
  name: true,
  position: true,
  office: true,
  age: true,
  salary: true,
};

function sortNames(people) {
  if (clickBoolean.name) {
    people.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    people.sort((a, b) => b.name.localeCompare(a.name));
  }
}

function sortPosition(people) {
  if (clickBoolean.position) {
    people.sort((a, b) => a.position.localeCompare(b.position));
  } else {
    people.sort((a, b) => b.position.localeCompare(a.position));
  }
}

function sortOffice(people) {
  if (clickBoolean.office) {
    people.sort((a, b) => a.office.localeCompare(b.office));
  } else {
    people.sort((a, b) => b.office.localeCompare(a.office));
  }
}

function sortAge(people) {
  if (clickBoolean.age) {
    people.sort((a, b) => a.age - b.age);
  } else {
    people.sort((a, b) => b.age - a.age);
  }
}

function sortSalary(people) {
  if (clickBoolean.salary) {
    people.sort((a, b) => {
      const aSalary = a.salary.slice(1).split(',').join('');
      const bSalary = b.salary.slice(1).split(',').join('');

      return aSalary - bSalary;
    });
  } else {
    people.sort((a, b) => {
      const aSalary = a.salary.slice(1).split(',').join('');
      const bSalary = b.salary.slice(1).split(',').join('');

      return bSalary - aSalary;
    });
  }
}

function employeesList(list) {
  const array = [];

  for (let i = 0; i < list.length; i++) {
    const [...item] = list[i].querySelectorAll('td');
    const human = {};

    human.name = item[0].textContent;
    human.position = item[1].textContent;
    human.office = item[2].textContent;
    human.age = +item[3].textContent;
    human.salary = item[4].textContent;

    array.push(human);
  }

  return array;
}

headNames.addEventListener('click', (e) => {
  const headName = e.target.textContent.toLowerCase();
  const people = employeesList(newPosition);

  switch (headName) {
    case 'name':
      sortNames(people);
      break;

    case 'position':
      sortPosition(people);
      break;

    case 'office':
      sortOffice(people);
      break;

    case 'age':
      sortAge(people);
      break;

    case 'salary':
      sortSalary(people);
      break;
  }

  for (const key in clickBoolean) {
    if (key === headName) {
      clickBoolean[key] = !clickBoolean[key];
    } else {
      clickBoolean[key] = true;
    }
  }

  for (let k = 0; k < newPosition.length; k++) {
    const [...items] = newPosition[k].querySelectorAll('td');

    items[0].textContent = people[k].name;
    items[1].textContent = people[k].position;
    items[2].textContent = people[k].office;
    items[3].textContent = people[k].age;
    items[4].textContent = people[k].salary;
  }
});

const tbody = document.querySelector('tbody');

tbody.addEventListener('click', (e) => {
  const tag = e.target.parentElement.tagName.toLowerCase();

  newPosition.forEach(element => {
    if (element.classList.contains('active')) {
      element.classList.remove('active');
    }
  });

  if (tag === 'tr') {
    e.target.parentElement.className = 'active';
  }
});

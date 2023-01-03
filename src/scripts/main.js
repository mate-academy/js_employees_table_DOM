'use strict';

const tableBody = document.querySelector('tbody');
const head = document.querySelector('thead');
const listTd = document.querySelectorAll('td');
const button = document.createElement('button');
const form = document.createElement('form');

form.classList.add('new-employee-form');
button.innerText = 'Save to table';

let textElement = '';

const people = [];
let selectObj = {};
const strings = ['name', 'position', 'office'];
const numbers = ['age', 'salary'];
const city = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];
const objectValid = {
  name: '',
  position: '',
  office: city[0],
  age: '',
  salary: '',
};

const pushNotification = (posTop, posRight, title, description, type) => {
  const wrapper = document.createElement('div');
  const elementTitle = document.createElement('h2');
  const elementMessage = document.createElement('p');

  wrapper.style.top = `${posTop}px`;
  wrapper.style.right = `${posRight}px`;
  wrapper.classList = 'notification ' + type;

  elementTitle.classList = 'title';

  elementTitle.innerHTML = title;
  elementMessage.innerHTML = description;

  wrapper.append(elementTitle);
  wrapper.append(elementMessage);

  wrapper.setAttribute('data-qa', 'notification');

  setTimeout(() => {
    document.querySelector('body').append(wrapper);
  }, 500);

  setTimeout(() => {
    wrapper.remove();
  }, 4000);
};

const getNumber = (string) => {
  return +string.replace('$', '').replace(',', '');
};

const CreateObjectsByContent = () => {
  people.splice(0, people.length);

  for (let i = 0; i < tableBody.children.length; i++) {
    const [namePerson, position, office, age, salary] = tableBody
      .children[i].children;

    people.push({
      name: namePerson.innerText,
      position: position.innerText,
      office: office.innerText,
      age: age.innerText,
      salary: getNumber(salary.innerText),
    });
  }
};

const setClick = (list) => {
  list.forEach(element => {
    element.addEventListener('click', (e) => {
      if (!textElement) {
        textElement = e.target.innerText;
      }

      if (document.querySelector('.active')) {
        document.querySelector('.active').classList.remove('active');
      }

      element.classList.add('active');

      const [namePerson, position, office, age, salary] = element.children;

      selectObj = {
        name: namePerson.innerText,
        position: position.innerText,
        office: office.innerText,
        age: age.innerText,
        salary: getNumber(salary.innerText),
      };
    });
  });
};

const createTr = () => {
  const text = document.querySelector('.cell-input').value;
  const td = document.querySelector('.cell-input').parentElement;

  document.querySelector('.cell-input').parentElement.innerHTML = '';
  td.innerText = !text ? textElement : text;
  CreateObjectsByContent();
};

const setDobleClick = (list) => {
  for (let i = 0; i < list.length; i++) {
    list[i].addEventListener('dblclick', (e) => {
      const input = document.createElement('input');

      lostFocus(input);

      if (document.querySelector('.cell-input')) {
        createTr();
      }

      input.value = e.target.innerText;
      input.classList.add('cell-input');
      e.target.innerHTML = '';
      e.target.appendChild(input);
    });
  }
};

const setKeyboard = (list) => {
  for (let i = 0; i < list.length; i++) {
    list[i].addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && e.target.value !== '') {
        createTr();
      } else if (e.key === 'Enter') {
        const td = document.querySelector('.cell-input').parentElement;

        document.querySelector('.cell-input').parentElement.innerHTML = '';
        td.innerText = textElement;
        textElement = '';
      }
    });
  }
};

const lostFocus = (element) => {
  element.addEventListener('blur', (e) => {
    createTr();
  });
};

const functionFoSort = (sortKey, flag) => {
  return (a, b) => {
    const firstElement = a[sortKey];
    const secondElement = b[sortKey];

    if (flag === 'ASC') {
      if (strings.includes(sortKey)) {
        return firstElement.localeCompare(secondElement);
      }

      if (numbers.includes(sortKey)) {
        return firstElement - secondElement;
      }
    } else {
      if (strings.includes(sortKey)) {
        return secondElement.localeCompare(firstElement);
      }

      if (numbers.includes(sortKey)) {
        return secondElement - firstElement;
      }
    };
  };
};

head.addEventListener('click', (e) => {
  tableBody.innerHTML = '';

  if (!e.target.getAttribute('flag')
      || e.target.getAttribute('flag') === 'DESC') {
    e.target.setAttribute('flag', 'ASC');
  } else {
    e.target.setAttribute('flag', 'DESC');
  }

  people.sort(functionFoSort(
    e.target.innerText.toLowerCase(),
    e.target.getAttribute('flag')));

  people.forEach(person => {
    tableBody.insertAdjacentHTML('beforeend',
      `<tr
          ${JSON.stringify(person) === JSON.stringify(selectObj)
    ? 'class="active"'
    : ''}
        >
            <td>${person.name}</td>
            <td>${person.position}</td>
            <td>${person.office}</td>
            <td>${person.age}</td>
            <td>$${(person.salary)
    .toLocaleString('en')
    .replaceAll('.', ',')}</td>
        </tr>`);
  });

  setClick(tableBody.querySelectorAll('tr'));
  setDobleClick(document.querySelectorAll('td'));
  setKeyboard(document.querySelectorAll('td'));
});

setClick(tableBody.querySelectorAll('tr'));

const createLabel = (index) => {
  const input = document.createElement('input');
  const label = document.createElement('label');
  const select = document.createElement('select');
  const text = head.querySelector('tr').children[index].innerText.toLowerCase();

  for (let q = 0; q < city.length; q++) {
    const option = document.createElement('option');

    option.innerText = city[q];
    select.appendChild(option);
  }

  index > 2 && index <= 4 ? input.type = 'number' : input.type = 'text';

  input.required = true;

  input.setAttribute('data-qa', text);
  select.setAttribute('data-qa', text);

  input.addEventListener('change', (e) => {
    objectValid[text] = e.target.value;
  });

  select.addEventListener('change', (e) => {
    objectValid[text] = e.target.value;
  });

  index === 2 ? label.appendChild(select) : label.appendChild(input);

  label.insertAdjacentHTML(
    'afterbegin',
    `${head.querySelector('tr').children[index].innerText}:`);

  return label;
};

for (let i = 0; i < head.querySelector('tr').children.length; i++) {
  form.appendChild(createLabel(i));
}

button.addEventListener('click', (e) => {
  e.preventDefault();

  if (objectValid.name.length < 4) {
    pushNotification(10, 10, 'Error',
      'Name could be more than 4 latters', 'error');

    return;
  }

  if (!objectValid.position) {
    pushNotification(10, 10, 'Error',
      'Position could not be empty', 'error');

    return;
  }

  if (+objectValid.age < 18 || +objectValid.age > 90 || !objectValid.age) {
    pushNotification(10, 10, 'Error',
      'Age could not less thab 18 or more than 90', 'error');

    return;
  }

  if (!objectValid.salary) {
    pushNotification(10, 10, 'Error',
      'Salary could not empty', 'error');

    return;
  }

  tableBody.insertAdjacentHTML('beforeend',
    `<tr>
            <td>${objectValid.name}</td>
            <td>${objectValid.position}</td>
            <td>${objectValid.office}</td>
            <td>${objectValid.age}</td>
            <td>
              $${(+objectValid.salary)
    .toLocaleString('en')
    .replaceAll('.', ',')}
            </td>
        </tr>`);
  objectValid.salary = +objectValid.salary;
  people.push(objectValid);
  setClick(tableBody.querySelectorAll('tr'));
  setDobleClick(document.querySelectorAll('td'));
  setKeyboard(document.querySelectorAll('td'));

  pushNotification(10, 10, 'Success',
    'Employeer was to add', 'success');
});

form.appendChild(button);

setDobleClick(listTd);
setKeyboard(listTd);
CreateObjectsByContent();

document.querySelector('body').append(form);

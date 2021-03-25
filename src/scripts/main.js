'use strict';

// write code here
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const arrChildren = [...tbody.children];
let sortBy = '';

thead.addEventListener('click', (e) => {
  switch (e.target.innerText) {
    case 'Name':
      if (sortBy === 'Name') {
        const arrName = arrChildren.reverse();

        sortBy = '';
        tbody.append(...arrName);
      } else {
        const arrName = arrChildren.sort((a, b) => {
          return a.children[0].innerText.localeCompare(b.children[0].innerText);
        });

        sortBy = 'Name';
        tbody.append(...arrName);
      }
      break;
    case 'Position':
      if (sortBy === 'Position') {
        const arrPos = arrChildren.reverse();

        sortBy = '';
        tbody.append(...arrPos);
      } else {
        const arrPos = arrChildren.sort((a, b) => {
          return a.children[1].innerText.localeCompare(b.children[1].innerText);
        });

        sortBy = 'Position';
        tbody.append(...arrPos);
      }
      break;
    case 'Office':
      if (sortBy === 'Office') {
        const arrOff = arrChildren.reverse();

        sortBy = '';
        tbody.append(...arrOff);
      } else {
        const arrOff = arrChildren.sort((a, b) => {
          return a.children[2].innerText.localeCompare(b.children[2].innerText);
        });

        sortBy = 'Office';
        tbody.append(...arrOff);
      }
      break;
    case 'Age':

      if (sortBy === 'Age') {
        const arrAge = arrChildren.reverse();

        sortBy = '';
        tbody.append(...arrAge);
      } else {
        const arrAge = arrChildren.sort((a, b) => {
          return a.children[3].innerText.localeCompare(b.children[3].innerText);
        });

        sortBy = 'Age';
        tbody.append(...arrAge);
      }
      break;
    case 'Salary':
      if (sortBy === 'Salary') {
        const arrSal = arrChildren.reverse();

        sortBy = '';
        tbody.append(...arrSal);
      } else {
        const arrSal = arrChildren.sort((a, b) => {
          const salaryA = +a.children[4].innerText.replace(/[$,]/g, '');
          const salaryB = +b.children[4].innerText.replace(/[$,]/g, '');

          return salaryA - salaryB;
        });

        sortBy = 'Salary';
        tbody.append(...arrSal);
      }
      break;
  }
});

tbody.addEventListener('click', (e) => {
  for (const tr of tbody.children) {
    if (tr.classList.contains('active')) {
      tr.classList.remove('active');
    }
    e.target.parentElement.className = 'active';
  }
});

const body = document.querySelector('body');

function createAddEmployeeForm(container) {
  const form = document.createElement('form');

  form.className = 'new-employee-form';
  form.action = '/';
  form.method = 'GET';
  container.append(form);

  const arrayLabelsForm = [];

  const labelName = document.createElement('label');

  labelName.innerText = 'Name: ';

  const labelPos = document.createElement('label');

  labelPos.innerText = 'Position: ';

  const labelOffice = document.createElement('label');

  labelOffice.innerText = 'Office: ';

  const labelAge = document.createElement('label');

  labelAge.innerText = 'Age: ';

  const labelSalary = document.createElement('label');

  labelSalary.innerText = 'Salary: ';

  arrayLabelsForm.push(labelName, labelPos, labelOffice, labelAge, labelSalary);

  const correctArrayLabelsForm = arrayLabelsForm.map((label) => {
    const text = label.innerText.toLowerCase();
    const inputLabel = document.createElement('input');
    const selectLabel = document.createElement('select');

    if (text !== 'office: ') {
      inputLabel.name = text.replace(/: /g, '');

      if (inputLabel.name === 'salary' || inputLabel.name === 'age') {
        inputLabel.type = 'number';
      } else {
        inputLabel.type = 'text';
      }
      inputLabel.dataset.qa = inputLabel.name;
      label.append(inputLabel);
    } else {
      selectLabel.className = 'select';
      selectLabel.dataset.qa = 'office';
      label.append(selectLabel);
    }

    return label;
  });

  for (const label of correctArrayLabelsForm) {
    form.append(label);
  }

  const arrayOffices = [
    'Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'];

  const selectOffice = document.querySelector('.select');

  for (const office of arrayOffices) {
    const option = document.createElement('option');

    option.value = office;
    option.innerText = office;

    selectOffice.append(option);
  }

  const button = document.createElement('button');

  button.innerText = 'Save to table';
  button.type = 'submit';
  form.append(button);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const newTr = document.createElement('tr');
    const inputs = document.querySelectorAll('input');
    const tdOff = document.createElement('td');

    tdOff.innerText = selectOffice.value;

    for (let i = 0; i < inputs.length; i++) {
      const td = document.createElement('td');

      if (inputs[i].dataset.qa === 'salary') {
        td.innerText = `$${inputs[i].value
          .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
      } else {
        td.innerText = inputs[i].value;
      }
      tbody.append(newTr);
      inputs[i].value = '';
      newTr.append(td);
    }
    newTr.insertBefore(tdOff, newTr.children[2]);

    if (newTr.firstChild.innerText.length < 4) {
      pushNotification('Title of Error message', 'error', body);
      newTr.remove();
    } else if (newTr.children[3].innerText < 18
      || newTr.children[3].innerText >= 90) {
      pushNotification('Title of Error message', 'error', body);
      newTr.remove();
    } else if (newTr.children[1].innerText === '') {
      pushNotification('Title of Error message', 'error', body);
      newTr.remove();
    } else {
      pushNotification('Title of Success message', 'success', body);
    }
  });
}

const pushNotification = (title, type, container) => {
  const div = document.createElement('div');

  div.className = 'notification';
  div.dataset.qa = 'notification';
  div.classList.add(type);
  container.append(div);

  const h2 = document.createElement('h2');

  h2.className = 'title';
  h2.textContent = title;
  div.append(h2);
};

createAddEmployeeForm(body);

'use strict';
drawNewEmployeerForm();

const tHead = document.querySelector('table thead');
const tBody = document.querySelector('table tbody');

tHead.addEventListener('click', e => {
  function sortElements(arrOfElements, i, isNum = false) {
    if (isNum) {
      return arrOfElements.sort((a, b) =>
        a.children[i].innerText.replace(/[^\d]/g, '')
        - b.children[i].innerText.replace(/[^\d]/g, ''));
    };

    return arrOfElements.sort(
      (a, b) =>
        a.children[i].innerText.localeCompare(b.children[i].innerText)
    );
  }

  function reverseSortElements(arrOfElements, i, isNum = false) {
    if (isNum) {
      return arrOfElements.sort((a, b) =>
        b.children[i].innerText.replace(/[^\d]/g, '')
        - a.children[i].innerText.replace(/[^\d]/g, ''));
    };

    return arrOfElements.sort(
      (a, b) =>
        b.children[i].innerText.localeCompare(a.children[i].innerText)
    );
  }

  const allTr = [...document.querySelectorAll('tbody tr')];
  const item = e.target;

  const allTh = [...document.querySelectorAll(
    'table thead tr th'
  )].map(category => category.innerText);

  const index = allTh.findIndex(a => a === item.innerText);

  const sortedElemsArr = [];

  switch (item.innerText) {
    case 'Name' :

      if (item.dataset.sorted === 'true') {
        reverseSortElements(allTr, index).forEach(a => tBody.append(a));
        item.removeAttribute('data-sorted');
        break;
      }
      item.dataset.sorted = 'true';

      sortElements(allTr, index).forEach(a => tBody.append(a));
      break;

    case 'Position' :

      if (item.dataset.sorted === 'true') {
        reverseSortElements(allTr, index).forEach(a => tBody.append(a));
        item.removeAttribute('data-sorted');
        break;
      }
      item.dataset.sorted = 'true';

      sortElements(allTr, index).forEach(a => tBody.append(a));
      break;

    case 'Office' :

      if (item.dataset.sorted === 'true') {
        reverseSortElements(allTr, index).forEach(a => tBody.append(a));
        item.removeAttribute('data-sorted');
        break;
      }
      item.dataset.sorted = 'true';

      sortElements(allTr, index).forEach(a => tBody.append(a));
      break;

    case 'Salary' :

      if (item.dataset.sorted === 'true') {
        reverseSortElements(allTr, index, true).forEach(a => tBody.append(a));
        item.removeAttribute('data-sorted');
        break;
      }
      item.dataset.sorted = 'true';

      sortElements(allTr, index, true).forEach(a => tBody.append(a));
      break;

    case 'Age' :

      if (item.dataset.sorted === 'true') {
        reverseSortElements(allTr, index, true).forEach(a => tBody.append(a));
        item.removeAttribute('data-sorted');
        break;
      }
      item.dataset.sorted = 'true';

      sortElements(allTr, index, true).forEach(a => tBody.append(a));
      break;
  };

  [...document.querySelectorAll(
    'table thead tr th'
  )].forEach(isSorted => {
    if (isSorted.dataset.sorted === 'true') {
      sortedElemsArr.push(isSorted);
    };
  });

  if (sortedElemsArr.length > 1) {
    [...document.querySelectorAll(
      'table thead tr th'
    )].forEach(el => {
      el.dataset.sorted = 'false';
    });
  }
});

tBody.addEventListener('click', e => {
  const item = e.target;

  [...tBody.children].forEach(a => {
    a.removeAttribute('class');
  });

  item.parentNode.className = 'active';
});

tBody.addEventListener('dblclick', e => {
  const item = e.target;
  const initialText = item.innerText;

  [...document.querySelectorAll('tbody tr td')].forEach(attr => {
    attr.removeAttribute('contentEditable');
    attr.removeAttribute('style');
  });

  item.style.cssText = `
  user-select: none;
  border: none;
  overflow: auto;
  outline: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
`;

  item.addEventListener('blur', handler => {
    handler.target.innerText = initialText;
  });

  item.addEventListener('keydown', a => {
    if (a.code === 'Enter') {
      if (a.target.innerText === '') {
        a.target.innerText = initialText;
      }
      item.removeAttribute('contentEditable');
      item.removeAttribute('style');
    }
  });

  item.setAttribute('contentEditable', '');
  item.focus();
});

function drawNewEmployeerForm() {
  const employeeForm = `
    <form method="post" class="new-employee-form">
      <label for="name">
        Name:
        <input required name="name" data-qa="name" type="text">
      </label>

      <label for="position">
        Position:
        <input required name="position" data-qa="position" type="text">
      </label>

      <label for="office">
        Office:
        <select name="office" data-qa="office" type="text">
          <option>Tokyo</option>
          <option>Singapore</option>
          <option>London</option>
          <option>New York</option>
          <option>Edinburgh</option>
          <option>San Francisco</option>
        </select>
      </label>

      <label for="age">
        Age:
        <input required name="age" data-qa="age" type="number">
      </label>

      <label for="salary">
        Salary:
        <input name="salary" data-qa="salary" type="number">
      </label>

      <button type="submit" id="sendForm">Save to table</button>
    </form>
  `;

  document.querySelector('body').insertAdjacentHTML('beforeend', employeeForm);
}

const sendFormButton = document.querySelector('#sendForm');
const formForNewEmployee = document.querySelector('.new-employee-form');

[...document.querySelectorAll('input')].forEach(a => {
  a.addEventListener('input', function() {
    this.value = this.value[0].toUpperCase() + this.value.slice(1);
  });
});

formForNewEmployee.addEventListener('click', e => {
  e.preventDefault();

  const container = document.createElement('div');

  const pushNotification = (posTop, posRight, title, description, type) => {
    const body = document.querySelector('body');
    const message = document.createElement('div');
    const h2 = document.createElement('h2');
    const p = document.createElement('p');

    h2.innerHTML = title;
    h2.className = 'title';

    p.innerHTML = description;

    message.className = 'notification';
    container.setAttribute('data-qa', 'notification');
    message.classList.add(type);
    message.append(h2);
    message.append(p);
    message.style.right = posRight + 'px';
    message.style.top = posTop + 'px';
    container.append(message);

    body.append(container);
  };

  const item = e.target;

  if (item !== sendFormButton) {
    return;
  }

  const data = new FormData(formForNewEmployee);
  const inputs = [...document.querySelectorAll('input')];

  document.querySelector('option').setAttribute('selected', '');

  document.querySelector('option').removeAttribute('selected');

  const arrForValidation = [];

  inputs.map(valid => {
    if (valid.value === '') {
      arrForValidation.push(valid.getAttribute('name'));
    }
  });

  if (arrForValidation.length > 0) {
    pushNotification(10, 10, 'Error',
      `Invalid form. Please fill ${arrForValidation[0]}`, 'error');

    setTimeout(() => {
      container.remove();
    }, 2000);

    return;
  }

  if (data.get(
    'name').length < 4 || data.get('age') < 18 || data.get('age') > 90
  ) {
    container.className = 'error';

    if (data.get('name').length < 4) {
      pushNotification(10, 10, 'Error',
        `Invalid form. Name must have more then 3 letter`, 'error');

      setTimeout(() => {
        container.remove();
      }, 2000);

      return;
    }

    pushNotification(10, 10, 'Error',
      `Invalid form. You age must be more then 18 or less 90`, 'error');

    setTimeout(() => {
      container.remove();
    }, 2000);

    return;
  }

  const salaryNum = +data.get('salary');

  const result = `
    <tr style="">
      <td>${data.get('name')}</td>
      <td>${data.get('position')}</td>
      <td>${data.get('office')}</td>
      <td>${data.get('age')}</td>
      <td>$${salaryNum.toLocaleString('en-US')}</td>
    </tr>
  `;

  tBody.insertAdjacentHTML('beforeend', result);

  pushNotification(10, 10, 'Success! You added a new employeer into table',
    `Congratulation! You added a new employeer! `, 'success');

  inputs.forEach(value => {
    value.value = '';
  });
  container.className = 'success';

  setTimeout(() => {
    container.remove();
  }, 2000);
});

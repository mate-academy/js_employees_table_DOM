'use strict';

// write code here
const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification');
  notification.classList.add(type);

  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';

  const titleH = document.createElement('h2');

  titleH.classList.add('title');
  titleH.textContent = title;
  notification.append(titleH);

  const desc = document.createElement('p');

  desc.classList.add('description');
  desc.textContent = description;
  notification.append(desc);

  document.body.append(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
};
const table = document.querySelector('table');
const tableHeads = document.querySelectorAll('table th');
const rows = document.querySelectorAll('table tbody tr');
const tbody = document.querySelector('tbody');
const arrayHeads = [...tableHeads];
const arrayRows = [...rows];
let counterOfClicks = 0;
let lastClickedColumn = -1;

function sorterOfRows(lines, index) {
  if (counterOfClicks % 2 === 0) {
    if (index === 0 || index === 1 || index === 2) {
      lines.sort((a, b) => {
        const textA = a.children[index].textContent;
        const textB = b.children[index].textContent;

        return textA.localeCompare(textB);
      });
    } else if (index === 3) {
      lines.sort((a, b) => {
        return (
          Number(a.children[index].textContent) -
          Number(b.children[index].textContent)
        );
      });
    } else if (index === 4) {
      lines.sort((a, b) => {
        const salA = a.children[index].textContent
          .split('')
          .splice(1)
          .join('')
          .split(',')
          .join('');
        const salB = b.children[index].textContent
          .split('')
          .splice(1)
          .join('')
          .split(',')
          .join('');

        return Number(salA) - Number(salB);
      });
    }

    counterOfClicks++;
  } else {
    if (index === 0 || index === 1 || index === 2) {
      lines.sort((a, b) => {
        const textA = a.children[index].textContent;
        const textB = b.children[index].textContent;

        return textB.localeCompare(textA);
      });
    } else if (index === 3) {
      lines.sort((a, b) => {
        return (
          Number(b.children[index].textContent) -
          Number(a.children[index].textContent)
        );
      });
    } else if (index === 4) {
      lines.sort((a, b) => {
        const salA = a.children[index].textContent
          .split('')
          .splice(1)
          .join('')
          .split(',')
          .join('');
        const salB = b.children[index].textContent
          .split('')
          .splice(1)
          .join('')
          .split(',')
          .join('');

        return Number(salB) - Number(salA);
      });
    }

    counterOfClicks++;
  }
}

for (let i = 0; i < arrayHeads.length; i++) {
  arrayHeads[i].addEventListener('click', () => {
    if (lastClickedColumn !== i) {
      counterOfClicks = 0;
      lastClickedColumn = i;
    }

    sorterOfRows(arrayRows, i);
    tbody.append(...arrayRows);
  });
}

// rows.forEach((el) => {
//   el.addEventListener('click', () => {
//     const prevAct = document.querySelector('.active');

//     if (prevAct !== null) {
//       prevAct.classList.remove('active');
//     }

//     el.classList.add('active');
//   });
// });

tbody.addEventListener('click', (e) => {
  const elClicked = e.target.closest('tr');
  const prevAct = document.querySelector('.active');

  if (prevAct !== null) {
    prevAct.classList.remove('active');
  }

  if (elClicked) {
    elClicked.classList.add('active');
  }
});

const formTemplate = `
    <form class="new-employee-form">
      <label>Name: <input name="name" type="text" data-qa="name" required></label>
      <label>Position: <input name="position" type="text" data-qa="position"></label>
      <label>Office:
        <select name="office"  data-qa="office" required>
          <option>Tokyo</option>
          <option>Singapore</option>
          <option>London</option>
          <option>New York</option>
          <option>Edinburgh</option>
          <option>San Francisco</option>
        </select>
      </label>
      <label>Age: <input name="age" type="number" data-qa="age" required></label>
      <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
      <button type="submit">Save to table</button>
    </form>`;

table.insertAdjacentHTML('afterend', formTemplate);

const form = document.querySelector('form.new-employee-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formStat = new FormData(form);
  const nameValue = formStat.get('name');
  const positionValue = formStat.get('position');
  const ageVal = Number(formStat.get('age'));

  if (
    ageVal < 18 ||
    ageVal > 90 ||
    nameValue.length < 4 ||
    positionValue === ''
  ) {
    pushNotification(
      150,
      10,
      'Some information is invalid',
      'Check age, position and name values.',
      'error',
    );

    return;
  }

  const newRow = document.createElement('tr');

  const tdName = document.createElement('td');
  const tdPos = document.createElement('td');
  const tdOffice = document.createElement('td');
  const tdAge = document.createElement('td');
  const tdSalary = document.createElement('td');

  tdName.textContent = nameValue;
  newRow.append(tdName);

  tdPos.textContent = positionValue;
  newRow.append(tdPos);

  tdOffice.textContent = formStat.get('office');
  newRow.append(tdOffice);

  tdAge.textContent = ageVal;
  newRow.append(tdAge);

  const changedSalary =
    '$' + Number(formStat.get('salary')).toLocaleString('en-US');

  tdSalary.textContent = changedSalary;
  newRow.append(tdSalary);

  tbody.append(newRow);
  arrayRows.push(newRow);
  form.reset();

  pushNotification(
    150,
    10,
    'Everething is alright',
    'The empoyee was successfully added.',
    'success',
  );
});

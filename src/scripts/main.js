const titles = [...document.querySelector('thead').firstElementChild.children];
const tbody = document.querySelector('tbody');

function isSorted(index) {
  const rows = [...tbody.children];

  for (let i = 0; i < rows.length - 1; i++) {
    const a = rows[i].children[index].textContent.trim();
    const b = rows[i + 1].children[index].textContent.trim();

    const aNum = parseFloat(a.replace(/[^0-9.-]+/g, ""));
    const bNum = parseFloat(b.replace(/[^0-9.-]+/g, ""));

    if (!isNaN(aNum) && !isNaN(bNum)) {
      if (aNum > bNum) {
        return false;
      }
    } else {
      if (a.localeCompare(b) > 0) {
        return false;
      }
    }
  }

  return true;
}

for (let i = 0; i < titles.length; i++) {
  titles[i].addEventListener('click', () => {
    const rows = [...tbody.children];

    if (!isSorted(i)) {
      rows.sort((row1, row2) => {
        const a = row1.children[i].textContent.trim();
        const b = row2.children[i].textContent.trim();

        const aNum = parseFloat(a.replace(/[^0-9.-]+/g, ""));
        const bNum = parseFloat(b.replace(/[^0-9.-]+/g, ""));

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        } else {
          return a.localeCompare(b);
        }
      });
    } else {
      rows.sort((row1, row2) => {
        const a = row1.children[i].textContent.trim();
        const b = row2.children[i].textContent.trim();

        const aNum = parseFloat(a.replace(/[^0-9.-]+/g, ""));
        const bNum = parseFloat(b.replace(/[^0-9.-]+/g, ""));

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return bNum - aNum;
        } else {
          return b.localeCompare(a);
        }
      });
    }

    for (const row of rows) {
      tbody.append(row);
    }
  });
}

tbody.addEventListener('click', (evnt) => {
  const tr = evnt.target.closest('tr');
  const selected = tbody.querySelector('.active');

  if (!tr) {
    return;
  }

  if (selected) {
    selected.classList.remove('active');
  }

  tr.classList.add('active');
});

const form = document.createElement('form');
form.classList.add('new-employee-form');

const nameLbl = document.createElement('label');
nameLbl.innerHTML = 'Name: <input name="name" type="text">';
nameLbl.setAttribute('data-qa', 'name');
nameLbl.setAttribute('required', '');

const positionLbl = document.createElement('label');
positionLbl.innerHTML = 'Position: <input name="position" type="text">';
positionLbl.setAttribute('data-qa', 'position');
positionLbl.setAttribute('required', '');
const officeLbl = document.createElement('label');

officeLbl.innerHTML = 'Office: <select name="office">';
const selectMenu = officeLbl.querySelector('select');
selectMenu.setAttribute('data-qa', 'office');
selectMenu.setAttribute('required', '');

const tokyo = document.createElement('option');
tokyo.textContent = 'Tokyo';

const singapore = document.createElement('option');
singapore.textContent = 'Singapore';

const london = document.createElement('option');
london.textContent = 'London';

const ny = document.createElement('option');
ny.textContent = 'New York';

const edinburgh = document.createElement('option');
edinburgh.textContent = 'Edinburgh';

const sf = document.createElement('option');
sf.textContent = 'San Francisco';

selectMenu.append(tokyo, singapore, london, ny, edinburgh, sf);

const ageLbl = document.createElement('label');
ageLbl.innerHTML = 'Age: <input name="age" type="number">';
ageLbl.setAttribute('data-qa', 'age');
ageLbl.setAttribute('required', '');

const salaryLbl = document.createElement('label');
salaryLbl.innerHTML = 'Salary: <input name="salary" type="number">';
salaryLbl.setAttribute('data-qa', 'salary');
salaryLbl.setAttribute('required', '');

const sendBtn = document.createElement('button');
sendBtn.setAttribute('type', 'submit');
sendBtn.textContent = 'Save to table';

form.append(nameLbl, positionLbl, officeLbl, ageLbl, salaryLbl, sendBtn);

const body = document.querySelector('body');
body.append(form);

sendBtn.addEventListener('click', (evnt) => {
  evnt.preventDefault();

  const inputName = form.elements.name.value.trim();
  const inputPos = form.elements.position.value.trim();
  const inputAge = form.elements.age.value.trim();
  const inputSal = form.elements.salary.value.trim();
  const inputOff = form.elements.office.value;

  if (inputName === '' ||
    inputPos === '' ||
    inputAge === '' ||
    inputSal === '') {
    const notificationAll = document.createElement('div');
    const titleAll = document.createElement('h2');
    const textAll = document.createElement('p');

    titleAll.classList.add('title');
    titleAll.textContent = 'Your form is not completed :)';
    textAll.textContent = 'Please, fulfill all fields correctly';

    notificationAll.append(titleAll, textAll);
    notificationAll.setAttribute('data-qa', 'notification');
    notificationAll.classList.add('notification', 'error');

    setTimeout(() => {
    notificationAll.remove();
    }, 2000);

    body.append(notificationAll);

    return;
  }

   if (inputName.length < 4) {
    const notificationName = document.createElement('div');
    const titleName = document.createElement('h2');
    const textName = document.createElement('p');

    titleName.classList.add('title');
    titleName.textContent = 'Your name is too short :)';
    textName.textContent = 'Please, enter more than 4 characters';

    notificationName.append(titleName, textName);
    notificationName.setAttribute('data-qa', 'notification');
    notificationName.classList.add('notification', 'error');

    setTimeout(() => {
    notificationName.remove();
    }, 2000);

    body.append(notificationName);

    return;
  }

  if (inputPos.length < 3) {
    const notificationPos = document.createElement('div');
    const titlePos = document.createElement('h2');
    const textPos = document.createElement('p');

    titlePos.classList.add('title');
    titlePos.textContent = 'Your position is too short :)';
    textPos.textContent = 'Please, enter more than 2 characters';

    notificationPos.append(titlePos, textPos);
    notificationPos.setAttribute('data-qa', 'notification');
    notificationPos.classList.add('notification', 'error');

    body.append(notificationPos);
    setTimeout(() => {
      notificationPos.remove();
    }, 2000);

    return;
  }

  if (+inputAge < 18 || +inputAge > 90) {
    const notificationAge = document.createElement('div');
    const titleAge = document.createElement('h2');
    const textAge = document.createElement('p');

    titleAge.classList.add('title');
    titleAge.textContent = 'Your age is bad :)';
    textAge.textContent = 'Please, enter age between 18 and 90';

    notificationAge.append(titleAge, textAge);
    notificationAge.setAttribute('data-qa', 'notification');
    notificationAge.classList.add('notification', 'error');

    setTimeout(() => {
    notificationAge.remove();
    }, 2000);
    body.append(notificationAge);

    return;
  }

  const tr = document.createElement('tr');
  const tdName = document.createElement('td');
  tdName.textContent = inputName;

  const tdPosition = document.createElement('td');
  tdPosition.textContent = inputPos;

  const tdOffice = document.createElement('td');
  tdOffice.textContent = inputOff;

  const tdAge = document.createElement('td');
  tdAge.textContent = inputAge;

  const tdSalary = document.createElement('td');
  tdSalary.textContent = `$${Number(inputSal).toLocaleString('en-US')}`;

  tr.append(tdName, tdPosition, tdOffice, tdAge, tdSalary);
  tbody.append(tr);

  const notificationSuccess = document.createElement('div');
  const titleSuccess = document.createElement('h2');
  const textSuccess = document.createElement('p');

  titleSuccess.classList.add('title');
  titleSuccess.textContent = 'New employee was added :)';
  textSuccess.textContent = 'Now our company has one more great person';

  notificationSuccess.append(titleSuccess, textSuccess);
  notificationSuccess.setAttribute('data-qa', 'notification');
  notificationSuccess.classList.add('notification', 'success');

  setTimeout(() => {
  notificationSuccess.remove();
  }, 2000);
  body.append(notificationSuccess);

  form.reset();
});

tbody.addEventListener('dblclick', (evnts) => {
  const cell = evnts.target.closest('td');
  if (!cell) return;

  const existingInput = tbody.querySelector('.cell-input');

  if (existingInput) {
    const valueToSave = existingInput.value.trim();
    const parentCell = existingInput.parentElement;
    parentCell.textContent = valueToSave === '' ? existingInput.defaultValue : valueToSave;
  }

  if (!cell.querySelector('input')) {
    const originalText = cell.textContent;
    const cellInput = document.createElement('input');

    cellInput.classList.add('cell-input');
    cellInput.value = originalText;
    cellInput.defaultValue = originalText;

    cell.textContent = '';
    cell.append(cellInput);
    cellInput.focus();

    cellInput.addEventListener('blur', () => {
      const val = cellInput.value.trim();
      cellInput.parentElement.textContent = val === '' ? cellInput.defaultValue : val;
    });

    cellInput.addEventListener('keydown', (evnt) => {
      if (evnt.key === 'Enter') {
        evnt.preventDefault();
        const val = cellInput.value.trim();
        cellInput.parentElement.textContent = val === '' ? cellInput.defaultValue : val;
      }
    });
  }
});

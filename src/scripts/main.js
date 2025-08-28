'use strict';

const body = document.body;

const headerList = document.querySelector('thead tr');
const footerList = document.querySelector('tfoot tr');
const tbody = document.querySelector('tbody');

// hanlder "sorter" which sort page's list by direct parameter

function sortByClick(listLine) {
  listLine.addEventListener('click', (ev) => {
    ev.preventDefault();

    const currTbody = document.querySelector('tbody');
    const currTbodyList = Array.from(currTbody.querySelectorAll('tr'));

    const sortParameter = ev.target.closest('th');
    let count = 0;
    let sortParamNum = 0;

    // count a number of a parameter to sorty by
    for (const child of listLine.children) {
      if (child.textContent === sortParameter.textContent) {
        sortParamNum = count;
      }
      count++;
    }

    // sorts the array from tbody element by selected parameter

    currTbodyList.sort((person1, person2) => {
      const n = sortParamNum;

      const firstParsed = parseFloat(
        person1.children[n].textContent.replace(/[^\d.]/g, ''),
      );
      const secondParsed = parseFloat(
        person2.children[n].textContent.replace(/[^\d.]/g, ''),
      );

      if (!isNaN(firstParsed) && !isNaN(secondParsed)) {
        return firstParsed - secondParsed;
      } else {
        const pers1 = person1.children[n].textContent;
        const pers2 = person2.children[n].textContent;

        return pers1.localeCompare(pers2);
      }
    });

    currTbody.innerText = '';

    for (const item of currTbodyList) {
      currTbody.appendChild(item);
    }
  });

  listLine.addEventListener('dblclick', (ev) => {
    ev.preventDefault();

    const currTbody = document.querySelector('tbody');
    const currTbodyList = Array.from(currTbody.querySelectorAll('tr'));

    const sortParameter = ev.target.closest('th');
    let count = 0;
    let sortParamNum = 0;

    // count a number of a parameter to sorty by
    for (const child of listLine.children) {
      if (child.textContent === sortParameter.textContent) {
        sortParamNum = count;
      }
      count++;
    }

    // sorts the array from tbody element by selected parameter
    currTbodyList.sort((person1, person2) => {
      const n = sortParamNum;

      const firstParsed = parseFloat(
        person1.children[n].textContent.replace(/[^\d.]/g, ''),
      );
      const secondParsed = parseFloat(
        person2.children[n].textContent.replace(/[^\d.]/g, ''),
      );

      if (!isNaN(firstParsed) && !isNaN(secondParsed)) {
        return secondParsed - firstParsed;
      } else {
        const pers1 = person1.children[n].textContent;
        const pers2 = person2.children[n].textContent;

        return pers2.localeCompare(pers1);
      }
    });

    currTbody.innerText = '';

    for (const item of currTbodyList) {
      currTbody.appendChild(item);
    }
  });
}

// functions to make selected visual effect of any row
function deletePreviousSelected(list) {
  for (const item of list.children) {
    item.classList = '';
  }
}

tbody.addEventListener('click', (ev) => {
  ev.preventDefault();

  if (ev.target.closest('tr')) {
    const selected = ev.target.closest('tr');

    deletePreviousSelected(tbody);
    selected.classList.add('active');
  }
});

// make str from salary to append it to a new row created through form
function makeStrFromSalary(salary) {
  let result = '';
  let count = 0;

  const strSalary = salary.toString();

  for (let i = strSalary.length - 1; i >= 0; i--) {
    count++;

    if (count % 3 === 0 && count !== strSalary.length) {
      result += `${strSalary[i]},`;
    } else {
      result += strSalary[i];
    }
  }

  return (result += '$').split('').reverse().join('');
}

// #region FORM

// create form
const newEmployee = document.createElement('form');

newEmployee.classList.add('new-employee-form');

// name
const nameOfEmployee = document.createElement('input');
const nameLabel = document.createElement('label');

nameOfEmployee.dataset.qa = 'name';
nameLabel.textContent = 'Name:';

nameLabel.appendChild(nameOfEmployee);
newEmployee.appendChild(nameLabel);

// position
const positionOfEmployee = document.createElement('input');
const positionLabel = document.createElement('label');

positionOfEmployee.dataset.qa = 'position';
positionLabel.textContent = 'Position:';

positionLabel.appendChild(positionOfEmployee);
newEmployee.append(positionLabel);

// office select
const officeOfEmployee = document.createElement('select');
const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office:';

officeOfEmployee.dataset.qa = 'office';

// 1
const firstOption = document.createElement('option');

firstOption.textContent = 'Tokyo';
officeOfEmployee.appendChild(firstOption);

// 2
const secondOption = document.createElement('option');

secondOption.textContent = 'Singapore';
officeOfEmployee.appendChild(secondOption);

// 3
const thirdOption = document.createElement('option');

thirdOption.textContent = 'London';
officeOfEmployee.appendChild(thirdOption);

// 4
const fourthOption = document.createElement('option');

fourthOption.textContent = 'New York';
officeOfEmployee.appendChild(fourthOption);

// 5
const fifthOption = document.createElement('option');

fifthOption.textContent = 'Edinburgh';
officeOfEmployee.appendChild(fifthOption);

// 6
const sixthOption = document.createElement('option');

sixthOption.textContent = 'San Francisco';
officeOfEmployee.appendChild(sixthOption);
officeLabel.appendChild(officeOfEmployee);
newEmployee.appendChild(officeLabel);

// age
const ageOfEmployee = document.createElement('input');
const ageLabel = document.createElement('label');

ageOfEmployee.dataset.qa = 'age';
ageLabel.textContent = 'Age:';

ageLabel.appendChild(ageOfEmployee);
newEmployee.appendChild(ageLabel);

// salary
const salaryOfEmoloyee = document.createElement('input');
const salaryLabel = document.createElement('label');

salaryOfEmoloyee.dataset.qa = 'salary';
salaryLabel.textContent = 'Salary:';

salaryLabel.appendChild(salaryOfEmoloyee);
newEmployee.appendChild(salaryLabel);

// submit button
const addEmployeeButton = document.createElement('button');

addEmployeeButton.textContent = 'Save to table';

addEmployeeButton.addEventListener('click', (ev) => {
  ev.preventDefault();

  const currTbody = document.querySelector('tbody');

  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';

  const nameValue = nameOfEmployee.value;
  const positionValue = positionOfEmployee.value;
  const officeValue = officeOfEmployee.value;
  const ageValue = parseFloat(ageOfEmployee.value) || 0;
  const salaryValue = parseFloat(salaryOfEmoloyee.value) || 0;

  function isClone(char) {
    for (const person of currTbody.children) {
      if (person.children[0].textContent === char) {
        return 'clone';
      }
    }
  }

  if (ageValue < 18 || ageValue > 90 || salaryValue === 0) {
    // error notification
    const notificationDescription = document.createElement('p');
    const notificationTitle = document.createElement('h2');

    notification.classList = 'notification error';
    notificationTitle.textContent = 'Error!';

    notificationDescription.textContent =
      'Something wrong with your filling, rewrite it please!';

    notification.appendChild(notificationTitle);
    notification.appendChild(notificationDescription);
  } else if (
    nameValue.length < 4 ||
    positionValue.length === 0 ||
    isClone(nameValue) === 'clone'
  ) {
    // error notification
    const notificationDescription = document.createElement('p');
    const notificationTitle = document.createElement('h2');

    notification.classList = 'notification error';
    notificationTitle.textContent = 'Error!';

    notificationDescription.textContent =
      'Something wrong with your filling, rewrite it please!';

    if (isClone(nameValue) === 'clone') {
      notificationDescription.textContent =
        "You've added a person with that name";
    }

    notification.appendChild(notificationTitle);
    notification.appendChild(notificationDescription);
  } else {
    const row = document.createElement('tr');
    // name
    const employeeName = document.createElement('td');

    employeeName.textContent = nameValue;
    row.appendChild(employeeName);

    // position
    const position = document.createElement('td');

    position.textContent = positionValue;
    row.appendChild(position);

    // office
    const office = document.createElement('td');

    office.textContent = officeValue;
    row.appendChild(office);

    // age
    const age = document.createElement('td');

    age.textContent = ageValue;
    row.appendChild(age);

    // function to convert salary number into right value with $ and comas
    const salary = document.createElement('td');

    salary.textContent = makeStrFromSalary(salaryValue);
    // console.log(salary);

    row.append(salary);

    tbody.appendChild(row);

    // success notification
    const notificationDescription = document.createElement('p');
    const notificationTitle = document.createElement('h2');

    notification.classList = 'notification success';
    notificationTitle.textContent = 'Success!';
    notificationDescription.textContent = 'A new employee succesfully added!';

    notification.appendChild(notificationTitle);
    notification.appendChild(notificationDescription);
  }

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);

  document.body.appendChild(notification);
});

newEmployee.appendChild(addEmployeeButton);

body.appendChild(newEmployee);
// #endregion

// creates possibility to edit cells just by doubleClicking on them
tbody.addEventListener('dblclick', (ev) => {
  ev.preventDefault();

  const currCell = ev.target.closest('td');
  const cellTextBefore = currCell.textContent;

  const input = document.createElement('input');

  input.classList.add('cell-input');
  currCell.textContent = '';
  currCell.appendChild(input);
  input.focus();

  function cellInputValidation() {
    if (input.value.length > 0) {
      const newText = input.value;

      currCell.textContent = newText;
      currCell.removeChild(input);
    } else {
      currCell.textContent = cellTextBefore;
    }

    return cellInputValidation;
  }

  input.addEventListener('blur', () => {
    cellInputValidation();
  });

  input.addEventListener('keydown', (eve) => {
    if (eve.key === 'Enter') {
      cellInputValidation();
    }
  });
});

// IMPORTANT TO BE AT THE END OF CODE
sortByClick(headerList);
sortByClick(footerList);

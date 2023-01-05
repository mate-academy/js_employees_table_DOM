'use strict';

const table = document.querySelector('table');
const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
    <label>Name: <input name="name" type="text" data-qa="name" ></label>
    <label>Position: 
    <input name="position" type="text" data-qa="position" ></label>
    <label>Office: <select name="office" data-qa="office> 
    <option value="value0"></option>
    <option value="Tokio" selected>Tokio</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
  </select></label>
   <label>Age: <input name="age" type="text"  data-qa="age"></label>
   <label>Salary: <input name="salary" type="text"  data-qa="salary" ></label>
   <button>Save to table</button>
   `;

table.after(form);

function massageHTML(massageAbout, classMassage) {
  const massage = document.createElement('div');

  massage.className = 'notification' + ' ' + classMassage;

  massage.innerHTML = `<p class=title> ${massageAbout}</p>`;

  table.after(massage);

  setTimeout(() => {
    massage.remove();
  }, 3000);
}

const formCl = document.querySelector('.new-employee-form');

formCl.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') {
    return;
  }
  e.preventDefault();

  const massageSuccess = 'Пользователь добавлен';
  const massageErrorName = 'Имя пользователя должно иметь не менее 4 букв';
  const massageErrorAgeMin = 'Возраст не должен быть меньше 18 лет';
  const massageErrorAgeMax = 'Возраст не должен быть больше 90 лет';
  const massageErrorNumber = 'Значение возраста должно быть числом';
  const massageErrorSalary = 'Значение зарплата должно быть числом';

  const tr = document.createElement('tr');

  const namePerson = formCl.elements.name.value;
  const agePerson = formCl.elements.age.value;
  const salaryPerson = '$'
  + new Intl.NumberFormat('en-us').format(formCl.elements.salary.value);

  if (namePerson.length < 4) {
    massageHTML(massageErrorName, 'error');

    return;
  }

  if (agePerson < 18) {
    massageHTML(massageErrorAgeMin, 'error');

    return;
  }

  if (agePerson > 90) {
    massageHTML(massageErrorAgeMax, 'error');

    return;
  }

  if (typeof agePerson !== 'number') {
    massageHTML(massageErrorNumber, 'error');

    return;
  }

  if (typeof agePerson !== 'number') {
    massageHTML(massageErrorSalary, 'error');

    return;
  }

  tr.innerHTML = `
    <td>${namePerson}</td>
    <td>${formCl.elements.position.value}</td>
    <td>${formCl.elements.office.value}</td>
    <td>${agePerson}</td>
    <td>${salaryPerson}</td>
 `;

  const tbodyAdd = document.getElementsByTagName('tbody')[0];

  tbodyAdd.append(tr);

  formCl.elements.name.value = '';
  formCl.elements.age.value = '';
  formCl.elements.salary.value = '';
  formCl.elements.position.value = '';

  massageHTML(massageSuccess, 'success');
});

const thead = document.querySelector('thead');

function formatNumberFromCurrency(number) {
  return number.textContent.replace('$', '').replace(',', '');
}

let sortName;
let sortTab;

function sort(nameSort) {
  if (sortName === nameSort) {
    sortTab = !sortTab;
  } else {
    sortName = nameSort;
    sortTab = true;
  }

  const tbodyN = document.getElementsByTagName('tbody')[0];
  const tr = tbodyN.getElementsByTagName('tr');

  const people = [...tr].sort((a, b) => {
    let aTd;
    let bTd;

    if (sortTab === false) {
      aTd = b.querySelectorAll('td');
      bTd = a.querySelectorAll('td');
    } else {
      aTd = a.querySelectorAll('td');
      bTd = b.querySelectorAll('td');
    }

    switch (nameSort) {
      case 'Name':
        return (aTd[0].textContent).localeCompare(
          bTd[0].textContent);
      case 'Position':
        return (aTd[1].textContent).localeCompare(
          bTd[1].textContent);
      case 'Office':
        return (aTd[2].textContent).localeCompare(
          bTd[2].textContent);
      case 'Age':
        return (
          aTd[3].textContent
        - bTd[3].textContent);
      case 'Salary':

        return formatNumberFromCurrency(aTd[4])
         - formatNumberFromCurrency(bTd[4]);
    }
  });

  const tbodyNew = document.createElement('tbody');

  tbodyNew.innerHTML = `
    ${people.map(person => {
    const personTd = person.querySelectorAll('td');

    return `<tr>
    <td>${personTd[0].innerText}</td>
    <td>${personTd[1].innerText}</td>
    <td>${personTd[2].innerText}</td>
    <td>${personTd[3].innerText}</td>
    <td>${personTd[4].innerText}</td>
    </tr>
    `;
  }).join('')}
    `;

  tbodyN.replaceWith(tbodyNew);
}

thead.addEventListener('click', (e) => {
  if (!e.target.tagName === 'TH') {
    return;
  } ;

  const nameSort = e.target.textContent;

  sort(nameSort);
}
);

let td;
let textarea;

class Activ {
  constructor(textareaN) {
    this.textarea = textareaN;
  }

  activ() {
    textarea.focus();
  }
}

document.addEventListener('dblclick', (e) => {
  if (td) {
    return;
  }

  td = e.target.closest('td');

  if (!td) {
    return;
  }
  textarea = document.createElement('textarea');
  textarea.value = td.innerHTML;
  textarea.classList.add('cell-input');
  td.style.display = 'none';
  td.after(textarea);

  const activS = new Activ(textarea);

  activS.activ();
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') {
    return;
  }

  if (textarea.value.length !== 0) {
    td.innerHTML = textarea.value;
  }
  textarea.remove();
  td.style.display = '';
  td = '';
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') {
    return;
  }

  if (textarea.value.length !== 0) {
    td.innerHTML = textarea.value;
  }
  textarea.remove();
  td.style.display = '';
  td = '';
});

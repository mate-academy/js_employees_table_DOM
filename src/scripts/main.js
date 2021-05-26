'use strict';

const tbody = document.querySelector('tbody');

const array = [...tbody.rows].map(row =>
  [
    row.cells[0].innerText,
    row.cells[1].innerText,
    row.cells[2].innerText,
    row.cells[3].innerText,
    row.cells[4].innerText,
  ]
);

const checkout = {
  name: true,
  position: true,
  office: true,
  age: true,
  salary: true,
};

document.addEventListener('click', e => {
  if (e.target.tagName === 'TD') {
    e.target.clallList.toggle('active');
  }

  if (e.target.tagName === 'TH') {
    switch (e.target.innerText) {
      case 'Name':
        if (checkout.name) {
          array.sort((a, b) => a[0].localeCompare(b[0]));
          checkout.name = !checkout.name;
        } else {
          array.sort((a, b) => b[0].localeCompare(a[0]));
          checkout.name = !checkout.name;
        }
        break;
      case 'Position':
        if (checkout.position) {
          array.sort((a, b) => a[1].localeCompare(b[1]));
          checkout.position = !checkout.position;
        } else {
          array.sort((a, b) => b[1].localeCompare(a[1]));
          checkout.position = !checkout.position;
        }
        break;
      case 'Office':
        if (checkout.office) {
          array.sort((a, b) => a[2].localeCompare(b[2]));
          checkout.office = !checkout.office;
        } else {
          array.sort((a, b) => b[2].localeCompare(a[2]));
          checkout.office = !checkout.office;
        }
        break;
      case 'Age':
        if (checkout.age) {
          array.sort((a, b) => a[3] - b[3]);
          checkout.age = !checkout.age;
        } else {
          array.sort((a, b) => b[3] - a[3]);
          checkout.age = !checkout.age;
        }
        break;
      case 'Salary':
        if (checkout.salary) {
          array.sort((a, b) => {
            return a[4].replace(/[^0-9]/g, '') - b[4].replace(/[^0-9]/g, '');
          });
          checkout.salary = !checkout.salary;
        } else {
          array.sort((a, b) => {
            return b[4].replace(/[^0-9]/g, '') - a[4].replace(/[^0-9]/g, '');
          });
          checkout.salary = !checkout.salary;
        }
        break;
    }
  }

  for (let i = 0; i < tbody.rows.length; i++) {
    for (let j = 0; j < tbody.rows[i].cells.length; j++) {
      tbody.rows[i].cells[j].innerText = array[i][j];
    }
  }
});

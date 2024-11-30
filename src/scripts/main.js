'use strict';

const table = document.querySelector('table');
// const tHeadRow = ;
const tHeadCols = Array.from(table.tHead.rows[0].cells);
// const tFootRow = table.tFoot.rows[0];
const tFootCols = Array.from(table.tFoot.rows[0].cells);
const tBodyRows = table.tBodies[0].rows;
const people = [];

for (const row of tBodyRows) {
  const person = {};

  person.name = row.cells[0].textContent;
  person.position = row.cells[1].textContent;
  person.office = row.cells[2].textContent;
  person.age = row.cells[3].textContent;
  person.salary = row.cells[4].textContent;
  people.push(person);
}

function salaryToNum(str) {
  const arr = str.split(',');
  const value = arr[0].slice(1) + arr[1];

  return +value;
}

table.addEventListener('click', (e) => {
  const th = e.target.closest('th');
  const indexThHead = Array.prototype.indexOf.call(tHeadCols, e.target);
  const indexThFoot = Array.prototype.indexOf.call(tFootCols, e.target);

  tHeadCols.forEach((el, i) => {
    if (i !== indexThHead) {
      el.className = '';
    }
  });

  tFootCols.forEach((el, i) => {
    if (i !== indexThFoot) {
      el.className = '';
    }
  });

  if (th.className === '') {
    th.className = 'active';

    const sortBy = th.textContent.toLowerCase();

    if (sortBy === 'salary') {
      people.sort((a, b) => salaryToNum(a[sortBy]) - salaryToNum(b[sortBy]));
    } else {
      people.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    }

    for (let i = 0; i < tBodyRows.length; i++) {
      tBodyRows[i].cells[0].textContent = people[i].name;
      tBodyRows[i].cells[1].textContent = people[i].position;
      tBodyRows[i].cells[2].textContent = people[i].office;
      tBodyRows[i].cells[3].textContent = people[i].age;
      tBodyRows[i].cells[4].textContent = people[i].salary;
    }
  } else if (th.className === 'active') {
    th.className = '';

    const sortBy = th.textContent.toLowerCase();

    if (sortBy === 'salary') {
      people.sort((a, b) => salaryToNum(b[sortBy]) - salaryToNum(a[sortBy]));
    } else {
      people.sort((a, b) => b[sortBy].localeCompare(a[sortBy]));
    }

    for (let i = 0; i < tBodyRows.length; i++) {
      tBodyRows[i].cells[0].textContent = people[i].name;
      tBodyRows[i].cells[1].textContent = people[i].position;
      tBodyRows[i].cells[2].textContent = people[i].office;
      tBodyRows[i].cells[3].textContent = people[i].age;
      tBodyRows[i].cells[4].textContent = people[i].salary;
    }
  }

  // console.log(indexTh);
});

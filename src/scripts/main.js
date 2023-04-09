'use strict';

// Sorting:
const tableHead = document.querySelector('thead');

const sortingColumns = (e) => {
  const sortByColumn = e.target.innerText;
  const allRows = [...document.querySelector('table').rows];
  const tableDataToSort = [];

  // console.log(e.target);

  for (let i = 1; i < allRows.length - 1; i++) {
    const cells = allRows[i].cells;
    const person = {};

    person.Name = cells[0].innerText;
    person.Position = cells[1].innerText;
    person.Office = cells[2].innerText;
    person.Age = cells[3].innerText;
    person.Salary = cells[4].innerText;

    tableDataToSort.push(person);
  }

  console.log('clicked is: ', e.target.dataset.clicked);

  if (sortByColumn === 'Salary') {
    tableDataToSort.sort((a, b) => {
      const toNumberA = a.Salary.match(/\d+/g).join('');
      const toNumberB = b.Salary.match(/\d+/g).join('');

      return toNumberA - toNumberB;
    });
  } else {
    tableDataToSort.sort((a, b) =>
      a[sortByColumn].localeCompare(b[sortByColumn]));
  }

  for (let i = 1; i < allRows.length - 1; i++) {
    const tableRow = allRows[i];

    tableRow.innerHTML = `
      <td>${tableDataToSort[i - 1].Name}</td>
      <td>${tableDataToSort[i - 1].Position}</td>
      <td>${tableDataToSort[i - 1].Office}</td>
      <td>${tableDataToSort[i - 1].Age}</td>
      <td>${tableDataToSort[i - 1].Salary}</td>
    `;
  }

  e.target.dataset['clicked'] = true;
  console.log(tableDataToSort);
};

tableHead.addEventListener('click', sortingColumns);

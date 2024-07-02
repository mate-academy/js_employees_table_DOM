'use strict';

const table = document.querySelector('table');
const tBody = table.tBodies[0];
const tHead = table.tHead;
const tHeadCells = tHead.rows[0].cells;
const tBodyRows = [...tBody.rows];

table.insertAdjacentHTML(
  'afterend',
  `<form class="new-employee-form">
    <label>Name: <input name="name" type="text" data-qa="name"></label>
    <label>Position: <input name="position" type="text" data-qa="position"></label>
    <label>Office: <select name="office" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select></label>
    <label>Age: <input name="age" type="number" data-qa="age"></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
    <button type="submit">Save to table</button>
  </form>`,
);

const clicksCounter = [0, 0, 0, 0, 0];

for (let i = 0; i < tHeadCells.length; i++) {
  tHeadCells[i].addEventListener('click', function () {
    tBodyRows.sort((a, b) => {
      const cellA = a.cells[i].innerText.toLowerCase();
      const cellB = b.cells[i].innerText.toUpperCase();

      if (clicksCounter[i] % 2 === 0) {
        return sortTable(cellA, cellB);
      } else {
        return sortTable(cellB, cellA);
      }
    });

    clicksCounter[i] = clicksCounter[i] + 1;

    tBodyRows.forEach((row) => {
      tBody.append(row);
    });
  });
}

function sortTable(cellA, cellB) {
  if (!isNaN(cellA) && isNaN(cellB)) {
    return parseFloat(cellA) - parseFloat(cellB);
  } else if (cellA.includes('$')) {
    const newA = cellA.replace(/[$,]/g, '');
    const newB = cellB.replace(/[$,]/g, '');

    return parseFloat(newA) - parseFloat(newB);
  } else {
    return cellA.localeCompare(cellB);
  }
}

let currentActiveTr;

tBody.addEventListener('click', (e) => {
  const newTr = e.target.closest('tr');

  newTr.classList.add('active');

  if (currentActiveTr !== newTr) {
    if (currentActiveTr) {
      currentActiveTr.classList.remove('active');
    }
    currentActiveTr = newTr;
  }
});

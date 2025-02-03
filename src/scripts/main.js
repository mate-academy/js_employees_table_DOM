'use strict';

// write code here
const headers = document.querySelectorAll('thead > tr > th');
const table = document.querySelector('table');
const tfoot = document.querySelector('tfoot');

const headersList = [];

// cycle to go through headers
for (const header of headers) {
  const span = document.createElement('span');

  span.textContent = header.textContent.trim();
  header.textContent = '';
  header.prepend(span);

  headersList.push(header);

  header.clicked = false;

  header.addEventListener('click', () => {
    const index = [...headers].indexOf(header);

    if (headersList.includes(header)) {
      if (header.clicked === false){
        sortColumn(index, 'asc');
      } else {
        sortColumn(index, 'desc');
      }
      
    }
    header.clicked = !header.clicked;
  });
}

// function for sorting column
function sortColumn(colIndex, direction) {
  let switching = true;
  const table = document.querySelector('table');

  while (switching) {
    switching = false;

    const rows = Array.from(table.rows).slice(1);

    for (let i = 0; i < rows.length - 1; i++) {
      let shouldSwitch = false;

      const x = rows[i].getElementsByTagName('td')[colIndex];
      const y = rows[i + 1].getElementsByTagName('td')[colIndex];

      if (!x || !y) continue;

      const numX = x.textContent.trim();
      const numY = y.textContent.trim();

      const dollarNumX = parseFloat(x.textContent.replace(/[$,]/g, ''));
      const dollarNumY = parseFloat(y.textContent.replace(/[$,]/g, ''));

      if (
        typeof x.textContent === 'number' &&
        typeof y.textContent === 'number'
      ) {
        if (direction === 'asc') {
          if (
            numX > numY || dollarNumX > dollarNumY
          ) {
            shouldSwitch = true;
          }
        } else if (direction === 'desc') {
          if (
            numX < numY || dollarNumX < dollarNumY
          ) {
            shouldSwitch = true;
          }
        }
      } else {
        if (direction === 'asc') {
          if (x.textContent.toLowerCase() > y.textContent.toLowerCase()) {
            shouldSwitch = true;
          }
        } else if (direction === 'desc') {
          if (x.textContent.toLowerCase() < y.textContent.toLowerCase()) {
            shouldSwitch = true;
          }
        }
        
      }

      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }
}

// selecting particular row
const rows = Array.from(table.rows).slice(1, -1);
const tr = document.querySelector('tbody > tr');

for (const row of rows) {
  row.addEventListener('click', () => {
    for (const el of rows) {
      el.style.backgroundColor = '';
      for (const cell of el.children) {
        cell.style.color = '';
      }
    }

    row.style.backgroundColor = '#127bab';
    for (const child of row.children) {
      child.style.color = 'white';
    }
  })
}

const body = document.querySelector('body');

const div = document.createElement('div');
div.style.display = "flex";
div.style.justifyContent = "center";
div.style.width = "150px";
div.style.height = "50px";

const button = document.createElement('button');
button.innerHTML = "ADD";
button.style.width = "150px";
button.style.borderRadius = "10px";

div.appendChild(button);
tfoot.appendChild(div);
'use strict';

const titles = document.querySelectorAll('th');
const tbody = document.querySelector('tbody');
const initialRows = Array.from(tbody.querySelectorAll('tr'));
let sortStates = Array(titles.length).fill(1);

function sortRowsByColumn(dataRows, columnIndex, order) {
  return dataRows.sort((a, b) => {
    const cellA = a.cells[columnIndex].textContent.trim();
    const cellB = b.cells[columnIndex].textContent.trim();
    if (cellA < cellB) return -1 * order;
    if (cellA > cellB) return 1 * order;
    return 0;
  });
}

function sortRowsByNumber(dataRows, columnIndex, order) {
  return dataRows.sort((a, b) => {
    const cellA = parseFloat(a.cells[columnIndex].textContent.replace('$', '').replace(/,/g, ''));
    const cellB = parseFloat(b.cells[columnIndex].textContent.replace('$', '').replace(/,/g, ''));
    return (cellA - cellB) * order;
  });
}

titles.forEach((element, index) => {
  element.addEventListener('click', () => {
    let sortedRows;
    if (index === 3 || index === 4) {
      sortedRows = sortRowsByNumber(initialRows, index, sortStates[index]);
    } else {
      sortedRows = sortRowsByColumn(initialRows, index, sortStates[index]);
    }
    sortStates[index] *= -1;
    sortedRows.forEach((row) => {
      tbody.appendChild(row);
    });
  });
});

const hoverRow = document.querySelectorAll('tr');
hoverRow.forEach((row) =>{

  row.addEventListener('click', () => {
hoverRow.forEach((r)=> r.classList.remove('active'));
    row.classList.add('active' );
  });

});


const formContainer = document.createElement('form');
formContainer.className='new-employee-form';

const label = document.createElement('label');
label.className ='label'
label.textContent = 'Name:';


const input = document.createElement('input');
input.className = 'select'
input.setAttribute('name','name');
input.setAttribute('type','text');
input.setAttribute('data-qa','name')

const label2 = document.createElement('label')
label2.textContent = 'Position'
const input2 = document.createElement('input')
input2.setAttribute('name','position');
input2.setAttribute('type','text');
input2.setAttribute('data-qa','position')


const label3 = document.createElement('label')
label3.textContent = 'Office'
const select = document.createElement('select')
select.setAttribute('name', 'office')
select.className ='select';
const option1 = document.createElement('option');
option1.setAttribute('value','tokyo')
option1.textContent ='Tokyo';

const option2 = document.createElement('option');



document.body.appendChild(formContainer);
  formContainer.appendChild(label);
  label.appendChild(input);
  formContainer.appendChild(label2)
  label2.appendChild(input2)
  formContainer.appendChild(label3)
  label3.appendChild(select)
select.appendChild(option1)


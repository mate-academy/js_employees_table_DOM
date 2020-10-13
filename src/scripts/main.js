import { sortRows } from './sortRows';
import { addActive } from './addActive';
import { updateRow } from './updateRow';
import { addEmployee } from './addEmployee';

const table = document.querySelector('table');
const tableBody = table.tBodies[0];
const tableRows = tableBody.rows;
const tableHeader = table.tHead.rows[0];

const headerList = [...tableHeader.cells].map(column => column.textContent);

const form = document.createElement('form');

const cityList = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const selectOptions = cityList.map(city => `<option>${city}</option>`).join('');

form.className = 'new-employee-form';

form.innerHTML = `
<label>Name:
  <input name="name" type="text" required>
</label>

<label>Position:
  <input name="position" type="text" required>
</label>

<label>Office:
   <select name="office" required>${selectOptions}</select>
</label>

<label>Age:
  <input name="age" type="number" required>
</label>

<label>Salary:
  <input name="salary" type="number" required>
</label>

<button type="submit">Save to table</button>
`;

document.body.append(form);

tableHeader.addEventListener('click', sortRows);
tableBody.addEventListener('click', addActive);
tableBody.addEventListener('dblclick', updateRow);
form.addEventListener('submit', addEmployee);

export { tableBody, tableHeader, headerList, tableRows, table, form };

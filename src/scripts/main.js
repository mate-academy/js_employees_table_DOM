'use strict';

(function() {
const table = document.getElementById('employees');
const tbody = table.querySelector('tbody');
const headers = table.querySelectorAll('th.sortable');


let sortState = { key: null, dir: 1 };// dir 1 asc, -1 desc


function parseSalary(text){
return Number(String(text).replace(/[^0-9.-]+/g, '')) || 0;
}
function formatSalary(num){
if (isNaN(num)) return '$0';
return '$' + Number(num).toLocaleString();
}


function getCellValue(row, key){
const cell = Array.from(row.children).find(td=>td.dataset.key === key);
if(!cell) return '';
return cell.textContent.trim();
}


function compareRows(a,b,key){
const aVal = getCellValue(a,key);
const bVal = getCellValue(b,key);
if(key === 'age'){
return Number(aVal) - Number(bVal);
}
if(key === 'salary'){
return parseSalary(aVal) - parseSalary(bVal);
}
return aVal.localeCompare(bVal);
}


function sortBy(key){
const rows = Array.from(tbody.querySelectorAll('tr'));
if(sortState.key === key){
sortState.dir *= -1;
} else {
sortState.key = key; sortState.dir = 1;
}
rows.sort((a,b)=> compareRows(a,b,key) * sortState.dir);
rows.forEach(r => tbody.appendChild(r));
updateSortIndicators();
}


function updateSortIndicators(){
headers.forEach(h => {
const key = h.dataset.key;
const span = h.querySelector('.sort-ind');
if(sortState.key === key){
span.textContent = sortState.dir === 1 ? '\u25B2' : '\u25BC';
} else span.textContent = '';
});
}


headers.forEach(h => {
h.addEventListener('click', ()=> sortBy(h.dataset.key));
});


tbody.addEventListener('click', (e)=>{
const tr = e.target.closest('tr');
if(!tr) return;
tbody.querySelectorAll('tr').forEach(r => r.classList.remove('active'));
tr.classList.add('active');
});


const formTarget = document.getElementById('form-target');
const formHtml = `
<form class="new-employee-form" novalidate>
<label>Name: <input name="name" data-qa="name" type="text" required></label>
<label>Position: <input name="position" data-qa="position" type="text" required></label>
<label>Office: <select name="office" data-qa="office" required>
<option>Tokyo</option>
<option>Singapore</option>
<option>London</option>
<option>New York</option>
<option>Edinburgh</option>
<option>San Francisco</option>
</select></label>
<label>Age: <input name="age" data-qa="age" type="number" min="18" max="90" required></label>
<label>Salary: <input name="salary" data-qa="salary" type="number" step="1" required></label>
<button class="btn" type="submit">Save to table</button>
</form>
`;
formTarget.innerHTML = formHtml;


const form = formTarget.querySelector('form');
const notificationArea = document.getElementById('notification-area');


function showNotification(type, title, desc){
const node = document.createElement('div');
node.className = 'notification ' + (type === 'success' ? 'success' : 'error');
node.setAttribute('data-qa','notification');
node.innerHTML = `<strong>${title}</strong><div>${desc || ''}</div>`;
notificationArea.innerHTML = '';
notificationArea.appendChild(node);
setTimeout(()=>{
if(notificationArea.contains(node)) notificationArea.removeChild(node);
}, 3500);
}


function addRow({name,position,office,age,salary}){
const tr = document.createElement('tr');
tr.innerHTML = `
<td data-key="name">${escapeHtml(name)}</td>
<td data-key="position">${escapeHtml(position)}</td>
<td data-key="office">${escapeHtml(office)}</td>
<td data-key="age">${escapeHtml(String(age))}</td>
<td data-key="salary">${formatSalary(Number(salary))}</td>
`;
tbody.appendChild(tr);
}


function escapeHtml(s){
return String(s).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}


form.addEventListener('submit',(e)=>{
e.preventDefault();
const data = new FormData(form);
const name = (data.get('name')||'').trim();
const position = (data.get('position')||'').trim();
const office = (data.get('office')||'').trim();
const age = Number(data.get('age'));
const salary = Number(data.get('salary'));


if(!name || !position || !office || !data.get('age') || !data.get('salary')){
showNotification('error','Validation error','All fields are required.');
return;
}
if(name.length < 4){
showNotification('error','Name too short','Name must have at least 4 letters.');
return;
}
if(age < 18 || age > 90){
showNotification('error','Invalid age','Age must be between 18 and 90.');
return;
}
addRow({name,position,office,age,salary});
showNotification('success','Employee added',`${name} successfully added to the table.`);
form.reset();
});


let editing = null;
tbody.addEventListener('dblclick',(e)=>{
const td = e.target.closest('td');
if(!td) return;
if(editing) return;
const initial = td.textContent.trim();
const input = document.createElement('input');
input.className = 'cell-input';
const key = td.dataset.key;
if(key === 'age' || key === 'salary'){
input.type = 'number';
if(key === 'age'){ input.min = 0; }
if(key === 'salary'){ input.min = 0; input.step = '0.01' }
input.value = key === 'salary' ? parseSalary(initial) : (initial || '');
} else {
input.type = 'text';
input.value = initial;
}
td.textContent = '';
td.appendChild(input);
input.focus();
editing = {td, initial};


function commit(){
let val = input.value.trim();
if(!val){
td.textContent = editing.initial;
} else {
if(key === 'salary') td.textContent = formatSalary(Number(val));
else td.textContent = val;
}
cleanup();
}
function cleanup(){
editing = null;
input.removeEventListener('blur',onBlur);
input.removeEventListener('keydown',onKey);
}
function onBlur(){ commit(); }
function onKey(ev){ if(ev.key === 'Enter'){ commit(); } if(ev.key === 'Escape'){ td.textContent = editing.initial; cleanup(); }}
input.addEventListener('blur',onBlur);
input.addEventListener('keydown',onKey);
});


(function assignKeys(){
const rows = tbody.querySelectorAll('tr');
rows.forEach(r=>{
const cells = r.querySelectorAll('td');
if(cells.length >=5){
cells[0].dataset.key = 'name';
cells[1].dataset.key = 'position';
cells[2].dataset.key = 'office';
cells[3].dataset.key = 'age';
cells[4].dataset.key = 'salary';
}
});
})();
})();
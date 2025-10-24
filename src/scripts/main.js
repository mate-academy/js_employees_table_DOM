'use strict';

const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');

// ===== SORTOWANIE =====
const sortDirections = Array.from(thead.querySelectorAll('th')).map(() => 'ASC');

thead.addEventListener('click', (e) => {
  if (e.target.tagName !== 'TH') return;
  
  const headers = Array.from(thead.querySelectorAll('th'));
  const index = headers.indexOf(e.target);
  
  // reset kierunku sortowania innych kolumn
  headers.forEach((th, i) => {
    if (i !== index) sortDirections[i] = 'ASC';
  });

  const direction = sortDirections[index];
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    let aText = a.children[index].textContent.trim();
    let bText = b.children[index].textContent.trim();

    // liczby
    if (!isNaN(Number(aText.replace(/[$,]/g, '')))) {
      aText = Number(aText.replace(/[$,]/g, ''));
      bText = Number(bText.replace(/[$,]/g, ''));
    }

    if (direction === 'ASC') {
      return aText > bText ? 1 : aText < bText ? -1 : 0;
    } else {
      return aText < bText ? 1 : aText > bText ? -1 : 0;
    }
  });

  // odśwież tbody
  rows.forEach(row => tbody.appendChild(row));

  // zmień kierunek na przeciwny
  sortDirections[index] = direction === 'ASC' ? 'DESC' : 'ASC';
});

// ===== WYBÓR WIERSZA (DELEGACJA) =====
tbody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');
  if (!tr) return;

  tbody.querySelectorAll('tr').forEach(r => r.classList.remove('active'));
  tr.classList.add('active');
});

// ===== FORMULARZ DODAWANIA PRACOWNIKA =====
const form = document.createElement('form');
form.className = 'new-employee-form';
form.innerHTML = `
  <label>Name: <input type="text" data-qa="name" /></label>
  <label>Position: <input type="text" data-qa="position" /></label>
  <label>Office:
    <select data-qa="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input type="number" data-qa="age" /></label>
  <label>Salary: <input type="number" data-qa="salary" /></label>
  <button type="submit">Save to table</button>
`;
document.body.prepend(form);

// powiadomienia
const notification = document.createElement('div');
notification.setAttribute('data-qa', 'notification');
document.body.prepend(notification);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  notification.textContent = '';
  notification.classList.remove('error', 'success');
  
  const employeeName = form.querySelector('[data-qa="name"]').value.trim();
  const position = form.querySelector('[data-qa="position"]').value.trim();
  const office = form.querySelector('[data-qa="office"]').value;
  const age = form.querySelector('[data-qa="age"]').value;
  const salary = form.querySelector('[data-qa="salary"]').value;

  // WALIDACJA
  if (!employeeName || !position || !office || age === '' || salary === '') {
    notification.textContent = 'All fields are required.';
    notification.classList.add('error');
    return;
  }

  if (employeeName.length < 4) {
    notification.textContent = 'Name must be at least 4 characters.';
    notification.classList.add('error');
    return;
  }

  const ageNum = Number(age);
  if (ageNum < 18 || ageNum > 90) {
    notification.textContent = 'Age must be between 18 and 90.';
    notification.classList.add('error');
    return;
  }

  const salaryNum = Number(salary);

  // DODANIE WIERSZA
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${ageNum}</td>
    <td>$${salaryNum.toLocaleString()}</td>
  `;
  tbody.appendChild(tr);

  // POWIADOMIENIE SUKCESU
  notification.textContent = 'Employee added successfully.';
  notification.classList.add('success');

  // reset formularza
  form.reset();
});

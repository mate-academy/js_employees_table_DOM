'use strict';

// #region value
const tbody = document.querySelector('tbody');
const headers = document.querySelectorAll('th');
const body = document.querySelector('body');

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  const title = document.createElement('span');

  title.classList.add('title');
  title.textContent = type === 'success' ? 'Success' : 'Error';

  const text = document.createElement('span');

  text.textContent = message;
  notification.appendChild(title);
  notification.appendChild(text);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// #endregion
// #region clickSort
headers.forEach((header, columIndex) => {
  header.addEventListener('click', (e) => {
    const originalRows = [...tbody.querySelectorAll('tr')];
    const rows = [...originalRows];

    rows.sort((rowA, rowB) => {
      const firstColumn = rowA.children[columIndex].textContent.trim();
      const secondColum = rowB.children[columIndex].textContent.trim();
      const firstColumnWithoutSymbols = parseFloat(
        firstColumn.replace(/[$,]/g, ''),
      );
      const secondColumnWithoutSymbols = parseFloat(
        secondColum.replace(/[$,]/g, ''),
      );

      if (
        !isNaN(firstColumnWithoutSymbols) &&
        !isNaN(secondColumnWithoutSymbols)
      ) {
        return firstColumnWithoutSymbols - secondColumnWithoutSymbols;
      } else {
        return firstColumn.localeCompare(secondColum);
      }
    });

    const isAlreadySorted = originalRows.every((row, i) => row === rows[i]);

    if (isAlreadySorted) {
      rows.reverse();
    }
    // tbody.innerHTML = '';
    rows.forEach((row) => tbody.appendChild(row));
  });
});

// #endregion
// #region newForm
const form = document.createElement('form');

form.setAttribute('class', 'new-employee-form');

form.innerHTML = `
  <label>
    Name: <input name="name" type="text" data-qa="name" />
  </label>
  <label>
    Position: <input name="position" type="text" data-qa="position" />
  </label>
  <label>
    Age: <input name="age" type="number" data-qa="age" />
  </label>
  <label>
    Salary: <input name="salary" type="number" data-qa="salary" />
  </label>
  <label>
    Office:
    <select name="office" data-qa="office">
      <option value="">Select office</option>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <button type="submit">Save to table</button>
`;

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const namee = formData.get('name').trim();
  const position = formData.get('position').trim();
  const age = Number(formData.get('age').trim());
  const salary = Number(formData.get('salary').trim());
  const office = formData.get('office').trim();

  if (!namee || !position || !age || !salary || !office) {
    // eslint-disable-next-line no-undef
    showNotification('All fields are required.', 'error');

    return;
  }

  if (namee.length < 4) {
    // eslint-disable-next-line no-undef
    showNotification('Name must be at least 4 characters long.', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    // eslint-disable-next-line no-undef
    showNotification('Age must be between 18 and 90.', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${namee}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `;

  tbody.appendChild(newRow);
  enableRowSelection();
  showNotification('Employee added successfully.', 'success');
  form.reset();
});
body.appendChild(form);
// #endregion
enableRowSelection();

function enableRowSelection() {
  const tr = tbody.querySelectorAll('tr');

  tr.forEach((TrRow) => {
    TrRow.addEventListener('click', () => {
      tr.forEach((r) => r.classList.remove('active'));
      TrRow.classList.add('active');
    });
  });
}
// #region rowSelection
// (removed)
// #endregion

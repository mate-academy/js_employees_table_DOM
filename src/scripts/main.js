document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const form = document.querySelector('.new-employee-form');
  const notificationContainer = document.querySelector('.notifications');
  let selectedRow = null;

  const sortTable = (columnIndex) => {
    const rows = Array.from(table.querySelectorAll('tr:nth-child(n+2)'));
    let sortedRows;

    const th = table.querySelectorAll('th')[columnIndex];

    if (th.classList.contains('asc')) {
      sortedRows = rows.sort((rowA, rowB) => {
        return rowA.cells[columnIndex].innerText <
          rowB.cells[columnIndex].innerText
          ? 1
          : -1;
      });
      th.classList.remove('asc');
      th.classList.add('desc');
    } else {
      sortedRows = rows.sort((rowA, rowB) => {
        return rowA.cells[columnIndex].innerText >
          rowB.cells[columnIndex].innerText
          ? 1
          : -1;
      });
      th.classList.remove('desc');
      th.classList.add('asc');
    }

    sortedRows.forEach((row) => table.appendChild(row));
  };

  table.addEventListener('click', (clickEvent) => {
    const th = clickEvent.target.closest('th');

    if (th) {
      const columnIndex = Array.from(th.parentNode.children).indexOf(th);

      sortTable(columnIndex);
    }
  });

  table.addEventListener('click', (clickEvent) => {
    const tr = clickEvent.target.closest('tr');

    if (tr && tr.tagName === 'TR') {
      if (selectedRow) {
        selectedRow.classList.remove('active');
      }
      tr.classList.add('active');
      selectedRow = tr;
    }
  });

  const showNotification = (message, type) => {
    const notification = document.createElement('div');

    notification.classList.add('notification', type);
    notification.setAttribute('data-qa', 'notification');

    const title = document.createElement('h3');

    title.textContent = message.title;

    const description = document.createElement('p');

    description.textContent = message.description;
    notification.appendChild(title);
    notification.appendChild(description);
    notificationContainer.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  form.addEventListener('submit', (formEvent) => {
    formEvent.preventDefault();

    const formName = form.querySelector('[data-qa="name"]').value;
    const position = form.querySelector('[data-qa="position"]').value;
    const office = form.querySelector('[data-qa="office"]').value;
    const age = parseInt(form.querySelector('[data-qa="age"]').value, 10);
    const salary = parseFloat(
      form.querySelector('[data-qa="salary"]').value.replace(/,/g, ''),
    );

    if (formName.length < 4) {
      showNotification(
        {
          title: 'Error',
          description: 'Name must be at least 4 characters long.',
        },
        'error',
      );

      return;
    }

    if (age < 18 || age > 90) {
      showNotification(
        { title: 'Error', description: 'Age must be between 18 and 90.' },
        'error',
      );

      return;
    }

    if (isNaN(salary)) {
      showNotification(
        { title: 'Error', description: 'Salary must be a valid number.' },
        'error',
      );

      return;
    }

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${formName}</td>
        <td>${position}</td>
        <td>${office}</td>
        <td>${age}</td>
        <td>${salary.toLocaleString()}</td>
      `;
    table.appendChild(newRow);

    showNotification(
      { title: 'Success', description: 'Employee added successfully.' },
      'success',
    );

    form.reset();
  });

  table.addEventListener('dblclick', (dblClickEvent) => {
    const td = dblClickEvent.target.closest('td');

    if (td && td.tagName === 'TD') {
      const oldValue = td.innerText.trim();
      const input = document.createElement('input');

      input.type = 'text';
      input.classList.add('cell-input');
      input.value = oldValue;

      td.innerHTML = '';
      td.appendChild(input);

      input.addEventListener('blur', () => {
        td.innerHTML = input.value || oldValue;
      });

      input.addEventListener('keydown', (keyEvent) => {
        if (keyEvent.key === 'Enter') {
          td.innerHTML = input.value || oldValue;
        }
      });
    }
  });
});

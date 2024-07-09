document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body');
  const table = document.querySelector('tbody');
  const headerItems = document.querySelectorAll('thead th');
  const tableRows = document.querySelectorAll('tbody tr');

  const form = document.createElement('form');

  form.className = 'new-employee-form';
  form.action = '#';
  form.method = 'post';

  form.innerHTML = `
    <label>Name: <input data-qa="name" name="name" type="text"></label>
    <label>Position: <input data-qa="position" name="position" type="text"></label>
    <label>Office: <select data-qa="office" name="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
      </select>
    </label>
    <label>Age: <input data-qa="age" name="age" type="number"></label>
    <label>Salary: <input data-qa="salary" name="salary" type="number"></label>
    <button type="submit">Save to table</button>
  `;
  body.append(form);

  const pushNotification = (
    posTop,
    posRight,
    title,
    description,
    type = '',
  ) => {
    const message = document.createElement('div');

    message.className = `notification ${type}`;
    message.dataset.qa = 'notification';
    message.style.top = `${posTop}px`;
    message.style.right = `${posRight}px`;

    message.innerHTML = `
      <h2 class="title">${title}</h2>
      <p>${description}</p>
    `;
    body.append(message);

    setTimeout(() => {
      message.hidden = true;
    }, 2000);
  };

  const checkData = (formData) => {
    if (formData.name.trim().length < 4) {
      pushNotification(
        500,
        10,
        'Error!',
        'The name should contain at least 4 letters.',
        'error',
      );

      return false;
    }

    if (!formData.position.trim()) {
      pushNotification(
        500,
        10,
        'Error!',
        'Position field cannot be empty!',
        'error',
      );

      return false;
    }

    if (+formData.salary < 0) {
      pushNotification(
        500,
        10,
        'Error!',
        'Salary field cannot be negative!',
        'error',
      );

      return false;
    }

    if (+formData.age < 18 || +formData.age > 90) {
      pushNotification(
        500,
        10,
        'Error!',
        'Age must be between 18 and 90.',
        'error',
      );

      return false;
    }

    return true;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    if (!checkData(data)) {
      return;
    }

    const newRow = document.createElement('tr');
    const formattedSalary = Number(data.salary).toLocaleString('en-US');

    newRow.innerHTML = `
      <td>${data.name}</td>
      <td>${data.position}</td>
      <td>${data.office}</td>
      <td>${data.age}</td>
      <td>$${formattedSalary}</td>
    `;

    table.append(newRow);

    pushNotification(
      500,
      10,
      'Success!',
      'Employee has been added!',
      'success',
    );
    form.reset();
  });

  const sortTable = () => {
    let currentIndex = null;
    let isReverse = false;

    headerItems.forEach((headerItem, index) => {
      headerItem.addEventListener('click', () => {
        if (currentIndex === index) {
          isReverse = !isReverse;
        } else {
          currentIndex = index;
          isReverse = false;
        }

        const sortedRows = [...tableRows].sort((row1, row2) => {
          const cell1 = row1.children[index].textContent;
          const cell2 = row2.children[index].textContent;
          const value1 = cell1.includes('$')
            ? parseFloat(cell1.replace(/[$,]/g, ''))
            : cell1;
          const value2 = cell2.includes('$')
            ? parseFloat(cell2.replace(/[$,]/g, ''))
            : cell2;

          return value1 > value2 ? 1 : -1;
        });

        if (isReverse) {
          sortedRows.reverse();
        }
        table.append(...sortedRows);
      });
    });
  };

  sortTable();

  table.addEventListener('click', (e) => {
    tableRows.forEach((row) => row.classList.remove('active'));
    e.target.closest('tr').classList.add('active');
  });
});

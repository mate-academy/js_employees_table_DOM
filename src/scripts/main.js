document.addEventListener('DOMContentLoaded', () => {
  const thead = document.querySelector('thead');
  const tbody = document.querySelector('tbody');
  const theadCells = Array.from(thead.rows[0].cells);
  const sortOrders = {};

  theadCells.forEach((cell, index) => {
    sortOrders[index] = 'asc';
  });

  const sortTable = (columnIndex, order) => {
    const rows = Array.from(tbody.rows);

    rows.sort((a, b) => {
      const valueA = a.cells[columnIndex].textContent.trim();
      const valueB = b.cells[columnIndex].textContent.trim();

      return order === 'asc'
        ? valueA.localeCompare(valueB, 'en', { numeric: true })
        : valueB.localeCompare(valueA, 'en', { numeric: true });
    });

    const fragment = document.createDocumentFragment();

    rows.forEach((row) => fragment.appendChild(row));
    tbody.appendChild(fragment);
  };

  theadCells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
      const currentOrder = sortOrders[index];

      sortTable(index, currentOrder);

      sortOrders[index] = currentOrder === 'asc' ? 'desc' : 'asc';
    });
  });

  const setActiveClass = (row) => {
    const activeRow = tbody.querySelector('.active');

    if (activeRow) {
      activeRow.classList.remove('active');
    }
    row.classList.add('active');
  };

  tbody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (row && !row.classList.contains('active')) {
      setActiveClass(row);
    }
  });

  const form = document.createElement('form');

  form.className = 'new-employee-form';

  const formInputs = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'position', label: 'Position', type: 'text' },
    {
      name: 'office',
      label: 'Office',
      type: 'select',
      options: [
        'Tokyo',
        'Singapore',
        'London',
        'New York',
        'Edinburgh',
        'San Francisco',
      ],
    },
    { name: 'age', label: 'Age', type: 'number' },
    { name: 'salary', label: 'Salary', type: 'number' },
  ];

  formInputs.forEach(({ name, label, type, options }) => {
    const inputLabel = document.createElement('label');

    inputLabel.textContent = `${label}: `;

    const input = document.createElement(
      type === 'select' ? 'select' : 'input',
    );

    input.name = name;
    input.setAttribute('data-qa', name);

    if (type === 'select') {
      options.forEach((optionText) => input.add(new Option(optionText)));
    } else {
      input.type = type;
    }

    inputLabel.appendChild(input);
    form.appendChild(inputLabel);
  });

  form.appendChild(
    Object.assign(document.createElement('button'), {
      type: 'submit',
      textContent: 'Save to table',
    }),
  );

  document.body.appendChild(form);
});

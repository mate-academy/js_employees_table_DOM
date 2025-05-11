// 'use strict';

// // write code here
// document.addEventListener('DOMContentLoaded', () => {
//   const table = document.querySelector('table');
//   const headers = table.querySelectorAll('thead th');
//   const tbody = table.querySelector('tbody');

//   let sortDirection = {};

//   headers.forEach((header, columnIndex) => {
//     header.addEventListener('click', () => {
//       const rows = Array.from(tbody.querySelectorAll('tr'));
//       const isAscending = !sortDirection[columnIndex];

//      const typeIsNum = ['Age', 'Salary'].includes(header.textContent.trim());

//       rows.sort((a, b) => {
//         let aText = a.children[columnIndex].textContent.trim();
//         let bText = b.children[columnIndex].textContent.trim();

//         if (typeIsNum) {
//           aText = parseFloat(aText.replace(/[^0-9.]/g, ''));
//           bText = parseFloat(bText.replace(/[^0-9.]/g, ''));
//         }

//         if (aText < bText) {
//           return isAscending ? -1 : 1;
//         }

//         if (aText > bText) {
//           return isAscending ? 1 : -1;
//         }

//         return 0;
//       });

//       rows.forEach((row) => tbody.appendChild(row));

//       sortDirection = {};
//       sortDirection[columnIndex] = isAscending;
//     });
//   });

//   tbody.addEventListener('click', (e) => {
//     const row = e.target.closest('tr');

//     if (!row || !tbody.contains(row)) {
//       return;
//     }

//     const activeRows = tbody.querySelectorAll('tr.active');

//     activeRows.forEach((tr) => {
//       tr.classList.remove('active');
//     });

//     row.classList.add('active');
//   });

//   const createForm = () => {
//     const form = document.createElement('form');

//     form.className = 'new-employee-form';

//     const input = (label, nname, type = 'text') => {
//       const wrapper = document.createElement('label');
//       wrapper.innerHTML = `${label}: `;
//       const el = document.createElement('input');
//       el.name = nname;
//       el.type = type;
//       el.setAttribute('data-qa', nname);
//       el.className = 'new-employee-form__input';
//       wrapper.appendChild(el);
//       return wrapper;
//     };

//     const select = () => {
//       const label = document.createElement('label');
//       label.innerHTML = 'Office: ';
//       const sel = document.createElement('select');
//       sel.name = 'office';
//       sel.setAttribute('data-qa', 'office');
//       sel.className = 'new-employee-form__select';
//       const objectCity = [
//         'Tokyo', 'Singapore', 'London',
//         'New York', 'Edinburgh', 'San Francisco'
//       ];
//       objectCity.forEach((city) => {
//         const opt = document.createElement('option');
//         opt.value = city;
//         opt.textContent = city;
//         sel.appendChild(opt);
//       });
//       label.appendChild(sel);
//       return label;
//     };

//     const button = document.createElement('button');
//     button.type = 'submit';
//     button.textContent = 'Save to table';
//     button.className = 'new-employee-form__button';

//     form.append(
//       input('Name', 'name'),
//       input('Position', 'position'),
//       select(),
//       input('Age', 'age', 'number'),
//       input('Salary', 'salary', 'number'),
//       button
//     );

//     table.parentElement.appendChild(form);

//     return form; // ← ВАЖЛИВО!
//   };

//   const select = () => {
//     const label = document.createElement('label');

//     label.innerHTML = 'Office: ';

//     const sel = document.createElement('select');

//     sel.name = 'office';
//     sel.setAttribute('data-qa', 'office');
//     sel.className = 'new-employee-form__select';

//     const objectCity = [
//       'Tokyo',
//       'Singapore',
//       'London',
//       'New York',
//       'Edinburgh',
//       'San Francisco',
//     ];

//     objectCity.forEach((city) => {
//       const opt = document.createElement('option');

//       opt.value = city;
//       opt.textContent = city;
//       sel.appendChild(opt);
//     });

//     label.appendChild(sel);

//     return label;
//   };

//   const button = document.createElement('button');

//   button.type = 'submit';
//   button.textContent = 'Save to table';
//   button.className = 'new-employee-form__button';

//   form.append(
//     input('Name', 'name'),
//     input('Position', 'position'),
//     select(),
//     input('Age', 'age', 'number'),
//     input('Salary', 'salary', 'number'),
//     button,
//   );

//   table.parentElement.appendChild(form);

//   const showNotification = (type, msg) => {
//     const notiFicat = document.querySelectorAll('.notification');

//     notiFicat.forEach((n) => n.remove());

//     const note = document.createElement('div');

//     note.className = `notification ${type}`;
//     note.setAttribute('data-qa', 'notification');
//     note.textContent = msg;

//     document.body.appendChild(note);

//     setTimeout(() => {
//       note.remove();
//     }, 3000);
//   };

//   const formHandler = (e) => {
//     e.preventDefault();

//     const form = e.target;

//     const nname = form.name.value.trim();
//     const position = form.position.value.trim();
//     const office = form.office.value.trim();
//     const age = parseInt(form.age.value, 10);
//     const salary = parseFloat(form.salary.value);

//     if (!nname || !position || !office || isNaN(age) || isNaN(salary)) {
//       showNotification('error', 'All fields are required.');

//       return;
//     }

//     if (nname.length < 4) {
//       showNotification('error', 'Name must be ≥ 4 letters.');

//       return;
//     }

//     if (age < 18 || age > 90) {
//       showNotification('error', 'Age must be 18–90.');

//       return;
//     }

//     const row = document.createElement('tr');

//     const formattedSalary = new Intl.NumberFormat('en-US').format(salary);

//     row.innerHTML = `
//       <td>${nname}</td>
//       <td>${position}</td>
//       <td>${office}</td>
//       <td>${age}</td>
//       <td>$${formattedSalary}</td>
//     `;

//     tbody.appendChild(row);
//     row.classList.add('active');

//     showNotification('success', 'Employee added.');
//     form.reset();
//   };

//   createForm();

//   const nEF = document.querySelector('.new-employee-form');

//   nEF.addEventListener('submit', formHandler);

// });
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const headers = table.querySelectorAll('thead th');
  const tbody = table.querySelector('tbody');

  let sortDirection = {};

  headers.forEach((header, columnIndex) => {
    header.addEventListener('click', () => {
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const isAscending = !sortDirection[columnIndex];
      const typeIsNum = ['Age', 'Salary'].includes(header.textContent.trim());

      rows.sort((a, b) => {
        let aText = a.children[columnIndex].textContent.trim();
        let bText = b.children[columnIndex].textContent.trim();

        if (typeIsNum) {
          aText = parseFloat(aText.replace(/[^0-9.]/g, ''));
          bText = parseFloat(bText.replace(/[^0-9.]/g, ''));
        }

        if (aText < bText) {
          return isAscending ? -1 : 1;
        }

        if (aText > bText) {
          return isAscending ? 1 : -1;
        }

        return 0;
      });

      rows.forEach((row) => tbody.appendChild(row));
      sortDirection = {};
      sortDirection[columnIndex] = isAscending;
    });
  });

  tbody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (!row || !tbody.contains(row)) {
      return;
    }

    tbody.querySelectorAll('tr.active').forEach((tr) => {
      tr.classList.remove('active');
    });

    row.classList.add('active');
  });

  const createForm = () => {
    const form = document.createElement('form');

    form.className = 'new-employee-form';

    const input = (label, nname, type = 'text') => {
      const wrapper = document.createElement('label');

      wrapper.innerHTML = `${label}: `;

      const el = document.createElement('input');

      el.name = nname;
      el.type = type;
      el.setAttribute('data-qa', nname);
      el.className = 'new-employee-form__input';
      wrapper.appendChild(el);

      return wrapper;
    };

    const select = () => {
      const label = document.createElement('label');

      label.innerHTML = 'Office: ';

      const sel = document.createElement('select');

      sel.name = 'office';
      sel.setAttribute('data-qa', 'office');
      sel.className = 'new-employee-form__select';

      const firstCity = [
        'Tokyo',
        'Singapore',
        'London',
        'New York',
        'Edinburgh',
        'San Francisco',
      ];

      firstCity.forEach((city) => {
        const opt = document.createElement('option');

        opt.value = city;
        opt.textContent = city;
        sel.appendChild(opt);
      });

      label.appendChild(sel);

      return label;
    };

    const button = document.createElement('button');

    button.type = 'submit';
    button.textContent = 'Save to table';
    button.className = 'new-employee-form__button';

    form.append(
      input('Name', 'name'),
      input('Position', 'position'),
      select(),
      input('Age', 'age', 'number'),
      input('Salary', 'salary', 'number'),
      button,
    );

    table.parentElement.appendChild(form);

    return form;
  };

  const showNotification = (type, msg) => {
    document.querySelectorAll('.notification').forEach((n) => n.remove());

    const note = document.createElement('div');

    note.className = `notification ${type}`;
    note.setAttribute('data-qa', 'notification');
    note.textContent = msg;

    document.body.appendChild(note);
    setTimeout(() => note.remove(), 3000);
  };

  const formHandler = (e) => {
    e.preventDefault();

    const form = e.target;
    const nname = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value.trim();
    const age = parseInt(form.age.value, 10);
    const salary = parseFloat(form.salary.value);

    if (!nname || !position || !office || isNaN(age) || isNaN(salary)) {
      showNotification('error', 'All fields are required.');

      return;
    }

    if (nname.length < 4) {
      showNotification('error', 'Name must be ≥ 4 letters.');

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('error', 'Age must be 18–90.');

      return;
    }

    const formattedSalary = new Intl.NumberFormat('en-US').format(salary);
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${nname}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${formattedSalary}</td>
    `;

    tbody.appendChild(row);
    row.classList.add('active');

    showNotification('success', 'Employee added.');
    form.reset();
  };

  const formm = createForm();

  formm.addEventListener('submit', formHandler);
});

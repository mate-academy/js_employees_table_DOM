'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const tableThead = document.querySelector('table thead');
  const thThead = tableThead.querySelectorAll('tr th');

  const tableTbody = document.querySelector('table tbody');
  let lastSortedIndex = null;

  thThead.forEach((header, index) => {
    header.addEventListener('click', () => {
      thThead.forEach((h, i) => {
        if (i !== index) {
          h.dataset.order = '';
        }
      });

      let currentOrder;

      if (lastSortedIndex !== index) {
        currentOrder = 'asc';
      } else {
        currentOrder = header.dataset.order === 'asc' ? 'desc' : 'asc';
      }
      header.dataset.order = currentOrder;
      lastSortedIndex = index;

      const lislAllTrTbody = Array.from(tableTbody.querySelectorAll('tr'));

      lislAllTrTbody.sort((a, b) => {
        const cellA = a.cells[index].textContent.trim();
        const cellB = b.cells[index].textContent.trim();
        const numA = parseFloat(cellA.replace(/[^\d.]/g, ''));
        const numB = parseFloat(cellB.replace(/[^\d.]/g, ''));

        if (!isNaN(numA) && !isNaN(numB)) {
          return currentOrder === 'asc' ? numA - numB : numB - numA;
        } else {
          return currentOrder === 'asc'
            ? cellA.localeCompare(cellB)
            : cellB.localeCompare(cellA);
        }
      });

      tableTbody.innerHTML = '';
      lislAllTrTbody.forEach((row) => tableTbody.appendChild(row));
    });
  });

  tableTbody.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');

    if (!tr) {
      return;
    }

    tableTbody
      .querySelectorAll('tr')
      .forEach((row) => row.classList.remove('active'));
    tr.classList.add('active');
  });

  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  function createField(labelText, type, names, options = []) {
    const wrapper = document.createElement('div');

    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.marginBottom = '8px';

    const label = document.createElement('label');

    label.textContent = labelText;

    let input;
    const nameLower = names.toLowerCase();

    if (type === 'select') {
      input = document.createElement('select');
      input.name = nameLower;
      input.id = names;
      input.setAttribute('data-qa', nameLower);
      input.required = true;

      options.forEach((optText) => {
        const opt = document.createElement('option');

        opt.value = optText;
        opt.textContent = optText;
        input.appendChild(opt);
      });
    } else {
      input = document.createElement('input');
      input.type = type;
      input.name = nameLower;
      input.id = names;
      input.setAttribute('data-qa', nameLower);
      input.required = true;
    }

    label.appendChild(input);
    wrapper.appendChild(label);

    const msg = document.createElement('div');

    msg.style.color = 'red';
    msg.style.fontSize = '12px';
    msg.style.marginTop = '4px';
    wrapper.appendChild(msg);

    input.addEventListener('input', () => {
      if (input.name === 'name') {
        msg.textContent =
          input.value.length < 4
            ? `Ім'я повинно містити мінімум 4 символи`
            : '';
      } else if (input.name === 'age') {
        const age = parseInt(input.value, 10);

        msg.textContent =
          input.value && (age < 18 || age > 90)
            ? 'Вік повинен бути від 18 до 90 років'
            : '';
      } else {
        msg.textContent = '';
      }
    });

    return wrapper;
  }

  form.appendChild(createField('Name:', 'text', 'Name'));
  form.appendChild(createField('Position:', 'text', 'Position'));

  form.appendChild(
    createField('Office:', 'select', 'Office', [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ]),
  );
  form.appendChild(createField('Age:', 'number', 'Age'));
  form.appendChild(createField('Salary:', 'number', 'Salary'));

  const button = document.createElement('button');

  button.type = 'submit';
  button.textContent = 'Save to table';
  form.appendChild(button);
  document.body.appendChild(form);

  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = '#f0f0f0';
  notification.style.border = '1px solid #ccc';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '8px';
  notification.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  notification.style.fontFamily = 'Arial, sans-serif';
  notification.style.zIndex = '9999';
  notification.style.opacity = '0';
  notification.style.transition = 'opacity 0.5s, transform 0.5s';
  notification.style.transform = 'translateY(-20px)';
  document.body.appendChild(notification);

  button.addEventListener('click', (e) => {
    e.preventDefault();

    const inputs = form.querySelectorAll('input, select');
    let formValid = true;

    inputs.forEach((input) => {
      const msg = input.parentNode.nextElementSibling;

      if (input.name === 'name' && input.value.length < 4) {
        msg.textContent = `Ім'я повинно містити мінімум 4 символи`;
        formValid = false;
      } else if (input.name === 'age') {
        const age = parseInt(input.value, 10);

        if (!input.value || age < 18 || age > 90) {
          msg.textContent = 'Вік повинен бути від 18 до 90 років';
          formValid = false;
        } else {
          msg.textContent = '';
        }
      } else if (!input.value) {
        msg.textContent = 'Це поле обов’язкове';
        formValid = false;
      } else {
        msg.textContent = '';
      }
    });

    if (!formValid) {
      notification.textContent = 'Будь ласка, виправте помилки у формі';
      notification.className = 'error';
      notification.style.color = 'green';
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    } else {
      notification.textContent = 'Новий співробітник успішно доданий!';
      notification.className = 'success';
      notification.style.color = 'green';
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';

      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.className = '';
      }, 2000);

      const tBody = tableTbody;
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${inputs[0].value.trim()}</td>
        <td>${inputs[1].value.trim()}</td>
        <td>${inputs[2].value}</td>
        <td>${Number(inputs[3].value)}</td>
        <td>$${Number(inputs[4].value).toLocaleString('en-US')}</td>
      `;
      tBody.appendChild(row);
      form.reset();
    }
  });
});

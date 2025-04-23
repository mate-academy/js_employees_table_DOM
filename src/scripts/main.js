'use strict';

const table = document.querySelector('table');
const th = table.querySelectorAll('th');
const tbody = document.querySelector('tbody');
const newArr = Array.from(tbody.rows);
let count = 0;

th.forEach((element, index) => {
  element.addEventListener('click', () => {
    count++;

    newArr.sort((elA, elB) => {
      const textA = elA.cells[index].textContent.trim();
      const textB = elB.cells[index].textContent.trim();

      const resultA =
        parseFloat(textA.replace(/[^\d.-]/g, '')) || textA.toLowerCase();
      const resultB =
        parseFloat(textB.replace(/[^\d.-]/g, '')) || textB.toLowerCase();

      if (typeof resultA === 'number' && typeof resultB === 'number') {
        if (count % 2 !== 0) {
          return resultA - resultB;
        } else {
          return resultB - resultA;
        }
      } else {
        if (count % 2 !== 0) {
          return resultA.localeCompare(resultB);
        } else {
          return resultB.localeCompare(resultA);
        }
      }
    });

    tbody.append(...newArr);
  });
});

newArr.forEach((element) => {
  element.addEventListener('click', () => {
    newArr.forEach((el) => el.classList.remove('active'));
    element.classList.add('active');
  });
});

document.addEventListener('click', (events) => {
  const tabel = document.querySelector('form');

  if (tabel) {
    return;
  }

  if (!table.contains(events.target)) {
    const form = document.createElement('form');

    form.classList.add('new-employee-form');

    form.innerHTML = `
    <label>Name: <input name="name" type="text" data-qa="name"></label>
    <label>Position: <input name="position" type="text" data-qa="position"></label>
    <label>
      Office:
      <select name="office" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select></label>
      <label>Age: <input name="age" type="number" data-qa="age"></label>
      <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
      <button type="submit">Save to table</button>

    `;

    document.body.appendChild(form);

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const namePeople = formData.get('name').trim();
      const position = formData.get('position').trim();
      const office = formData.get('office');
      const age = parseInt(formData.get('age'), 10);
      const salary = formData.get('salary');

      const pushNotification = (posTop, posRight, title, description, type) => {
        const notification = document.createElement('div');

        notification.classList.add('notification', type);

        notification.setAttribute('data-qa', 'notification');

        notification.style.top = `${posTop}px`;
        notification.style.right = `${posRight}px`;

        const titleH = document.createElement('h2');

        titleH.classList.add('title');

        titleH.textContent = title;

        const descriptionP = document.createElement('p');

        descriptionP.textContent = description;

        document.body.appendChild(notification);
        notification.appendChild(titleH);
        notification.appendChild(descriptionP);

        setTimeout(() => {
          notification.remove();
        }, 2000);
      };

      if (!age || !namePeople || !office || !position || !salary) {
        pushNotification(10, 10, 'Warning', 'Enter your data.', 'warning');

        return;
      }

      if (namePeople.length < 4) {
        pushNotification(
          10,
          10,
          'Wrong name',
          'Keep the correct name.',
          'error',
        );

        return;
      }

      if (age < 18 || age > 90) {
        pushNotification(
          10,
          10,
          'Wrong age',
          'Youre under 18 years old.',
          'error',
        );

        return;
      }

      pushNotification(
        10,
        10,
        'Thats great!',
        'Youve successfully entered your data.',
        'success',
      );

      const newRow = document.createElement('tr');

      newRow.innerHTML = `
          <td>${namePeople}</td>
          <td>${position}</td>
          <td>${office}</td>
          <td>${age}</td>
          <td>${salary}</td>
        `;

      tbody.appendChild(newRow);
      form.reset();
    });
  }
});

'use strict';

const doc = {
  orderASC: false,
  create: (element) => document.createElement(element),
  get: (element) => document.querySelector(element),
  getAll: (element) => document.querySelectorAll(element),
  getCell: (row, evenT) => row.children[evenT.target.cellIndex]
    .textContent.replace(/[$,]/g, ''),

  monetize: (item) => '$' + new Intl.NumberFormat('en-US').format(+item),
  capitalize: (words) => words.split(' ')
    .map(word => word[0].charAt(0).toUpperCase()
    + word.slice(1)).join(' ').replace('_', ' '),

  get cities() {
    return [...this.getAll('tbody tr')].map(tr => tr.children[2].innerText);
  },

  createInput: (thisName, type) => `
    <label>${thisName}:
      <input name=${thisName.toLowerCase()}
        data-qa=${thisName.toLowerCase()}
        type=${type}
        autocomplete="off" required
      >
    </label>
  `,
};

doc.get('table').insertAdjacentHTML('afterEnd', `
  <form class='new-employee-form'>
    ${doc.createInput('Name', 'text')}
    ${doc.createInput('Position', 'text')}
      <label>Office:
        <select name="Office" data-qa='office'>
          ${[...new Set(doc.cities)].map((city) => `
            <option value=${city.replace(' ', '_')}>
              ${city}
            </option>
          `, '')}
        </select>
      </label>
    ${doc.createInput('Age', 'number')}
    ${doc.createInput('Salary', 'number')}
    <button type="Submit">Save to table</button>
  </form>`
);

doc.get('form').addEventListener('submit', (e) => {
  e.preventDefault();

  const newMap = new FormData(doc.get('form'));
  const userInput = {
    age: newMap.get('age'),
    name: newMap.get('name').replace(/\s/g, ''),
    post: newMap.get('position').replace(/\s/g, ''),
    newRow: doc.create('tr'),

    validation: function() {
      this.name.length < 4 && notify(100, 'name_error');
      this.post.length < 4 && notify(198, 'position_error');
      (this.age < 18 || this.age > 90) && notify(295, 'age_error');
    },

    addNewRecord: function() {
      [...newMap].map(value => {
        const add = ((value[0] === 'salary')
          && doc.monetize(value[1])) || doc.capitalize(value[1]);

        this.newRow.insertAdjacentHTML('beforeend', `<td>${add}</td>`);
      });
      doc.get('tbody').prepend(this.newRow);
      notify(100, 'success');
      doc.get('form').reset();
    },
  };

  userInput.validation();
  doc.get('.error') || userInput.addNewRecord();
});

const notify = (posTop, type) => {
  const notification = doc.create('div');
  const message = {
    name_error: 'Another letter required or two...',
    position_error: 'This position has been filled!',
    age_error: 'No way!<br/>...it is </b>illegal</b> to hire at this age!',
    success: 'New Record ADDED!<br/><br/>Double click to eddit table',
  };

  notification.style.top = `${posTop}px`;
  notification.style.width = `${190}px`;

  notification.className = `
    notification ${type.split('_')[1]} data-qa="notification`;

  notification.innerHTML = `
    <h2 class="title">${type.split('_').join(' ')}</h2>
    <p>${message[type]}</p>
  `;
  document.body.append(notification);

  setTimeout(() => {
    doc.get('.notification').remove();
  }, 2000);
};

doc.get('thead').addEventListener('click', (e) => {
  const sorted = [...doc.getAll('tbody tr')].sort((aRow, bRow) => {
    const a = doc.getCell(aRow, e);
    const b = doc.getCell(bRow, e);

    return isNaN(a) ? a.localeCompare(b) : a - b;
  });

  doc.orderASC && sorted.reverse();
  doc.orderASC = !doc.orderASC;
  sorted.map(tr => (doc.get('tbody').append(tr)));
});

doc.get('tbody').addEventListener('click', (e) => {
  [...doc.getAll('tbody tr')].map(tr => tr.classList.remove('active'));
  e.target.closest('tr').classList.add('active');
});

doc.get('tbody').addEventListener('dblclick', (e) => {
  const input = doc.create('input');
  const replaced = e.target.innerText;

  input.value = replaced;
  input.style.textDecoration = 'underline #FF3028';
  input.classList.add('cell-input');

  e.target.innerHTML = '';
  e.target.appendChild(input);
  input.focus();

  const saveOnBlur = () => (input.value.length > 0
    && (e.target.innerHTML = input.value))
    || (e.target.innerHTML = replaced);

  input.addEventListener('blur', saveOnBlur);

  input.addEventListener('keypress', (keypress) => {
    keypress.key === 'Enter' && saveOnBlur();
  });
});

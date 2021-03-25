'use strict';

let th = [...document.querySelectorAll('thead th')];
let tr = [...document.querySelectorAll('tbody tr')];
const tbody = document.querySelector('tbody');
const button = document.querySelector('.save');

for (let j = 0; j < th.length; j++) {
  let count = 0;

  th[j].addEventListener('click', (e) => {
    const copy = [];

    for (let i = 0; i < tr.length; i++) {
      copy.push(tr[i].cloneNode(true));
    }

    if (copy[0].children[j].textContent[0] === '$') {
      if (count % 2 === 0) {
        copy.sort((a, b) =>
          parseInt(a.children[j].textContent.replace(/[^\d]/g, '')
          - (parseInt(b.children[j].textContent.replace(/[^\d]/g, '')))));
      } else {
        copy.sort((a, b) =>
          parseInt(b.children[j].textContent.replace(/[^\d]/g, '')
          - (parseInt(a.children[j].textContent.replace(/[^\d]/g, '')))));
      }
    } else {
      if (count % 2 === 0) {
        copy.sort((a, b) =>
          a.children[j].textContent.localeCompare(b.children[j].textContent));
      } else {
        copy.sort((a, b) =>
          b.children[j].textContent.localeCompare(a.children[j].textContent));
      }
    }

    for (let i = 0; i < tr.length; i++) {
      tr[i].replaceWith(copy[i]);
    }

    th = [...document.querySelectorAll('thead th')];
    tr = [...document.querySelectorAll('tbody tr')];
    count++;
  });
}

tbody.addEventListener('click', (e) => {
  const target = e.target;

  for (const item of tr) {
    item.classList.remove('active');
  }

  e.preventDefault();
  target.closest('tr').classList.add('active');
});

tbody.addEventListener('dblclick', (e) => {
  const target = e.target;
  const value = target.textContent;

  e.preventDefault();
  target.textContent = '';

  target.insertAdjacentHTML('afterbegin', `
    <input type="text" class="cell-input" value ="${value}">
  `);

  document.querySelector('.cell-input').style.width = '150px';
  document.querySelector('.cell-input').focus();

  document.querySelector('.cell-input').selectionStart
    = document.querySelector('.cell-input').value.length;

  document.querySelector('.cell-input').addEventListener('keydown',
    function() {
      if (event.keyCode === 13) {
        if (document.querySelector('.cell-input').value === '') {
          target.textContent = value;
        } else {
          target.textContent = document.querySelector('.cell-input').value;
        }
        document.querySelector('.cell-input').remove();
      }
    });

  document.querySelector('.cell-input').addEventListener('blur', function() {
    if (document.querySelector('.cell-input').value === '') {
      document.querySelector('.cell-input').replaceWith(value);
    } else {
      document.querySelector(
        '.cell-input').replaceWith(document.querySelector('.cell-input').value);
    }
  });
});

button.addEventListener('click', (e) => {
  const value = document.querySelector('#salary').value.split('');

  value.splice(-3, 0, ',');
  e.preventDefault();

  if (document.querySelector('#name').value.length < 4) {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="notification error" data-qa="notification">
        <h2 class="title">Error</h2>
        <p>The name cannot be shorter than 4 characters.</p>
      </div>
    `);
    setTimeout(() => document.querySelector('.error').remove(), 2000);
  } else if (+document.querySelector('#age').value < 18) {
    document.body.insertAdjacentHTML('beforeend', `
    <div class="notification error" data-qa="notification">
      <h2 class="title">Error</h2>
      <p>Age cannot be less than 18 years old.</p>
    </div>
    `);
    setTimeout(() => document.querySelector('.error').remove(), 2000);
  } else if (+document.querySelector('#position').value.length === 0) {
    document.body.insertAdjacentHTML('beforeend', `
    <div class="notification error" data-qa="notification">
      <h2 class="title">Error</h2>
      <p>Fill your position</p>
    </div>
    `);
    setTimeout(() => document.querySelector('.error').remove(), 2000);
  } else if (+document.querySelector('#age').value > 90) {
    document.body.insertAdjacentHTML('beforeend', `
    <div class="notification error" data-qa="notification">
      <h2 class="title">Error</h2>
      <p>Age cannot be more than 90 years old.</p>
    </div>
    `);
    setTimeout(() => document.querySelector('.error').remove(), 2000);
  } else {
    tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${document.querySelector('#name').value}</td>
      <td>${document.querySelector('#position').value}</td>
      <td>${document.querySelector('#office').value}</td>
      <td>${document.querySelector('#age').value}</td>
      <td>$${value.join('')}</td>
    </tr>
    `);

    document.body.insertAdjacentHTML('beforeend', `
      <div class="notification success" data-qa="notification">
        <h2 class="title">Success</h2>
        <p>Employee is here</p>
      </div>
    `);
    setTimeout(() => document.querySelector('.success').remove(), 2000);
  }
});

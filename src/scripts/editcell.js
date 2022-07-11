'use strict';

const tbody = document.querySelector('tbody');
const allTd = document.querySelectorAll('tbody td');

const editCell = () => {
  tbody.addEventListener('click', (e) => {
    const td = e.target.closest('td');
    const defaultValue = td.innerHTML;
    const input = document.createElement('input');

    input.classList.toggle('cell-input');

    if (!td.tagName) {
      return null;
    };

    const dblclickHand = () => {
      td.removeChild(td.firstChild);
      td.appendChild(input);
      input.focus();
    };

    td.addEventListener('dblclick', () => {
      td.removeChild(td.firstChild);
      td.appendChild(input);
      input.focus();
    });

    input.addEventListener('blur', () => {
      td.removeChild(td.firstChild);
      td.innerHTML = '';

      if (input.value === '') {
        td.appendChild(document.createTextNode(defaultValue));
      };
    });

    input.addEventListener('keypress', (ev) => {
      if (ev.key === 'Enter') {
        td.innerHTML = '';
        td.appendChild(document.createTextNode(input.value));
      }

      if (input.value === '') {
        td.appendChild(document.createTextNode(defaultValue));
      }
    });

    allTd.forEach(el => {
      el.addEventListener('click', () => {
        allTd.forEach(item => item
          .removeEventListener('dblclcik', dblclickHand));
        el.addEventListener('dblclick', dblclickHand);
      });
    });
  });
};

editCell();

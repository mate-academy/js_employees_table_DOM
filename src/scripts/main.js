'use strict';

const table = document.querySelector('tbody');
const persons = [...table.rows];

// sorting

function trimmer(salary) {
  return salary.replace(/\D/g, '');
};

function cleaner(coll, attr) {
  for (const th of coll) {
    th.removeAttribute(attr);
  };
}

document.addEventListener('click', e => {
  const target = e.target;

  if (target.tagName !== 'TH') {
    return;
  }

  if (!target.dataset.sorted || target.dataset.sorted === 'DESC') {
    persons.sort((a, b) => {
      switch (target.innerText) {
        case 'Name':
        case 'Position':
        case 'Office':
          return a.children[target.cellIndex].innerText
            .localeCompare(b.children[target.cellIndex].innerText);

        case 'Age':
          return +a.children[target.cellIndex].innerText
            - +b.children[target.cellIndex].innerText;

        case 'Salary':
          return trimmer(a.children[target.cellIndex].innerText)
            - trimmer(b.children[target.cellIndex].innerText);
      }
    });

    cleaner(document.querySelectorAll('th'), 'data-sorted');

    target.dataset.sorted = 'ASC';
  } else {
    persons.sort((a, b) => {
      switch (target.innerText) {
        case 'Name':
        case 'Position':
        case 'Office':
          return b.children[target.cellIndex].innerText
            .localeCompare(a.children[target.cellIndex].innerText);

        case 'Age':
          return +b.children[target.cellIndex].innerText
            - +a.children[target.cellIndex].innerText;

        case 'Salary':
          return trimmer(b.children[target.cellIndex].innerText)
            - trimmer(a.children[target.cellIndex].innerText);
      }
    });

    cleaner(document.querySelectorAll('th'), 'data-sorted');

    target.dataset.sorted = 'DESC';
  };

  table.append(...persons);
});

//selection of the row

table.addEventListener('click', e => {
  const toSelect = e.target.parentElement;

  for (const row of table.rows) {
    row.classList.remove('active');
  }

  toSelect.className = 'active';
});

'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
let nameClick = null;

table.addEventListener('click', sortPerson);

function sortPerson(e) {
  if(e.target.closest('thead')) {
    sortTable(e);
  }

  if(e.target.closest('tbody')) {
    addActiveClass(e.target)
  }
  
}


function sortTable(ev) {
  let doubleClick = true;

  if (nameClick === ev.target.textContent) {
    doubleClick = false;
  } 
  nameClick = ev.target.textContent;

  const theadArray = [...ev.target.closest('tr').children];
  const index = theadArray.findIndex(td => {
    return td.textContent === ev.target.textContent;
  });


  let container = [...tbody.children];

  container.sort((a, b) => {
    let aSort = a.children[index].textContent;
    let bSort = b.children[index].textContent;

    if (index > 2) {
      aSort = +aSort.replace(',', '').replace('$', '');
      bSort = +bSort.replace(',', '').replace('$', '');

      return aSort - bSort;
    }

    return aSort.localeCompare(bSort);
  });

  if (doubleClick) {
    container.forEach(person => tbody.append(person));
    return;
  }

  container.forEach(person => tbody.prepend(person));
}

function addActiveClass(a) {
  [...tbody.children].forEach(r => {
    if (r.className.includes('active')) {
      r.removeAttribute('class');
    }
  })

  a.closest('tr').className = 'active';
}
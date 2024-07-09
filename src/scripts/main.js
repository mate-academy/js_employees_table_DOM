'use strict';

const tableElement = document.querySelector('table');
let sortedValue = '';

tableElement.addEventListener('click', (e) => {
  const bodyElement = document.querySelector('tbody');
  const bodyRows = [...bodyElement.rows];
  let sortedData = [];
  const newBodyElement = document.createElement('tbody');

  const data = bodyRows.map((trElement) => {
    const newObject = {
      name: trElement.cells[0].textContent,
      position: trElement.cells[1].textContent,
      office: trElement.cells[2].textContent,
      age: trElement.cells[3].textContent,
      salary: trElement.cells[4].textContent,
    };

    return newObject;
  });

  bodyElement.remove();
  tableElement.tHead.after(newBodyElement);

  switch (e.target.textContent) {
    case 'Name': {
      sortedData = [...data].sort((el1, el2) => {
        return el1.name.toLowerCase().localeCompare(el2.name.toLowerCase());
      });

      if (sortedValue === 'Name') {
        sortedData.reverse();

        sortedValue = '';
        break;
      }

      sortedValue = e.target.textContent;

      break;
    }

    case 'Position': {
      sortedData = [...data].sort((el1, el2) => {
        return el1.position
          .toLowerCase()
          .localeCompare(el2.position.toLowerCase());
      });

      if (sortedValue === 'Position') {
        sortedData.reverse();

        sortedValue = '';
        break;
      }

      sortedValue = e.target.textContent;

      break;
    }

    case 'Office': {
      sortedData = [...data].sort((el1, el2) => {
        return el1.office.toLowerCase().localeCompare(el2.office.toLowerCase());
      });

      if (sortedValue === 'Office') {
        sortedData.reverse();

        sortedValue = '';

        break;
      }

      sortedValue = e.target.textContent;

      break;
    }

    case 'Age': {
      sortedData = [...data].sort((el1, el2) => +el1.age - +el2.age);

      if (sortedValue === 'Age') {
        sortedData.reverse();

        sortedValue = '';

        break;
      }

      sortedValue = e.target.textContent;

      break;
    }

    case 'Salary': {
      sortedData = [...data].sort(
        (el1, el2) =>
          +el1.salary.slice(1).split(',').join('') -
          +el2.salary.slice(1).split(',').join(''),
      );

      if (sortedValue === 'Salary') {
        sortedData.reverse();

        sortedValue = '';

        break;
      }

      sortedValue = e.target.textContent;

      break;
    }

    default: {
      sortedData = [...data];
    }
  }

  const newElements = sortedData.map((el) => {
    const trElement = document.createElement('tr');

    for (const property in el) {
      const thElement = document.createElement('td');

      thElement.textContent = el[property];
      trElement.append(thElement);
    }

    return trElement;
  });

  newElements.forEach((corEl) => {
    newBodyElement.append(corEl);
  });
});

/* eslint-disable prettier/prettier */
/* eslint-disable comma-dangle */
'use strict';

let currentSortField = '';

// HELPER function for sort people by one of categories
function sortPeopleArray(category) {
  // sorting an array to prepare it for rendering
  switch (category) {
    // by name
    case categories[0]: {
      fullPeopleData.sort((a, b) =>
        a[categories[0]].localeCompare(b[categories[0]]),);

      break;
    }

    // by position
    case categories[1]: {
      fullPeopleData.sort((a, b) =>
        a[categories[1]].localeCompare(b[categories[1]]),);
      break;
    }

    // by office
    case categories[2]: {
      fullPeopleData.sort((a, b) =>
        a[categories[2]].localeCompare(b[categories[2]]),);
      break;
    }

    // by age
    case categories[3]: {
      fullPeopleData.sort((a, b) => a[categories[3]] - b[categories[3]]);
      break;
    }

    // if we should sort by Salary, here will be some hardcode
    case categories[4]: {
      fullPeopleData.sort(
        (a, b) =>
          Number(a[categories[4]].slice(1).split(',').join('')) -
          Number(b[categories[4]].slice(1).split(',').join('')),
      );
      break;
    }
    default:
      break;
  }
}

function refillTable(newPeopleArray) {
  // preparing: we gonna delete all old Rows from our Table
  const oldBodyRows = Array.from(tableBody.querySelectorAll('tr'));

  oldBodyRows.map((row) => tableBody.removeChild(row));

  for (const person of newPeopleArray) {
    // first of all, we should create a new Row to append it to our table later
    const personRow = document.createElement('tr');

    // here we gonna create a new Cell (td)
    // for each single value of Person's parameters (name, salary etc.)
    for (const category in person) {
      const personCell = document.createElement('td');

      personCell.textContent = person[category];
      personRow.appendChild(personCell);
    }

    // and finally, append created Row to Table
    tableBody.appendChild(personRow);
  }
}

function reverseTableRows() {
  const reversedPeopleArray = fullPeopleData.reverse();

  refillTable(reversedPeopleArray);
}

// getting tableHead element
const tableHead = document.querySelector('thead tr');
// and tableBody as soon as
const tableBody = document.querySelector('tbody');

// getting all Rows from table (without Head)
const tableBodyRows = Array.from(tableBody.rows);

// preparing to create & fill an Array of people data (each person = object)
export const fullPeopleData = [];

// getting all Categories from Table columns (Name, Position, Age, Salary)
const categories = Array.from(tableHead.cells).map((data) => data.textContent);

// getting textContent (values) from each cell
// of every single row (rows represent here person data)
for (const data of tableBodyRows) {
  const personFullData = Array.from(data.cells).map((cell) =>
    cell.textContent.trim(),);

  const personObject = {};

  // adding info from every category to person's object
  // (f.e. Name => Anna; Salary => low)
  for (let i = 0; i < categories.length; i++) {
    personObject[categories[i]] = personFullData[i];
  }

  // finally, we gonna save a new Person Object to our array
  fullPeopleData.push(personObject);
}

// click handler for Categories (represented as cells in Table Head)
export const sortClickHandler = (e) => {
  e.preventDefault();

  // getting a name of column, which will be used to sort Person's data
  const category = e.target.closest('th').textContent;

  if (category === currentSortField) {
    reverseTableRows();
    currentSortField = '';

    return;
  }

  currentSortField = category;
  // sorting an array to prepare it for rendering
  sortPeopleArray(category);

  // and finally, we gotta fill the Table new data
  refillTable(fullPeopleData);
};

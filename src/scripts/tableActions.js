import { createElement } from './utils';

export function sortTableBody() {
  let lastSortIndex = null;

  return (tBody, column) => {
    const sortedRows = [...tBody.rows].sort((rowA, rowB) => {
      if (column < 3) {
        const stringA = rowA.cells[column].textContent;
        const stringB = rowB.cells[column].textContent;

        return lastSortIndex !== column
          ? stringA.localeCompare(stringB)
          : stringB.localeCompare(stringA);
      }

      const numA = rowA.cells[column].textContent.replace(/[^0-9.-]+/g, '');
      const numB = rowB.cells[column].textContent.replace(/[^0-9.-]+/g, '');

      return lastSortIndex !== column ? numA - numB : numB - numA;
    });

    tBody.append(...sortedRows);
    lastSortIndex = lastSortIndex !== column ? column : null;
  };
}

export function addRow(t, data) {
  const row = document.createElement('tr');

  row.append(
    createElement('td', data.get('name')),
    createElement('td', data.get('position')),
    createElement('td', data.get('office')),
    createElement('td', data.get('age')),
    createElement('td', '$' + (+data.get('salary')).toLocaleString('en-US')),
  );

  t.append(row);
}

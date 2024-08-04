'use strict';

export const sort = (tableHead, tableBody) => {
  const Orders = {
    ASC: 'asc',
    DESC: 'desc',
  };

  const sortState = {
    header: '',
    order: '',
  };

  const column = ['name', 'position', 'office', 'age', 'salary'];

  tableHead.addEventListener('click', (evt) => {
    if (evt.target.tagName !== 'TH') {
      return;
    }

    const type = evt.target.textContent.toLowerCase();

    if (type !== sortState.header) {
      sortState.header = type;
      sortState.order = Orders.ASC;
    } else if (type === sortState.header && sortState.order === Orders.ASC) {
      sortState.order = Orders.DESC;
    } else {
      sortState.order = Orders.ASC;
    }

    const sortColumnIndex = column.indexOf(type);
    const sortRows = [...tableBody.children].sort((first, second) => {
      const firstValue = first.children[sortColumnIndex].textContent;
      const secondValue = second.children[sortColumnIndex].textContent;
      let res = 0;

      switch (sortColumnIndex) {
        case 0:
        case 1:
        case 2:
          res = firstValue.localeCompare(secondValue);
          break;
        case 3:
          res = +firstValue - +secondValue;
          break;
        case 4:
          res =
            +firstValue.slice(1).split(',').join('') -
            +secondValue.slice(1).split(',').join('');
          break;
        default:
          res = 0;
      }

      return Orders.ASC === sortState.order ? res : res * -1;
    });

    sortRows.forEach((row) => tableBody.append(row));
  });
};

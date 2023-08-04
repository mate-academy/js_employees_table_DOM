'use strict';

const { sortTable } = require('./sortTable');
const { selectTableRow } = require('./selectTableRow');

/* eslint-disable-next-line no-shadow */
const handleTableEvents = (event) => {
  sortTable(event);
  selectTableRow(event);
};

module.exports = { handleTableEvents };

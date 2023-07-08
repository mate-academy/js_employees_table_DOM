'use strict';

const tesIfIncludesNumbers = (string) => {
  const numberRegEx = /\d/g;

  return numberRegEx.test(string);
};

const sortAscending = (a, b) => {
  if (tesIfIncludesNumbers(a)) {
    return +a.replace(/[$,]/g, '') - +b.replace(/[$,]/g, '');
  } else {
    return a.localeCompare(b);
  }
};

const sortDescending = (a, b) => {
  if (tesIfIncludesNumbers(a)) {
    return +b.replace(/[$,]/g, '') - +a.replace(/[$,]/g, '');
  } else {
    return b.localeCompare(a);
  }
};

module.exports = {
  sortAscending,
  sortDescending,
};

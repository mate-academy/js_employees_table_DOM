'use strict';

const tesIfIncludesNumbers = (string) => {
  const numberRegEx = /\d/g;

  return numberRegEx.test(string);
};

const sort = (a, b) => {
  if (tesIfIncludesNumbers(a)) {
    return +a.replace(/[$,]/g, '') - +b.replace(/[$,]/g, '');
  } else {
    return a.localeCompare(b);
  }
};

module.exports = {
  sort,
};

'use strict';

const capitalizeWord = (word) => {
  const firstLetter = word[0].toUpperCase();
  const restWord = word.slice(1);

  return `${firstLetter}${restWord}`;
};

module.exports = { capitalizeWord };

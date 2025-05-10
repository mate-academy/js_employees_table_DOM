'use strict';

function triplify(str) {
  const triplifyed = [];
  let digitsProcessed = 0;

  for (let i = str.length - 1; i >= 0; i--) {
    triplifyed.push(str[i]);
    digitsProcessed++;

    if (digitsProcessed % 3 === 0
      && i !== 0) {
      triplifyed.push(',');
    }
  }

  triplifyed.reverse();

  return triplifyed.join('');
}

module.exports = triplify;

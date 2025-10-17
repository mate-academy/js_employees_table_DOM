// tableSort/compare.js
import {
  convertToNumber,
  hasInvalidTD,
  hasInvalidNumber,
} from '../utils/utils.js';

export function buildComparator(index, type, descending) {
  if (type === 'number') {
    return function cmpNumber(trA, trB) {
      if (hasInvalidTD(trA.cells[index], trB.cells[index])) {
        return 0;
      }

      const numberA = convertToNumber(trA.cells[index].textContent);
      const numberB = convertToNumber(trB.cells[index].textContent);

      if (hasInvalidNumber(numberA, numberB)) {
        return 0;
      }

      return descending ? numberA - numberB : numberB - numberA;
    };
  }

  return function cmpString(trA, trB) {
    if (hasInvalidTD(trA.cells[index], trB.cells[index])) {
      return 0;
    }

    const stringA = trA.cells[index].textContent.trim();
    const stringB = trB.cells[index].textContent.trim();

    return descending
      ? stringA.localeCompare(stringB)
      : stringB.localeCompare(stringA);
  };
}

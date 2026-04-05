export const compareValues = (a, b, isNumeric) => {
  if (isNumeric) {
    return Number(a) - Number(b);
  }

  return String(a).localeCompare(String(b), undefined, { sensitivity: 'base' });
};

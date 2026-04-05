import { NUMERIC_VALUES } from '../constants';

export const extractTableData = (rows, orderFields) => {
  return Array.from(rows).map((tr) => {
    const dataObj = Array.from(tr.children).reduce((acc, td, idx) => {
      const key = orderFields[idx];
      const value = td.textContent.trim();

      if (NUMERIC_VALUES.includes(key)) {
        const n = Number(value);

        acc[key] = Number.isFinite(n) ? n : value;
      } else {
        acc[key] = value;
      }

      return acc;
    }, {});

    return dataObj;
  });
};

'use strict';

const formatNumberToSalary = (number) => {
  if (typeof number !== 'number') {
    return;
  }

  const formattedSalary = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
    .format(number)
    .replace('.00', '');

  return formattedSalary;
};

const parseSalaryToNumber = (salary) => {
  if (typeof salary === 'number') {
    return;
  }

  return parseFloat(salary.replace(/[^\d.-]/g, ''));
};

module.exports = {
  formatNumberToSalary,
  parseSalaryToNumber,
};

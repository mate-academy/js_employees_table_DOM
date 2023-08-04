'use strict';

const salaryParser = (salary) => {
  if (typeof salary === 'number') {
    const formattedSalary = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    })
      .format(salary)
      .replace('.00', '');

    return formattedSalary;
  }

  return parseFloat(salary.replace(/[^\d.-]/g, ''));
};

module.exports = { salaryParser };

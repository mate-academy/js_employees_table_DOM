export const salaryToNumber = (salary) => salary.replace(/[$,]/g, '');

export const numberToSalary = (number) => {
  let result = '';
  let counter = 0;

  const numberToString = String(number);

  for (let i = numberToString.length - 1; i >= 0; i--) {
    result += numberToString[i];
    counter += 1;

    if (counter % 3 === 0 && i !== 0) {
      result += ',';
    }
  }

  result = `$${result.split('').reverse().join('')}`;

  return result;
};

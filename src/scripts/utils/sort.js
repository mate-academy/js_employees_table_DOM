import { salaryToNumber } from './formatSalary';

export const sorArrayOfObjecsByNumber = (arr, key, type = 'asc') =>
  type === 'asc'
    ? [...arr].sort((a, b) => a[key] - b[key])
    : [...arr].sort((a, b) => b[key] - a[key]);

export const sorArrayOfObjectsByString = (arr, key, type = 'asc') =>
  type === 'asc'
    ? [...arr].sort((a, b) => a[key].localeCompare(b[key]))
    : [...arr].sort((a, b) => b[key].localeCompare(a[key]));

export const sortBySalary = (employees, type = 'asc') => {
  if (type === 'asc') {
    return [...employees].sort(
      (a, b) => salaryToNumber(a.salary) - salaryToNumber(b.salary),
    );
  }

  return [...employees].sort(
    (a, b) => salaryToNumber(b.salary) - salaryToNumber(a.salary),
  );
};

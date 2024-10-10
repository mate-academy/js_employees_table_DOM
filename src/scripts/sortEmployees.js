import {
  sorArrayOfObjecsByNumber,
  sorArrayOfObjectsByString,
} from './utils/sort';

const salaryToNumber = (salary) => salary.replace(/[$,]/g, '');

const sortBySalary = (employees, type = 'asc') => {
  if (type === 'asc') {
    return [...employees].sort(
      (a, b) => salaryToNumber(a.salary) - salaryToNumber(b.salary),
    );
  }

  return [...employees].sort(
    (a, b) => salaryToNumber(b.salary) - salaryToNumber(a.salary),
  );
};

class SortEmployees {
  sortEmployees(employees, type, sortType) {
    switch (type) {
      case 'name':
      case 'position':
      case 'office':
        return sorArrayOfObjectsByString(employees, type, sortType);
      case 'age':
        return sorArrayOfObjecsByNumber(employees, type, sortType);
      case 'salary':
        return sortBySalary(employees, sortType);

      default:
        throw new Error('Wrong type!');
    }
  }
}

const sortEmployees = new SortEmployees();

export default sortEmployees;

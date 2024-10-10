import {
  sorArrayOfObjecsByNumber,
  sorArrayOfObjectsByString,
  sortBySalary,
} from './utils/sort';

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

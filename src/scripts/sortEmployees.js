const salaryToNumber = (salary) => salary.replace(/[$,]/g, '');

export const sortBySalary = (employees) =>
  [...employees].sort(
    (a, b) => salaryToNumber(a.salary) - salaryToNumber(b.salary),
  );

class SortEmployees {
  employees = [];
  name = 'ASC';
  position = 'ASC';
  office = 'ASC';
  age = 'ASC';
  salary = 'ASC';
}

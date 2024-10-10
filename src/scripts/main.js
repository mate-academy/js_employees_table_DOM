'use strict';

// import drawEmployeeView from './employeeView';
import employees from './getEmployeesData';

import { sortBySalary } from './sortEmployees';
import {
  sorArrayOfObjecsByNumber,
  sorArrayOfObjectsByString,
} from './utils/sort';

import employeeView from './employeeView';

const theads = document.querySelectorAll('thead tr');

theads.forEach((thead) => {
  thead.addEventListener('click', (e) => {
    const type = e.target.textContent.toLowerCase();

    switch (type) {
      case 'name':
        return employeeView.drawEmployeeView(
          sorArrayOfObjectsByString(employees, type),
        );
      case 'position':
        return employeeView.drawEmployeeView(
          sorArrayOfObjectsByString(employees, type),
        );
      case 'office':
        return employeeView.drawEmployeeView(
          sorArrayOfObjectsByString(employees, type),
        );
      case 'age':
        return employeeView.drawEmployeeView(
          sorArrayOfObjecsByNumber(employees, type),
        );
      case 'salary':
        return employeeView.drawEmployeeView(sortBySalary(employees));

      default:
        throw new Error('Wrong type!');
    }
  });
});

'use strict';

import { THEAD } from './constants/DomElements';
import EmployeeView from './employeeView';
import sortEmployees from './sortEmployees';

class Employee extends EmployeeView {
  active = null;

  sortType = {
    name: 'asc',
    position: 'asc',
    office: 'asc',
    age: 'asc',
    salary: 'asc',
  };

  constructor() {
    super();
    this.addListener();
    this.sortEmployees = sortEmployees.sortEmployees;
  }

  addListener() {
    THEAD.addEventListener('click', (e) => {
      const target = e.target;
      const type = target.textContent.toLowerCase();

      this.setSortType(type);

      this.employees = this.sortEmployees(
        this.employees,
        type,
        this.sortType[type],
      );

      this.drawEmployeeView(this.employees);
    });
  }

  setSortType(type) {
    if (type !== this.active) {
      this.sortType[type] = 'asc';
      this.active = type;

      return;
    }

    this.sortType[type] = this.sortType[type] === 'asc' ? 'desc' : 'asc';
    this.active = type;
  }
}

const employee = new Employee();

export default employee;

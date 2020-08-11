'use strict';

const WARNING = {
  NAME: 'The name must be at least 4 characters long!!!',
  POSITION: 'Please enter your position!!!',
  OFFICE: 'Please select your office!!!',
  AGE: 'Age must be less than 18 or bigger than 90!!!',
  SALARY: 'Salary must be a number!!!',
};

const ERROR = 'Wrong Information. Please check info.!!!';
const SUCCESS = 'Congratulations. New Employee is append :)';

module.exports = {
  WARNING,
  ERROR,
  SUCCESS,
};

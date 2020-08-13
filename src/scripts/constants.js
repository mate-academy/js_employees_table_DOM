'use strict';

const WARNING_MESSAGE = {
  NAME: 'The name must be at least 4 characters long!!!',
  POSITION: 'Please enter your position!!!',
  OFFICE: 'Please select your office!!!',
  AGE: 'Age must be less than 18 or bigger than 90!!!',
  SALARY: 'Salary must be a number!!!',
};

const ERROR_MESSAGE = 'Wrong Information. Please check info.!!!';
const SUCCESS_MESSAGE = 'Congratulations. New Employee is append :)';

const MIN_LENGTH_OF_NAME = 4;

const MIN_AGE = 18;
const MAX_AGE = 90;

const NUMBER_OF_ENTERED_INFO = 5;

const TABLE_HEADER = {
  name: 'Name',
  position: 'Position',
  office: 'Office',
  age: 'Age',
  salary: 'Salary',
};

const OPTIONS = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco'];

const EMPLOYEES_FORM_ELEMENTS = {
  name: {
    name: 'name',
    type: 'text',
    placeholder: 'Name',
  },
  position: {
    name: 'position',
    type: 'text',
    placeholder: 'Position',
  },
  office: {
    name: 'office',
    placeholder: 'Office',
  },
  age: {
    name: 'age',
    type: 'number',
    placeholder: 'Age',
  },
  salary: {
    name: 'salary',
    type: 'number',
    placeholder: 'Salary',
  },
};

module.exports = {
  WARNING_MESSAGE,
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  MIN_LENGTH_OF_NAME,
  MIN_AGE,
  MAX_AGE,
  NUMBER_OF_ENTERED_INFO,
  TABLE_HEADER,
  EMPLOYEES_FORM_ELEMENTS,
  OPTIONS,
};

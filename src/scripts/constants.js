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

const MIN_LENGTH = 4;

const MIN_AGE = 18;
const MAX_AGE = 90;

const STATIC_INPUT_VALUE = 5;

const FORM_FIELD = {};

module.exports = {
  WARNING,
  ERROR,
  SUCCESS,
  MIN_LENGTH,
  MIN_AGE,
  MAX_AGE,
  STATIC_INPUT_VALUE,
  FORM_FIELD,
};

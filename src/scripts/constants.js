export const ACTION_TYPES = {
  ADD: 'add',
  UPDATE: 'update',
  DELETE: 'delete',
  SORT: 'sort',
};

export const VALIDATION_RULES = {
  MAX_AGE: 90,
  MIN_AGE: 18,
  MIN_NAME_LENGTH: 4,
  MIN_SALARY: 0,
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
};

export const AGE = 'age';
export const SALARY = 'salary';
export const NUMERIC_VALUES = [AGE, SALARY];

export const ASCENDING = 'asc';
export const DESCENDING = 'desc';

export const KEYS = {
  NAME: 'name',
  POSITION: 'position',
  OFFICE: 'office',
  AGE: 'age',
  SALARY: 'salary',
  ID: 'id',
};

export const ORDER_FIELDS = [
  KEYS.NAME,
  KEYS.POSITION,
  KEYS.OFFICE,
  KEYS.AGE,
  KEYS.SALARY,
];

export const LABELS = {
  NAME: 'Name',
  POSITION: 'Position',
  OFFICE: 'Office',
  AGE: 'Age',
  SALARY: 'Salary',
};

export const OFFICES = {
  TOKYO: 'Tokyo',
  SINGAPORE: 'Singapore',
  LONDON: 'London',
  NEW_YORK: 'New York',
  EDINBURGH: 'Edinburgh',
  SAN_FRANCISCO: 'San Francisco',
};

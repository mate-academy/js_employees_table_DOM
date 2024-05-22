export const HEADER_NAME = 'name';
export const HEADER_POSITION = 'position';
export const HEADER_OFFICE = 'office';
export const HEADER_AGE = 'age';
export const HEADER_SALARY = 'salary';

export const ORDER_ASC = 'asc';
export const ORDER_DESC = 'desc';

export const TAG_INPUT = 'input';
export const TAG_SELECT = 'select';

export const TYPE_TEXT = 'text';
export const TYPE_NUMBER = 'number';

export const employeeFields = [
  {
    tag: TAG_INPUT,
    nameValue: HEADER_NAME,
    type: TYPE_TEXT,
    required: true,
  },
  {
    tag: TAG_INPUT,
    nameValue: HEADER_POSITION,
    type: TYPE_TEXT,
    required: true,
  },
  {
    tag: TAG_SELECT,
    nameValue: HEADER_OFFICE,
    required: true,
    options: [
      {
        town: 'Tokyo',
        selected: true,
      },
      {
        town: 'Singapure',
      },
      {
        town: 'London',
      },
      {
        town: 'New York',
      },
      {
        town: 'Edinburgh',
      },
      {
        town: 'San Francisco',
      },
    ],
  },
  {
    tag: TAG_INPUT,
    nameValue: HEADER_AGE,
    type: TYPE_NUMBER,
    required: true,
  },
  {
    tag: TAG_INPUT,
    nameValue: HEADER_SALARY,
    type: TYPE_NUMBER,
    required: true,
  },
];

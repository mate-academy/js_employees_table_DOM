import { OFFICES, VALIDATION_RULES } from '../constants';
import { normalizeNumberString } from '../utils/formatter';

const required = (msg = 'field is required') => {
  return (v) =>
    v === null || v === undefined || String(v) === '' ? msg : null;
};

const minLen = (len, msg = `min length is ${len}`) => {
  return (v) => (String(v || '').trim().length >= len ? null : msg);
};

const isInteger = (msg = 'must be an integer') => {
  return (v) => {
    if (v === '' || v === null) {
      return null;
    }

    const n = Number(String(v).trim());

    return Number.isFinite(n) && Number.isInteger(n) ? null : msg;
  };
};

const inRange = (min, max, msg = `value must be between ${min} - ${max}`) => {
  return (v) => {
    if (v === '' || v === null) {
      return null;
    }

    const n = Number(String(v).trim());

    return Number.isFinite(n) && n >= min && n <= max ? null : msg;
  };
};

const isNormalizedNumber = (msg = 'must be a number') => {
  return (v) => {
    if (v === '' || v === null) {
      return null;
    }

    const normalized = normalizeNumberString(v);
    const n = Number(normalized);

    return Number.isFinite(n) ? null : msg;
  };
};

const isNonNegativeNumber = (msg = 'must be a positive number') => {
  return (v) => {
    if (v == null || v === '') {
      return null;
    }

    const normalized = normalizeNumberString(v);
    const n = Number(normalized);

    return Number.isFinite(n) && n >= 0 ? null : msg;
  };
};

const inList = (list, msg = `Incorrect option`) => {
  if (Array.isArray(list)) {
    return (v) => (list.includes(v) ? null : msg);
  }

  return (v) => (Object.values(list).includes(v) ? null : msg);
};

export const RULES = {
  name: [
    required('Name is required'),
    minLen(
      VALIDATION_RULES.MIN_NAME_LENGTH,
      `Minimum name length is ${VALIDATION_RULES.MIN_NAME_LENGTH}`,
    ),
  ],
  position: [required('Position is required')],
  office: [
    required('Office is required'),
    inList(OFFICES, 'Invalid office name'),
  ],
  age: [
    required('Age is required'),
    isInteger('Age must be an integer'),
    inRange(18, 90, 'Age must be between 18 and 90'),
  ],
  salary: [
    required('Salary is required'),
    isNormalizedNumber('Salary must be a valid number'),
    isNonNegativeNumber('Salary must be non negative number'),
  ],
};

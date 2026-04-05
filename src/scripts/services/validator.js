import { RULES } from './validators';

export const validateEmployeeData = (formData) => {
  const errors = {};

  for (const field of Object.keys(RULES)) {
    const validators = RULES[field];
    const fieldName = formData[field];

    for (const fn of validators) {
      const err = fn(fieldName);

      if (err && !errors[field]) {
        errors[field] = err;
      }
    }
  }

  const valid = Object.keys(errors).length === 0;
  const cleanedData = valid ? formData : null;

  return { valid, errors, cleanedData };
};

export const validateEmployeeFiled = ({ field, finalValue }) => {
  const errors = RULES[field].reduce((acc, rule, idx) => {
    const error = rule(finalValue);

    if (error) {
      return { ...acc, [field + `_error-${idx + 1}`]: error };
    }

    return { ...acc };
  }, {});

  const valid = Object.keys(errors).length === 0;

  return { valid, errors, newEmployeeField: finalValue };
};

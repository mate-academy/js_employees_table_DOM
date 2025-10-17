import {
  validateFullName,
  validatePosition,
  validateOffice,
  validateAge,
  validateSalary,
} from '../validators/validators';

export const checkFormInputs = ({
  fullName,
  position,
  office,
  age,
  salary,
} = {}) => {
  const validators = {
    fullName: validateFullName,
    position: validatePosition,
    office: validateOffice,
    age: validateAge,
    salary: validateSalary,
  };

  const values = {
    fullName,
    position,
    office,
    age,
    salary,
  };
  const errors = [];

  for (const [key, validateFn] of Object.entries(validators)) {
    const error = validateFn(values[key]);

    if (error) {
      errors.push(error);
    }
  }

  return errors;
};

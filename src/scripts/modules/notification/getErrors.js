'use strict';

const getErrors = (data) => {
  const errors = [];

  const isSomeEmptyField = Object.values(data).some(value => !value);

  if (isSomeEmptyField) {
    errors.push({
      title: 'All fields are required',
      description: 'Please fill in all fields of the form',
    });

    return errors;
  }

  const wrongName = data.name.length < 4;
  const wrongAge = data.age < 18 || data.age > 90;

  if (wrongName) {
    const nameError = {
      title: 'Wrong name',
      description: 'The name should have at least 4 characters',
    };

    errors.push(nameError);
  }

  if (wrongAge) {
    const ageError = {
      title: 'Wrong age',
      description: 'The age should be between 18 and 90 years old',
    };

    errors.push(ageError);
  }

  return errors;
};

module.exports = { getErrors };

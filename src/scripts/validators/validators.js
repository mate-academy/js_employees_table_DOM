// src/scripts/validators/validators.js
export function validateAge(age) {
  if (age == null || age === '') {
    return {
      title: 'Age',
      message: 'Age is required.',
    };
  }

  const num = Number(age);

  if (Number.isNaN(num) || !Number.isFinite(num)) {
    return {
      title: 'Age',
      message: 'Age must be a valid number.',
    };
  }

  if (!Number.isInteger(num)) {
    return {
      title: 'Age',
      message: 'Age must be an integer.',
    };
  }

  if (num < 18 || num > 90) {
    return {
      title: 'Age',
      message: 'Age must be between 18 and 90 years old.',
    };
  }

  return false;
}

export function validateFullName(fullName) {
  if (fullName == null || fullName === '') {
    return {
      title: 'Full Name',
      message: 'Full name is required.',
    };
  }

  if (typeof fullName !== 'string') {
    return {
      title: 'Full Name',
      message: 'Full name must be a string.',
    };
  }

  const len = fullName.trim().length;

  if (len < 4 || len > 40) {
    return {
      title: 'Full Name',
      message: 'Name must be between 4 and 40 characters long.',
    };
  }

  return false;
}

export function validatePosition(position) {
  if (position == null || position === '') {
    return {
      title: 'Position',
      message: 'Position is required.',
    };
  }

  if (typeof position !== 'string') {
    return {
      title: 'Position',
      message: 'Position must be a string.',
    };
  }

  const len = position.trim().length;

  if (len < 2 || len > 40) {
    return {
      title: 'Position',
      message: 'Position must be between 2 and 40 characters long.',
    };
  }

  return false;
}

export function validateSalary(salary) {
  if (salary == null || salary === '') {
    return {
      title: 'Salary',
      message: 'Salary is required.',
    };
  }

  const num = Number(salary);

  if (Number.isNaN(num) || !Number.isFinite(num)) {
    return {
      title: 'Salary',
      message: 'Salary must be a valid number.',
    };
  }

  if (num < 0 || num > 1_000_000) {
    return {
      title: 'Salary',
      message: 'Salary must be between 0 and 1,000,000.',
    };
  }

  return false;
}

export function validateOffice(office) {
  if (office == null || office === '') {
    return {
      title: 'Office',
      message: 'Office can not be empty.',
    };
  }

  if (typeof office === 'string' && office.trim().length === 0) {
    return {
      title: 'Office',
      message: 'Office can not be empty.',
    };
  }

  return false;
}

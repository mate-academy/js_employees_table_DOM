import { formatCurrency } from './formatCurrency';
import { pushNotification } from './pushNotification';
import { tbody } from './variables';

const addDataToTable = (employeInfo) => {
  const tr = document.createElement('tr');

  Object.values(employeInfo).forEach((cellData) => {
    const td = document.createElement('td');

    td.innerText = String(cellData);
    tr.append(td);
  });

  tbody.append(tr);
};

export const handleFormSubmission = () => {
  const form = document.querySelector('.new-employee-form');
  const formData = new FormData(form);
  const values = Object.fromEntries(formData.entries());

  if (values.name.length < 4) {
    pushNotification(
      20,
      20,
      'Name field error',
      'Name must be at least 4 characters long.',
      'error',
    );

    return null;
  }

  if (values.position.length < 4) {
    pushNotification(
      20,
      20,
      'Position field error',
      'Position must be at least 4 characters long.',
      'error',
    );

    return null;
  }

  if (values.age < 18 || values.age > 90) {
    pushNotification(
      20,
      20,
      'Age field error',
      'Age must be between 18 and 90.',
      'error',
    );

    return null;
  }

  const salary = formatCurrency(values.salary);

  if (!salary) {
    pushNotification(
      20,
      20,
      'Salary field error',
      'Salary must be a positive number.',
      'error',
    );

    return null;
  } else {
    values.salary = salary;
  }

  addDataToTable(values);

  pushNotification(
    20,
    20,
    'Successfully added',
    `Employee ${values.name} was successfully added to the table`,
    'success',
  );

  form.reset();

  return values;
};

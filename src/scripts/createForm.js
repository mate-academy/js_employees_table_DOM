import { createNotification } from './createNotification';

const createField = ({ fieldName, tag = 'input', type = 'text', options }) => {
  const label = document.createElement('label');
  let element;

  switch (tag) {
    case 'select':
      element = document.createElement('select');

      options.forEach((value) => {
        const option = document.createElement('option');

        option.textContent = value;
        option.value = value;
        element.append(option);
      });
      break;
    default:
      element = document.createElement('input');
      element.type = type;
  }

  label.textContent = `${fieldName[0].toUpperCase()}${fieldName.slice(1)}: `;

  element.name = fieldName;

  element.setAttribute('data-qa', fieldName);
  element.required = true;
  label.append(element);

  return label;
};

const createCell = (content) => {
  const td = document.createElement('td');

  td.textContent = content;

  return td;
};

export const createForm = (body, tableBody) => {
  const form = document.createElement('form');
  const submitBtn = document.createElement('button');

  submitBtn.addEventListener('click', (evt) => {
    evt.preventDefault();

    const {
      name: initials,
      position,
      office,
      age,
      salary,
    } = Object.fromEntries(new FormData(form));

    if (!initials || !position || !age || !salary) {
      body.append(createNotification('All fields are required', 'error'));

      return;
    }

    if (initials.length < 4) {
      body.append(
        createNotification('Name must have at least 4 letters', 'error'),
      );

      return;
    }

    if (age < 18 || age > 90) {
      body.append(createNotification('Age must be between 18 and 90', 'error'));

      return;
    }

    body.append(
      createNotification('New employee added successfully', 'success'),
    );

    const newRow = document.createElement('tr');

    newRow.append(createCell(initials));
    newRow.append(createCell(position));
    newRow.append(createCell(office));
    newRow.append(createCell(age));
    newRow.append(createCell('$' + (+salary).toLocaleString('en-US')));

    tableBody.append(newRow);
    form.reset();
  });

  submitBtn.type = 'submit';
  submitBtn.textContent = 'Save to table';

  form.classList.add('new-employee-form');

  const offices = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  form.append(
    createField({
      fieldName: 'name',
    }),
  );

  form.append(
    createField({
      fieldName: 'position',
    }),
  );

  form.append(
    createField({
      fieldName: 'office',
      tag: 'select',
      options: offices,
    }),
  );

  form.append(
    createField({
      fieldName: 'age',
      type: 'number',
    }),
  );

  form.append(
    createField({
      fieldName: 'salary',
      type: 'number',
    }),
  );

  form.append(submitBtn);

  return form;
};

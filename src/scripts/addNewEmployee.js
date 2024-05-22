'use strict';
import { tableBody } from './constants';

export function addNewEmployee(formElements) {
  const row = document.createElement('tr');
  const nameCell = document.createElement('td');
  const positionCell = document.createElement('td');
  const officeCell = document.createElement('td');
  const ageCell = document.createElement('td');
  const salaryCell = document.createElement('td');

  nameCell.textContent = formElements.name.value;
  positionCell.textContent = formElements.position.value;
  officeCell.textContent = formElements.office.value;
  ageCell.textContent = formElements.age.value;

  salaryCell.textContent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(+formElements.salary.value);

  row.appendChild(nameCell);
  row.appendChild(positionCell);
  row.appendChild(officeCell);
  row.appendChild(ageCell);
  row.appendChild(salaryCell);

  tableBody.appendChild(row);
}

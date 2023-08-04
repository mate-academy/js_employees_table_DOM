'use strict';

/* eslint-disable no-shadow */
const { salaryParser } = require('../../utils');

const getInputType = (data) => {
  const isNumber = !Number.isNaN(salaryParser(data)) || !Number.isNaN(+data);

  return isNumber ? 'number' : 'text';
};

const saveChanges = (tableData, prevValue, valueToChange) => {
  const newValue = valueToChange || prevValue;

  if (prevValue.startsWith('$')) {
    const newSalary = salaryParser(+newValue);

    if (newSalary.slice(1) === 'NaN') {
      tableData.textContent = prevValue;

      return;
    }

    tableData.textContent = salaryParser(+newValue);

    return;
  }

  tableData.textContent = newValue;
};

const onBlur = (event, tableData, prevValue) => {
  saveChanges(tableData, prevValue, event.target.value);
};

const onKeyPress = (tableData, prevValue) => {
  tableData.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Enter') {
        saveChanges(tableData, prevValue, event.target.value);
      }

      if (event.key === 'Escape') {
        tableData.textContent = prevValue;
      }
    },
  );
};

const replaceDataToInput = (tableData) => {
  const value = tableData.textContent;

  const input = document.createElement('input');
  const inputType = getInputType(value);

  input.className = 'cell-input';
  input.type = inputType;
  input.value = salaryParser(value) || value;

  tableData.innerHTML = '';

  tableData.appendChild(input);
  input.focus();

  input.addEventListener(
    'blur',
    (event) => onBlur(event, tableData, value),
    { once: true }
  );
};

const editTableData = (event) => {
  event.preventDefault();

  const targetItem = event.target;
  const table = event.currentTarget;
  const tableBody = table.querySelector('tbody');

  const tableData = targetItem.closest('td');

  if (!tableData || !tableBody.contains(tableData)) {
    return;
  }

  const prevValue = tableData.textContent;

  const dataInput = tableData.querySelector('.cell-input');

  if (!dataInput) {
    replaceDataToInput(tableData);
  }

  onKeyPress(tableData, prevValue);
};

module.exports = { editTableData };

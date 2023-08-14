'use strict';

/* eslint-disable no-shadow */
const { parseSalaryToNumber, formatNumberToSalary } = require('../../utils');

const getNewValue = (prevValue, valueToChange) => {
  const parsedPrevValue = +prevValue;
  const parsedValueToChange = +valueToChange;

  const isNumber = !isNaN(parsedPrevValue) && !isNaN(parsedValueToChange);
  const isCorrectAge = parsedValueToChange >= 18 && parsedValueToChange <= 90;

  if (isNumber) {
    return isCorrectAge
      ? parsedValueToChange
      : parsedPrevValue;
  }

  return valueToChange.trim() || prevValue.trim();
};

const getInputType = (data) => {
  const isNumber = !isNaN(parseSalaryToNumber(data)) || !isNaN(+data);

  return isNumber ? 'number' : 'text';
};

const saveChanges = (tableData, prevValue, valueToChange) => {
  const newValue = getNewValue(prevValue, valueToChange);

  if (prevValue.startsWith('$')) {
    const newSalary = formatNumberToSalary(+newValue);

    if (newSalary.slice(1) === 'NaN') {
      tableData.textContent = prevValue;

      return;
    }

    tableData.textContent = newSalary;

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
  input.value = parseSalaryToNumber(value) || value;

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

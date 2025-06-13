import { pushNotification } from './pushNotification';
import { formatCurrency } from './formatCurrency';
import { theadRow } from './variables';

export const updateCell = (
  selectedCell,
  cellInput,
  initText,
  column,
  employerName,
) => {
  const changedProperty = theadRow.children[column].innerText;
  const inputValue = cellInput.value?.trim();

  cellInput.remove();

  if (!inputValue) {
    selectedCell.innerText = initText;

    return pushNotification(
      20,
      20,
      'Update cell error',
      'Cell cannot be empty, initial value set',
      'error',
    );
  }

  let newValue;

  switch (column) {
    case 0:
    case 1:
    case 2:
      if (inputValue.length < 4) {
        selectedCell.innerText = initText;

        return pushNotification(
          20,
          20,
          'Update cell error',
          `Cell ${changedProperty} must contain more than 4 characters`,
          'error',
        );
      }
      newValue = inputValue;
      break;
    case 3:
      const age = Number(inputValue);

      if (isNaN(age) || age < 18 || age > 90) {
        selectedCell.innerText = initText;

        return pushNotification(
          20,
          20,
          'Update cell error',
          `Cell ${changedProperty} must be from 18 to 90`,
          'error',
        );
      }
      newValue = String(age);
      break;
    case 4:
      newValue = formatCurrency(inputValue);

      if (!newValue) {
        selectedCell.innerText = initText;

        return pushNotification(
          20,
          20,
          'Update cell error',
          `Invalid ${changedProperty}, initial value set`,
          'error',
        );
      }
      break;
  }

  selectedCell.innerText = newValue;

  pushNotification(
    20,
    20,
    'Cell successfully updated',
    `${changedProperty} for employee ${employerName} has been changed`,
  );
};

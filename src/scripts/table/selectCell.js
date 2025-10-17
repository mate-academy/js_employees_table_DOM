import {
  validateFullName,
  validatePosition,
  validateOffice,
  validateAge,
  validateSalary,
} from '../validators/validators';

import {
  clearErrorNotifications,
  convertToNumber,
  convertToCurrency,
} from '../utils/utils';
import { pushNotification } from '../notification/pushNotification';

export function selectCellFactory(state) {
  return function selectCell(cell, type, colName) {
    const prev = cell.textContent?.trim() ?? '';
    const input = document.createElement('input');

    input.type = type;
    input.className = 'cell-input';
    input.name = colName;

    if (colName === 'salary') {
      const formatedSalary = convertToNumber(prev);

      if (Number.isNaN(formatedSalary)) {
        input.value = 0;
      } else {
        input.value = formatedSalary;
      }
    } else {
      input.value = prev;
    }

    state.activeInput = input;
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    let canceled = false;
    let isValid = true;

    const save = () => {
      let newValue = input.value.trim();

      if (newValue === '') {
        cell.textContent = prev;
        state.activeInput = null;

        return;
      }

      let validationError = null;

      switch (colName) {
        case 'name':
          validationError = validateFullName(newValue);
          break;
        case 'position':
          validationError = validatePosition(newValue);
          break;
        case 'office':
          validationError = validateOffice(newValue);
          break;
        case 'age':
          validationError = validateAge(Number(newValue));
          break;
        case 'salary':
          validationError = validateSalary(Number(newValue));

          if (!validationError) {
            newValue = convertToCurrency(Number(newValue));
          }
          break;
        default:
          validationError = { title: 'Error', message: 'Unknown column' };
      }

      if (validationError) {
        createNotification(validationError);
        isValid = false;
      }

      if (isValid) {
        cell.textContent = newValue;
        canceled = true;
        state.activeInput = null;
      }
    };

    const cancel = () => {
      canceled = true;
      cell.textContent = prev;
      state.activeInput = null;
    };

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        save();
      }

      if (ev.key === 'Escape') {
        cancel();
      }
    });

    input.addEventListener(
      'blur',
      () => {
        setTimeout(() => {
          if (!canceled) {
            save();
          }

          if (!isValid) {
            cancel();
          }
        }, 0);
      },
      { once: true },
    );

    input.addEventListener('change', () => {
      isValid = true;
    });
  };
}

function createNotification({ title, message } = {}) {
  clearErrorNotifications();
  pushNotification(10, 10, title, message, 'error');
}

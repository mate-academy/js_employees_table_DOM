import { NUMERIC_VALUES, SALARY, AGE, NOTIFICATION_TYPES } from '../constants';
import { validateEmployeeFiled } from '../services/validator';
import { showNotification } from '../components/notification/notifications';

const commitCellEdit = (tableStore, updateEmployee) => {
  const editor = tableStore.getActiveEditor();

  if (!editor) {
    return;
  }

  const { td, input, oldValue } = editor;
  const newValue = input.value;

  if (newValue === oldValue) {
    td.textContent = oldValue;

    return;
  }

  const finalValue = typeof newValue === 'string' ? newValue.trim() : newValue;

  const field = td.dataset.field;

  const { valid, errors } = validateEmployeeFiled({
    field,
    finalValue,
  });

  if (!valid) {
    showNotification(
      NOTIFICATION_TYPES.ERROR,
      'Validation ' + NOTIFICATION_TYPES.ERROR,
      Object.values(errors).join('. \n') + '.',
    );

    td.textContent = oldValue;

    return;
  }

  if (valid) {
    showNotification(
      NOTIFICATION_TYPES.SUCCESS,
      'Validation ' + NOTIFICATION_TYPES.SUCCESS,
      'Employee field ' + field + ' updated',
    );
  }

  if (finalValue === '') {
    td.textContent = oldValue;

    return;
  }

  if (field === AGE || field === SALARY) {
    const finalNumber = Number(finalValue);

    if (Number.isNaN(finalNumber)) {
      td.textContent = oldValue;

      return;
    }

    if (field === AGE && (finalNumber < 18 || finalNumber > 90)) {
      td.textContent = oldValue;

      return;
    }

    td.textContent =
      field === SALARY
        ? '$' + finalNumber.toLocaleString('en-US')
        : finalNumber;
    updateEmployee(td.closest('tr').dataset.id, { [field]: finalNumber });

    return;
  }

  updateEmployee(td.closest('tr').dataset.id, { [field]: finalValue });
};

const onKeyDown = (e, tableStore) => {
  const editor = tableStore.getActiveEditor();

  if (!editor) {
    return;
  }

  const { td, input, oldValue } = editor;

  if (e.key === 'Enter') {
    input.blur();
  } else if (e.key === 'Escape') {
    td.textContent = oldValue;
    input.blur();
  }
};

const cleanup = (tableStore) => {
  const editor = tableStore.getActiveEditor();

  if (!editor) {
    return;
  }

  const { handleBlur, handleKeyDown, input, td } = editor;

  if (input) {
    input.removeEventListener('keydown', handleKeyDown);
    input.removeEventListener('blur', handleBlur);
  }

  if (td && td.contains(input)) {
    td.removeChild(input);
  }

  tableStore.setActiveEditor(null);
};

const onBlur = (tableStore, updateEmployee) => {
  commitCellEdit(tableStore, updateEmployee);
  cleanup(tableStore);
};

export const startCellEditing = (dblclickE, tableStore, updateEmployee) => {
  const td = dblclickE.target.closest('td');

  if (!td || tableStore.getActiveEditor()) {
    return;
  }

  const oldValue = td.textContent;
  const input = document.createElement('input');

  input.className = 'cell-input';

  if (NUMERIC_VALUES.includes(td.dataset.field)) {
    input.type = 'number';
  } else {
    input.type = 'text';
  }

  input.value = oldValue;

  td.textContent = '';
  td.appendChild(input);

  const handleBlur = () => {
    onBlur(tableStore, updateEmployee);
  };

  const handleKeyDown = (e) => {
    onKeyDown(e, tableStore);
  };

  tableStore.setActiveEditor({
    oldValue,
    input,
    td,
    handleBlur,
    handleKeyDown,
  });

  input.focus();
  input.select();

  input.addEventListener('blur', handleBlur);
  input.addEventListener('keydown', handleKeyDown);
};

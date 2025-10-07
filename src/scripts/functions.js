export const validateInput = (inp) => {
  const value = inp.value.trim().toLowerCase();
  const data = inp.dataset.qa;

  if (data === 'Office') {
    return true;
  }

  if (data === 'Name') {
    return value.length >= 4 && /^[A-Za-zА-Яа-яЁё\s]+$/.test(value);
  }

  if (data === 'Age') {
    return value >= 18 && value <= 90;
  }

  if (data === 'Position') {
    return value.length >= 4 && /^[A-Za-zА-Яа-яЁё\s]+$/.test(value);
  }

  if (data === 'Salary') {
    return /^[0-9]+$/.test(value);
  }
};

// Создание строки с колонками при Клике.

export function createNewRow(arrayInput) {
  const row = document.createElement('tr');

  for (let i = 0; i < arrayInput.length; i++) {
    const col = document.createElement('td');
    const data = arrayInput[i].dataset.qa;
    const value = arrayInput[i].value;

    if (data === 'Salary') {
      col.textContent = `$${value}`;
    } else {
      col.textContent = value;
    }

    row.append(col);
  }

  return row;
}

export function createChangeCells(cells) {
  const oldValue = cells.textContent;
  const input = document.createElement('input');

  input.value = oldValue;
  cells.textContent = '';
  cells.append(input);
  input.focus();

  function handleInput(even) {
    if (even.type === 'blur' || even.key === 'Enter') {
      cells.textContent = input.value || oldValue;
    }
  }
  input.addEventListener('blur', handleInput);
  input.addEventListener('keydown', handleInput);
}

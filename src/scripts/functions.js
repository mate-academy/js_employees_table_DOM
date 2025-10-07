export const validateInput = (inp) => {
  const value = inp.value.trim().toLowerCase();
  const typ = inp.type.toLowerCase();
  const data = inp.dataset.qa;

  if (data === 'office') {
    return true;
  }

  if (typ === 'text') {
    return /^[A-Za-zА-Яа-яЁё\s]+$/.test(value);
  }

  if (typ === 'number') {
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

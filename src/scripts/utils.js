export function setActiveRow(target, tBody) {
  [...tBody.rows].forEach((row) => row.classList.remove('active'));
  target.closest('tr').classList.add('active');
}

export function formatToCurrency(value) {
  return `$${+value.toLocaleString('en-US')}`;
}

export function capitalizeFirstLetter(string) {
  if (!string) {
    return;
  }

  if (typeof string !== 'string') {
    return;
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
}

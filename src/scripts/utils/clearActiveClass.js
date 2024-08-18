export function cleareActive(rows) {
  Array.from(rows).forEach((row) => (row.className = ''));
}

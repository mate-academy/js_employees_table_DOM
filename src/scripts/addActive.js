import { tableBody } from './main';

export function addActive(event) {
  const row = event.target.closest('tr');

  row.classList.add('active');

  for (const bodyRow of tableBody.rows) {
    if (bodyRow !== row) {
      bodyRow.classList.remove('active');
    }
  }
}

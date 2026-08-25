'use strict';

const table = document.querySelector('table');
const tableBody = table.querySelector('tbody');

table.addEventListener('click', (e) => {
  const rows = [...tableBody.querySelectorAll('tr')];
  const header = e.target.closest('th');
  const clickedRow = e.target.closest('tbody tr');

  if (clickedRow) {
    rows.forEach((n) => {
      n.classList.remove('active');
    });
    clickedRow.classList.add('active');
  }

  if (!header) {
    return;
  }

  if (header) {
    const colIndex = header.cellIndex;
    let sortedrows = [...rows].sort((a, b) => {
      const aNum = a.cells[colIndex].textContent.replace(/\D/g, '');
      const bNum = b.cells[colIndex].textContent.replace(/\D/g, '');
      const aText = a.cells[colIndex].textContent;
      const bText = b.cells[colIndex].textContent;

      if (aNum !== '' && bNum !== '') {
        return aNum - bNum;
      }

      return aText.localeCompare(bText);
    });

    const isSame = rows.every((n, i) => {
      return n === sortedrows[i];
    });

    if (isSame) {
      sortedrows = [...rows].sort((a, b) => {
        const aNum = a.cells[colIndex].textContent.replace(/\D/g, '');
        const bNum = b.cells[colIndex].textContent.replace(/\D/g, '');
        const aText = a.cells[colIndex].textContent;
        const bText = b.cells[colIndex].textContent;

        if (aNum !== '' && bNum !== '') {
          return bNum - aNum;
        }

        return bText.localeCompare(aText);
      });
    }

    sortedrows.forEach((n) => {
      tableBody.append(n);
    });
  }
});

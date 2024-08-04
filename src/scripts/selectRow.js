export const selectRow = (tableBody) => {
  let selectedRow;

  tableBody.addEventListener('click', (evt) => {
    const currentRow = evt.target.parentElement;

    if (currentRow.tagName !== 'TR') {
      return;
    }

    if (selectedRow) {
      selectedRow.classList.remove('active');
    }

    selectedRow = currentRow;
    selectedRow.classList.add('active');
  });
};

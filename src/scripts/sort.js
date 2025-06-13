export const sort = (container, elements, column, sortType, sortBy = 'asc') => {
  container.innerHTML = '';

  Array.from(elements)
    .sort((a, b) => {
      let [textA, textB] = [
        a.cells[column].innerText.trim(),
        b.cells[column].innerText.trim(),
      ];

      let sortResult;

      if (sortType === 'string') {
        sortResult = textA.localeCompare(textB);
      } else if (sortType === 'number') {
        textA = textA.replace(/[$,]/g, '');
        textB = textB.replace(/[$,]/g, '');
        sortResult = parseFloat(textA) - parseFloat(textB);
      }

      return sortBy === 'asc' ? sortResult : -sortResult;
    })
    .forEach((el) => {
      container.append(el);
    });
};

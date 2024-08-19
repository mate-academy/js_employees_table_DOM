export function toggleSort(i) {
  let asc = false;

  return function (arr) {
    asc = !asc;

    return arr.sort((a, b) => {
      let current = a.cells[i].textContent.replaceAll(/[$,]/g, '');
      let next = b.cells[i].textContent.replaceAll(/[$,]/g, '');

      if (!isNaN(+current)) {
        current = +current;
        next = +next;
      }

      return asc
        ? current > next
          ? 1
          : current < next
            ? -1
            : 0
        : current > next
          ? -1
          : current < next
            ? 1
            : 0;
    });
  };
}

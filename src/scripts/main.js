"use strict";

const employees = document.querySelector("table");

sortTable(employees);

function sortTable(table) {
  let isAsc = true;

  document.querySelectorAll("th").forEach((th) =>
    th.addEventListener("click", () => {
      const tbody = table.querySelector("tbody");

      Array.from(tbody.querySelectorAll("tr"))
        .sort(
          getCompareFunction(
            Array.from(th.parentNode.children).indexOf(th),
            isAsc
          )
        )
        .forEach((tr) => tbody.appendChild(tr));

      isAsc = !isAsc;
    })
  );
}

function getCompareFunction(headerIndex, dir) {
  return function (a, b) {
    const aCellValue = getRowCellValue(dir ? a : b, headerIndex);
    const bCellValue = getRowCellValue(dir ? b : a, headerIndex);

    if (
      aCellValue !== "" &&
      bCellValue !== "" &&
      !isNaN(aCellValue) &&
      !isNaN(bCellValue)
    ) {
      return aCellValue - bCellValue;
    }

    return aCellValue[0] === "$"
      ? parseInt(aCellValue.slice(1)) - parseInt(bCellValue.slice(1))
      : aCellValue.toString().localeCompare(bCellValue);
  };
}

function getRowCellValue(tr, index) {
  return tr.children[index].textContent;
}

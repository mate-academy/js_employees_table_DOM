'use strict';

let prevTdEdit = false;
let currentElement = null;

function saveEditTdHandler(event) {
  const targetInput = event.target.closest('input');

  if ((event.keyCode === 13) || (event.type === 'blur')) {
    if (targetInput.value !== '') {
      targetInput.parentNode.innerHTML = targetInput.value;
      prevTdEdit = false;
    } else {
      targetInput.parentNode.innerHTML = currentElement.innerHTML;
      prevTdEdit = false;
    }
  }
};

function editHandler(event) {
  if (prevTdEdit === false) {
    const target = event.target.closest('td');

    currentElement = target.cloneNode(true);

    prevTdEdit = true;

    target.innerHTML = `
      <input class = 'cell-inputt'>`;

    target.querySelector('input'
    ).addEventListener('blur', saveEditTdHandler);
  }
};

module.exports = {
  editHandler,
  saveEditTdHandler,
};

'use strict';

const collectionOfTitles = [
  ...document.querySelector('thead').firstElementChild.children];
const tBodyElement = document.querySelector('tbody');
const trElements = [...tBodyElement.querySelectorAll('tr')];

// ------------------Realize sorting table by to ways--------------------------

for (const title of collectionOfTitles) {
  let secondClick = false;

  title.addEventListener('click', (action) => {
    let sortedRow = null;

    // Separate function to sort salary value from table

    function sortingSalary(array) {
      if (secondClick) {
        sortedRow = array.sort(
          (a, b) => +b.children[4].textContent.slice(1).split(',').join('')
                  - +a.children[4].textContent.slice(1).split(',').join(''));
        secondClick = false;
      } else {
        sortedRow = array.sort(
          (a, b) => +a.children[4].textContent.slice(1).split(',').join('')
                  - +b.children[4].textContent.slice(1).split(',').join(''));
        secondClick = true;
      }
    }

    // Function to sorting values of table

    function doubleSortingForStrings(index) {
      if (secondClick) {
        sortedRow = trElements.sort(
          (a, b) => b.children[index].textContent.localeCompare(
            a.children[index].textContent));
        secondClick = false;
      } else {
        sortedRow = trElements.sort(
          (a, b) => a.children[index].textContent.localeCompare(
            b.children[index].textContent));
        secondClick = true;
      }
    };

    switch (action.target) {
      case collectionOfTitles[0]:
        doubleSortingForStrings(0);
        break;

      case collectionOfTitles[1]:
        doubleSortingForStrings(1);
        break;

      case collectionOfTitles[2]:
        doubleSortingForStrings(2);
        break;

      case collectionOfTitles[3]:
        doubleSortingForStrings(3);
        break;

      case collectionOfTitles[4]:
        sortingSalary(trElements);
        break;
    };

    tBodyElement.append(...sortedRow);
  });
}

// -----------------------Make row selected-----------------------

tBodyElement.addEventListener('click', (action) => {
  const clicked = action.target.closest('tr');

  if (!clicked) {
    return;
  }

  trElements.forEach(tr => tr.classList.remove('active'));

  clicked.classList.add('active');
});

// --------------------Make form---------------------------------

const bodyElement = document.querySelector('body');

bodyElement.insertAdjacentHTML('beforeend', `
<form action="" class="new-employee-form">
<label for="">Name:
  <input name="name" id="name" type="text" data-qa="name" required>
</label>

<label for="">Position:
  <input name="position" id="position" type="text" data-qa="position" required>
</label>

<label for="">Office:
  <select name="office" id="office" size="1" data-qa="office" required>
    <option>Tokyo</option>
    <option>Singapore</option>
    <option>London</option>
    <option>New York</option>
    <option>Edinburgh</option>
    <option>San Francisco</option>
  </select>
</label>

<label for="">Age:
  <input name="age" id="age" type="number"  data-qa="age" required>
</label>

<label for="">Salary:
  <input name="salary" id="salary" type="number" data-qa="salary" required>
</label>

<button>Save to table</button>
</form>`);

// -------------------------Create error messages-----------------------------

// Create messages text

const smallNameError = `Please enter valid name.
Name must contain more then 4 letters!`;
const smallAgeError = 'Sorry, your age is small! Age must be at least 18!';
const bigAgeError = 'Sorry, your age is big. Age must be no more then 90!';
const successMessage = 'Thanks, you are successfully added new employee!';
const warningMessage = 'Please wait, something is wrong...';
const loadingMessage = 'Loading, please wait...';
const correctSalary = 'Please enter valid salary. It must be more then 0$!';
const editError = `Cell must not be empty or must contain
more then 4 letters, please enter valid information.`;

// Create window message

const messageWindow = document.createElement('div');

messageWindow.classList.add('notification');
messageWindow.dataset.qa = 'notification';
messageWindow.style.display = 'flex';
messageWindow.style.visibility = 'hidden';
messageWindow.style.alignItems = 'center';
messageWindow.style.justifyContent = 'center';
messageWindow.style.flexDirection = 'column';
messageWindow.style.textAlign = 'center';
bodyElement.append(messageWindow);

// Create show messages functions

function showError(error, text) {
  error.classList.remove('warning');
  error.classList.remove('success');
  error.classList.add('error');
  error.style.visibility = 'visible';
  error.textContent = text;

  setTimeout(() => {
    error.style.visibility = 'hidden';
  }, 5000);

  const titleOfMessage = document.createElement('title');

  titleOfMessage.classList.add('title');
  titleOfMessage.textContent = 'ERROR';
  messageWindow.prepend(titleOfMessage);
};

function showSuccess(error, text) {
  error.classList.remove('error');
  error.classList.remove('warning');
  error.classList.add('success');
  error.style.visibility = 'visible';
  error.textContent = text;

  setTimeout(() => {
    error.style.visibility = 'hidden';
  }, 5000);

  const titleOfMessage = document.createElement('title');

  titleOfMessage.classList.add('title');
  titleOfMessage.textContent = 'SUCCESS';
  messageWindow.prepend(titleOfMessage);
};

function showWarning(error, text) {
  error.classList.remove('success');
  error.classList.remove('error');
  error.classList.add('warning');
  error.style.visibility = 'visible';
  error.textContent = text;

  const titleOfMessage = document.createElement('title');

  titleOfMessage.classList.add('title');
  titleOfMessage.textContent = 'WARNING';
  messageWindow.prepend(titleOfMessage);
};

// Add info from form to table

const formElement = document.querySelector('form');

formElement.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInputValue = document.getElementById('name').value;
  const positionInputValue = document.getElementById('position').value;
  const officeInputValue = document.getElementById('office').value;
  const ageInputValue = document.getElementById('age').value;
  const salaryInputValue = document.getElementById('salary').value;

  // Checking that form data is correct

  if (nameInputValue.length < 4) {
    setTimeout(() => {
      showWarning(messageWindow, warningMessage);
    }, 1000);

    setTimeout(() => {
      showError(messageWindow, smallNameError);
    }, 3000);
  } else if (ageInputValue < 18) {
    setTimeout(() => {
      showWarning(messageWindow, warningMessage);
    }, 1000);

    setTimeout(() => {
      showError(messageWindow, smallAgeError);
    }, 3000);
  } else if (ageInputValue > 90) {
    setTimeout(() => {
      showWarning(messageWindow, warningMessage);
    }, 1000);

    setTimeout(() => {
      showError(messageWindow, bigAgeError);
    }, 3000);
  } else if (salaryInputValue <= 0) {
    setTimeout(() => {
      showWarning(messageWindow, warningMessage);
    }, 1000);

    setTimeout(() => {
      showError(messageWindow, correctSalary);
    }, 3000);
  } else {
    setTimeout(() => {
      const trElement = document.createElement('tr');

      trElement.insertAdjacentHTML('beforeend', `
      <td>${nameInputValue}</td>
      <td>${positionInputValue}</td>
      <td>${officeInputValue}</td>
      <td>${ageInputValue}</td>
      <td>$${Number(salaryInputValue).toLocaleString('en-US')}</td>`);

      trElements.push(trElement);
      tBodyElement.insertAdjacentElement('beforeend', trElement);
    }, 2500);

    setTimeout(() => {
      showSuccess(messageWindow, loadingMessage);
    }, 1000);

    setTimeout(() => {
      showSuccess(messageWindow, successMessage);
    }, 3000);

    // Realizing reset input values after success

    setTimeout(() => {
      e.target.reset();
    }, 6000);
  }
});

// ---------Realizing editing the table by double clicking--------

trElements.map(tr => tr.addEventListener('dblclick', (action) => {
  const target = action.target.closest('td');

  if (!target) {
    return;
  }

  // Just check if the target is on the office check or on the other cells

  if (target === tr.children[2]) {
    const select = document.createElement('select');

    select.classList.add('cell-input');

    select.insertAdjacentHTML('beforeend', `
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    `);

    while (target.firstChild) {
      target.removeChild(target.firstChild);
    }

    target.appendChild(select);
    select.focus();

    select.addEventListener('keydown', (key) => {
      if (key.code === 'Enter') {
        target.removeChild(select);
        target.appendChild(document.createTextNode(select.value));
      }
    });
  } else {
    const input = document.createElement('input');
    const firstValue = target.textContent;

    input.classList.add('cell-input');
    input.value = target.textContent;

    while (target.firstChild) {
      target.removeChild(target.firstChild);
    }

    if (input.value.length > 4) {

    }

    target.appendChild(input);
    input.focus();

    input.addEventListener('keydown', (key) => {
      if (key.code === 'Enter') {
        target.removeChild(input);

        if (input.value.length < 4 && (target === tr.children[0]
                                        || target === tr.children[1])) {
          target.appendChild(document.createTextNode(firstValue));

          setTimeout(() => {
            showWarning(messageWindow, warningMessage);
          }, 1000);

          setTimeout(() => {
            showError(messageWindow, editError);
          }, 3000);
        } else if (input.value.split('').every(item => item === ' ')) {
          target.appendChild(document.createTextNode(firstValue));

          setTimeout(() => {
            showWarning(messageWindow, warningMessage);
          }, 1000);

          setTimeout(() => {
            showError(messageWindow, editError);
          }, 3000);
        } else if (target === tr.children[3] && +input.value < 18) {
          target.appendChild(document.createTextNode(firstValue));

          setTimeout(() => {
            showWarning(messageWindow, warningMessage);
          }, 1000);

          setTimeout(() => {
            showError(messageWindow, smallAgeError);
          }, 3000);
        } else if (target === tr.children[3] && +input.value > 90) {
          target.appendChild(document.createTextNode(firstValue));

          setTimeout(() => {
            showWarning(messageWindow, warningMessage);
          }, 1000);

          setTimeout(() => {
            showError(messageWindow, bigAgeError);
          }, 3000);
        } else {
          firstValue.includes('$')
            ? target.appendChild(document.createTextNode(
              `$${Number(input.value.slice(
                0).split(',').join('')).toLocaleString('en-US')}`))
            : target.appendChild(document.createTextNode(input.value));
        }
      }
    });
  }
}));

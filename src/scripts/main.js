'use strict';

function sortTable(thTarget) {
    const trList = thTarget.closest('tr');
    const items = trList.querySelectorAll('th');
    const thList = [...items].map(item => item.innerText);
    const index = thList.indexOf(thTarget.innerText);
    let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;

    table = document.querySelector("table");
    switching = true;
    dir = "asc";

    while (switching) {
      switching = false;
      rows = table.rows;

      for (i = 1; i < (rows.length - 2); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[index];
        y = rows[i + 1].getElementsByTagName("TD")[index];

        if (index === 4) {
            const xf = parseFloat(x.innerHTML.slice(1).replace(",", "."));
            const yf = parseFloat(y.innerHTML.slice(1).replace(",", "."));

            if (dir == "asc") {
                if (xf > yf) {
                  shouldSwitch = true;
                  break;
                }
              } else if (dir == "desc") {
                if (xf < yf) {
                  shouldSwitch = true;
                  break;
                }
              }
        } else {
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                  shouldSwitch = true;
                  break;
                }
              } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                  shouldSwitch = true;
                  break;
                }
              }
        }
      }

      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount ++;
      } else {
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

function selectRow(target) {
    const rowsBody = document.querySelector('tbody');
    const numberRows = rowsBody.rows.length;

    for ( let i = 0; i < numberRows; i++ ) {
        rowsBody.rows[i].classList.remove('active');
    }

    const resultRow = target.closest('tr');
    resultRow.classList.add('active');
}

const table = document.querySelector('table');
table.insertAdjacentHTML('afterend',
`
    <form class='new-employee-form'>
        <label>Name: <input data-qa="name" name="name" type="text" required></label>
        <label>Position: <input data-qa="position" name="position" type="text" required></label>
        <label>Office: 
            <select data-qa="office" name="office" required>
                <option>Tokyo</option>
                <option>London</option>
                <option>New York</option>
                <option>Edinburgh</option>
                <option>San Francisco</option>
            </select>
        </label>
        <label>Age: <input data-qa="age" name="age" type="number" required></label>
        <label>Salary: <input data-qa="salary" name="salary" type="number" step=".001" required></label>
        <button type="submit">Save to table</button>
    </form>

`
)

const form = document.querySelector('form')

document.body.addEventListener('click', e => {
    const targetItem = e.target;

    if (targetItem.matches('th')) {
        sortTable(targetItem);
    }

    if (targetItem.matches('td')) {
        selectRow(targetItem);
    }
})

form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form);
    const dataObject = Object.fromEntries(data.entries());
    const rowsBody = document.querySelector('tbody');

    if ( Number(dataObject.age) < 18 || Number(dataObject.age) > 90 ) {
        alert("Age has to be between 18 and 90");
        return;
    }

    if ( dataObject.name.length < 4 ) {
        alert("Name has to contain more then 3 letters");
        return;
    }

    const newRow = rowsBody.insertRow();

    const nameCell = newRow.insertCell();
    nameCell.innerText = dataObject.name;

    const positionCell = newRow.insertCell();
    positionCell.innerText = dataObject.position;

    const officeCell = newRow.insertCell();
    officeCell.innerText = dataObject.office;
    
    const ageCell = newRow.insertCell();
    ageCell.innerText = dataObject.age;

    const salaryCell = newRow.insertCell();
    const toFixed = parseFloat(dataObject.salary).toFixed(3);
    const floatToString = toFixed.toString();
    const rightSalary = '$' + floatToString.replace('.', ',');
    salaryCell.innerText = rightSalary;

    form.reset();

    alert("You've added new employee. You are simply the best!");
})

let currentText = '';

document.body.addEventListener('dblclick', e => {
    const targetItem = e.target;

    if (targetItem.matches('td')) {
        currentText = targetItem.innerText;

        if ( targetItem.cellIndex === 3 ) {
            targetItem.innerHTML = 
            `
            <input type="number" name="cell-input" class="cell-input">
            `
        } else if ( targetItem.cellIndex === 4 ) {
            targetItem.innerHTML = 
            `
            <input type="number" name="cell-input" class="cell-input" step=".001">
            `
        } else {
            targetItem.innerHTML = 
            `
            <input type="text" name="cell-input" class="cell-input">
            `
        }

        const blurCell = document.querySelector('.cell-input');
        blurCell.focus();

        blurCell.addEventListener('blur', e => {
                const targetItemBlur = e.target;
                const cellTd = targetItemBlur.closest('td')

                if ( blurCell.value.length === 0 ) {
                    cellTd.innerText = currentText;
                } else {
                    if ( cellTd.cellIndex === 4 ) {
                        const toFixed = parseFloat(blurCell.value).toFixed(3);
                        const floatToString = toFixed.toString();
                        cellTd.innerText = '$' + floatToString.replace('.', ',');
                    } else {
                        cellTd.innerText = blurCell.value;
                    }
                }
        })

        blurCell.addEventListener('keydown', e => {
            if ( e.code === 'Enter' ) {
                const targetItemBlur = e.target;
                const cellTd = targetItemBlur.closest('td')

                if ( blurCell.value.length === 0 ) {
                    cellTd.innerText = currentText;
                } else {
                    if ( cellTd.cellIndex === 4 ) {
                        const toFixed = parseFloat(blurCell.value).toFixed(3);
                        const floatToString = toFixed.toString();
                        cellTd.innerText = '$' + floatToString.replace('.', ',');
                    } else {
                        cellTd.innerText = blurCell.value;
                    }
                }
            }
        })


    }
})

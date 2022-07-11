'use strict';

const peopleList = [...document.querySelector('tbody').children];
const propertyNames = [...document.querySelector('tr').children].map(
  el => el.innerText.toLowerCase());
let propertyList = [];

peopleList.forEach((el, index) => {
  propertyList.push({
    name: el.children[0].textContent,
    position: el.children[1].textContent,
    office: el.children[2].textContent,
    age: +el.children[3].textContent,
    salary: +el.children[4].textContent.replace(/\D/g, ''),
    id: index,
  });
});

let current;

[...document.querySelector('tr').children].forEach((el, index) => {
  const key = propertyNames[index];

  el.addEventListener('click', (e) => {
    propertyList = propertyList.sort((a, b) => {
      if (typeof a[key] === 'number') {
        return a[key] - b[key];
      }

      if (a[key] > b[key]) {
        return 1;
      }

      if (a[key] < b[key]) {
        return -1;
      }

      return 0;
    });

    let newPeopleList = [];

    for (let i = 0; i < peopleList.length; i++) {
      newPeopleList.push(peopleList[propertyList[i].id]);
    }

    if (current === e.target) {
      newPeopleList = newPeopleList.reverse();
    }

    if (!current) {
      current = e.target;
    } else {
      current = undefined;
    }

    document.querySelector('tbody').append(...newPeopleList);
  });
});

document.querySelector('tbody').addEventListener('click', (e) => {
  [...document.querySelector('tbody').children].forEach(el => {
    el.classList.remove('active');
  });

  e.target.parentElement.classList.toggle('active');
});

document.querySelector('body').insertAdjacentHTML('beforeend', `
  <form action="#" class="new-employee-form">
    <label>Name: <input type="text" minlength="4" data-qa="name"></label>
    <label>Position: <input type="text"  data-qa="position"></label>
    <label>Office:
      <select name="age" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select></label>
    <label>Age: <input type="number" min="18" max="90" data-qa="age"></label>
    <label>Salary: <input type="number" data-qa="salary"></label>
    <button type="submit">Save to table</button>
  </form>
`);

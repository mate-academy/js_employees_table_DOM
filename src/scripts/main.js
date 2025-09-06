'use strict';

const mainTable = document.querySelector('table');

// функция для сортировки таблици
function tableSort(table) {
  const headTable = table.querySelector('thead');
  const thHead = headTable.querySelector('tr').querySelectorAll('th');
  let sortMod = true;
  let nowSort = null;
  // принимаем кликл

  headTable.addEventListener('click', (e) => {
    const tBody = document.querySelector('tbody');
    const trBody = [...table.querySelector('tbody').querySelectorAll('tr')];
    // берем индекс нажатого солбца

    const inHeadTable = [...thHead].indexOf(e.target);

    // настраиваем режим сортировки
    if (nowSort === inHeadTable) {
      sortMod = !sortMod;
    } else {
      sortMod = true;
    }
    nowSort = inHeadTable;

    // создаем масив с сотрированими рядками
    const sortBody = [...trBody].sort((a, b) => {
      const Avalue = a.children[inHeadTable].textContent.replace(/[$,]/g, '');
      const Bvalue = b.children[inHeadTable].textContent.replace(/[$,]/g, '');
      const Anum = Number(Avalue);
      const Bnum = Number(Bvalue);

      if (isNaN(Anum) || isNaN(Bnum)) {
        if (sortMod) {
          return Avalue.localeCompare(Bvalue);
        } else {
          return Bvalue.localeCompare(Avalue);
        }
      } else {
        if (sortMod) {
          return Anum - Bnum;
        } else {
          return Bnum - Anum;
        }
      }
    });
    // перебераем сортирование рядки и каждий добавляем в Тбади

    sortBody.forEach((tr) => {
      tBody.append(tr);
    });
  });
}

// функция виделения рядка
function activeRow() {
  const tbody = mainTable.querySelector('tbody');

  tbody.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');

    if (!tr) {
      return;
    }

    tbody.querySelectorAll('tr').forEach((oneTr) => {
      oneTr.classList.remove('active');
    });

    tr.classList.add('active');
  });
}

// функия создания форми
function creatForm() {
  const body = document.querySelector('body');
  const newForm = document.createElement('form');

  newForm.classList.add('new-employee-form');

  // функция для создания лейблов форми
  function creatLIS(naame, type, labelText, isSelect = false, option = []) {
    const newLable = document.createElement('label');
    let inputOrselect;

    if (isSelect) {
      const newSelect = document.createElement('select');

      newSelect.setAttribute('name', naame);
      newSelect.setAttribute('data-qa', naame);

      option.forEach((city) => {
        const newOpt = document.createElement('option');

        newOpt.textContent = city;
        newSelect.append(newOpt);
      });

      inputOrselect = newSelect;
    } else {
      const newInput = document.createElement('input');

      newInput.setAttribute('name', naame);
      newInput.setAttribute('type', type);
      newInput.setAttribute('data-qa', naame);
      newInput.setAttribute('required', true);

      inputOrselect = newInput;
    }

    newLable.textContent = labelText;
    newLable.append(inputOrselect);

    return newLable;
  }
  //  -------------------------------------------------

  const nameLable = creatLIS('name', 'text', 'Name: ');
  // -----------------------------------------------
  const positionLable = creatLIS('position', 'text', 'Position: ');
  // -----------------------------------------------
  const offices = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  const officeLable = creatLIS('office', null, 'Office: ', true, offices);
  // -----------------------------------------------

  const ageLable = creatLIS('age', 'number', 'Age: ');
  // -----------------------------------------------
  const salaryLable = creatLIS('salary', 'number', 'Salary: ');

  // -----------------------------------------------
  const btn = document.createElement('button');

  btn.setAttribute('type', 'submit');
  btn.textContent = 'Save to table';
  //  заполняем форму

  newForm.append(
    nameLable,
    positionLable,
    officeLable,
    ageLable,
    salaryLable,
    btn,
  );
  body.append(newForm);
  // функция обработчик нажатия на кнопку

  newForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //  функция для парса имен и позиции
    function parserNameOrPos(nameOrPos) {
      const parseValue = nameOrPos.value
        .trim()
        .split(' ')
        .map((world) => world[0].toUpperCase() + world.slice(1).toLowerCase())
        .join(' ');

      return parseValue;
    }

    //  функция для парса зарплати
    function salaryParser(salary) {
      const salaryStr = salary.split('');
      let readySalary = '';
      let count = 0;

      for (let i = salaryStr.length - 1; i >= 0; i--) {
        readySalary += salaryStr[i];
        count++;

        if (count % 3 === 0 && i !== 0) {
          readySalary += ',';
        }
      }

      readySalary = readySalary.split('').reverse().join('');

      return '$' + readySalary;
    }

    //  создания обьекта с готовими данними форми
    const newPerson = {
      name: parserNameOrPos(nameLable.querySelector('input')),
      position: parserNameOrPos(positionLable.querySelector('input')),
      office: officeLable.querySelector('select').value,
      age: Number(ageLable.querySelector('input').value),
      salary: salaryParser(salaryLable.querySelector('input').value),
    };
    // функция создания уведомленний

    const pushNotification = (posTop, posRight, title, description, type) => {
      const messageContainer = document.createElement('div');

      messageContainer.classList.add('notification', type);
      messageContainer.setAttribute('data-qa', 'notification');
      messageContainer.style.top = posTop + 'px';
      messageContainer.style.right = posRight + 'px';

      const messageTitle = document.createElement('h2');

      messageTitle.classList.add('title');
      messageTitle.textContent = title;
      messageContainer.append(messageTitle);

      const messageP = document.createElement('p');

      messageP.innerHTML = description.replace(/\n/g, '<br>');
      messageContainer.append(messageP);

      document.body.append(messageContainer);

      setTimeout(() => {
        messageContainer.style.display = 'none';
      }, 2000);
    };

    // функция валидации нових рядков форми

    function inputValidator(naame, age) {
      let hasError = false;

      if (naame.length < 4) {
        hasError = true;

        pushNotification(
          10,
          10,
          'Помилка',
          'Імя повинно бути довшим ніж 3 літери',
          'error',
        );

        return false;
      }

      if (age < 18 || age > 90) {
        hasError = true;

        pushNotification(
          150,
          10,
          'Помилка',
          'Твій вік має бути від 18 до 90',
          'error',
        );

        return false;
      }

      if (hasError === false) {
        pushNotification(290, 10, 'Успішно', 'Працівника доданно', 'success');

        return true;
      }
    }

    //  добавления новой строки к форме
    function trAdd() {
      const cheking = inputValidator(newPerson.name, newPerson.age);

      if (cheking) {
        const tbody = body.querySelector('tbody');
        const newTr = document.createElement('tr');

        Object.values(newPerson).forEach((value) => {
          const newTd = document.createElement('td');

          newTd.textContent = value;
          newTr.append(newTd);
        });
        tbody.append(newTr);
      }
    }

    trAdd();
  });
}

tableSort(mainTable);
activeRow();
creatForm();

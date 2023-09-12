1. Replace `<your_account>` with your Github username in the link
    - [DEMO LINK](https://Lazarend.github.io/js_employees_table_DOM/)
2. Follow [this instructions](https://mate-academy.github.io/layout_task-guideline/)
    - Run `npm run test` command to test your code;
    - Run `npm run test:only -- -n` to run fast test ignoring linter;
    - Run `npm run test:only -- -l` to run fast test with additional info in console ignoring linter.

### Task: Employees table

Dear mate,
this is the final task of JS Advanced course. Apply all the acquired skills and demonstrate what you are capable of!

Let's get started. Briefly about the tasks:
1. Implement table sorting by clicking on the title (in two directions).
2. When user clicks on a row, it should become selected.
3. Write a script to add a form to the document. Form allows users to add new employees to the spreadsheet.
4. Show notification if form data is invalid (use notification from the previous tasks).
5. Implement editing of table cells by double-clicking on it.

As always, all the necessary styles have already been written for you, you do not need to change the layout or styles in this task.

Let's move on to the requirements.

Start table:
![Preview](./src/images/preview.png)

##### Implement table sorting by clicking on the title (in two directions)
- When users clicks on one of the table headers, table should be sorted in ASC order, the second click sorts it in DESC order.
- When users click on a new title, always sort in ASC order.

##### When user clicks on a row, it should become selected.
- Use 'active' class for table row to indicate it is selected.
- Only one line can be selected at a time.

##### Write a script to add a form to the document. Form allows users to add new employees to the spreadsheet.
- The form should have class `new-employee-form` (to apply correct styles).
- The form should have 4 inputs, 1 select and submit button.
- Put inputs inside labels:
```html
<label>Name: <input name="name" type="text"></label>
```
- Add qa attributes for each input field:
```
 data-qa="name"
 data-qa="position"
 data-qa="office"
 data-qa="age"
 data-qa="salary"
```
- Select should have 6 options: `Tokyo`, `Singapore`, `London`, `New York`, `Edinburgh`, `San Francisco`.
- Use texts for labels and buttons from the screenshot below.
- Age and salary inputs should have a number type. Don't forget to convert the string from salary input to correct value like in the table.
- Click on `Save to table` should add a new employee to the table.
- All fields are required.

##### Show notification if form data is invalid.
- Click on `Save to table` should run validation for form inputs. If data is valid, add a new employee to the table.
- If `Name` value has less than 4 letters, show error notification.
- If `Age` value is less than 18 or more than 90 show error notification.
- If a new employee is successfully added to the table, show success notification.
- Notification titles and descriptions are up to you.
- Add qa attribute for notification: `data-qa="notification"` and class `error`/`success` depending on the result.

##### Implement editing of table cells by double-clicking on it (optional).
- Double click on the cell of the table, should remove text, and append input with `cell-input` class.
- The input value should contain replaced by input text.
- Only one cell can be edited at the time.
- On blur save changes to table cell. Remove input and set new text.
- On 'Enter' keypress, save changes to the table cell. Remove input and set new text in the table cell.
- If an input is empty on submitting return initial value.

Expected result of your code:
![Result](./src/images/result.png)

Good luck. We believe in you!

Частина 1: Сортування таблиці
Для сортування таблиці в два напрямки (ASC та DESC), потрібно назначити обробник подій на заголовки таблиці (th). Якщо користувач клікає на заголовок, спочатку сортуємо його в порядку ASC (за зростанням), а при наступному кліку на той же заголовок сортуємо в порядку DESC (за спаданням). При кліку на інший заголовок завжди сортуємо його в порядку ASC.

Частина 2: Виділення рядка
При кліку на рядок (tr), можемо назначити йому клас "active", який позначає виділений рядок. Важливо зауважити, що тільки один рядок може бути виділеним одночасно, тобто, якщо інший рядок вже був виділений, потрібно скасувати виділення.

Частина 3: Додавання форми
Потрібно створити форму за допомогою JavaScript і додати її до документу. Форма повинна мати клас "new-employee-form" для правильного оформлення. У формі повинно бути 4 поля введення (input), 1 вибір (select) і кнопка "Save to table". Кожне поле вводу повинно бути обгорнуте в елемент label для правильного оформлення.

Частина 4: Валідація форми та показ повідомлень
При кліку на кнопку "Save to table", потрібно провести валідацію даних у формі. Якщо дані недійсні, показуємо повідомлення про помилку. Перевіряємо, чи ім'я має не менше 4 літер, а вік перебуває в діапазоні від 18 до 90. Якщо новий працівник успішно доданий до таблиці, показуємо повідомлення про успіх. Можемо використовувати атрибути data-qa для зручності тестування та класи "error" або "success" для стилізації повідомлень.

Частина 5: Редагування комірок таблиці (опціонально)
Опціонально, можемо додати можливість редагування комірок таблиці подвійним кліком на них. Під час подвійного кліку текст комірки замінюється на поле введення (input). Зміни можна зберегти, натиснувши клавішу "Enter" або втратити фокус на полі введення. Якщо введене значення порожнє, то повертайте початкове значення.


_________________________________



Створення змінних та отримання посилань на DOM-елементи:

Ми визначаємо основні змінні, такі як table, captions, employees (масив для зберігання даних про співробітників), form (форма для додавання нових співробітників), submitBtn (кнопка для відправки форми), inputNames (масив з іменами полів у формі), editedCell (змінна для зберігання вмісту комірки, яку користувач редагує), currOrder (поточний порядок сортування, "asc" або "desc"), currColumnName (поточний стовпчик, за яким відбувається сортування), та activeLine (рядок таблиці, який вибраний користувачем).

Ми також отримуємо посилання на всі рядки таблиці (співробітників) та на заголовки стовпчиків (за допомогою querySelectorAll).

Заповнення масиву employees даними з таблиці:

Ми проходимо по всіх рядках таблиці, витягуємо дані про співробітників та додаємо їх до масиву employees у вигляді об'єктів.
Додавання обробників подій:

Ми додаємо обробник подій для заголовків таблиці. Коли користувач клікає на заголовок, викликається функція sortTable, яка сортує таблицю за відповідним стовпчиком.

Ми також додаємо обробник подій для рядків таблиці. Коли користувач клікає на рядок, він стає виділеним (з класом "active"). Ми також додаємо обробник подій для подвійного кліку на комірці таблиці, який викликає функцію editCell для редагування комірки.

Ми додаємо обробник події submit до форми для додавання нових співробітників. Коли користувач відправляє форму, ми викликаємо функцію addNewEmployee, яка перевіряє дані форми, додає нового співробітника до масиву employees і оновлює таблицю.

Ми також додаємо обробник подій blur і keydown на рівні документа для обробки редагування комірок таблиці. Функція applyChanges перевіряє та зберігає зміни в комірках таблиці.

Створення форми для додавання співробітників:

Ми створюємо HTML-форму, додаємо необхідні поля та кнопку "Save to table". Форма має клас "new-employee-form" для стилізації, а також вказані data-qa атрибути для кожного поля для подальшого використання при валідації та сповіщеннях.
Обробка події натискання кнопки "Save to table" у формі:

Після натискання кнопки "Save to table", дані з форми перевіряються функцією validateData, яка перевіряє валідність даних. Якщо дані відповідають вимогам, новий співробітник додається до масиву employees, а таблиця оновлюється.

Якщо дані не відповідають вимогам, виводиться сповіщення з помилкою.

Після успішного додавання співробітника, виводиться сповіщення про успішну операцію.

Функція сортування таблиці sortTable:

Функція отримує два об'єкта, які представляють рядки таблиці та назву стовпчика, за яким потрібно відсортувати таблицю.

Сортування відбувається за допомогою порівняння даних у відповідних стовпчиках. Залежно від типу даних (текст або числа), порівнюються значення або числа.

Функція оновлення таблиці render:

Функція призначена для оновлення вмісту таблиці на основі масиву employees.

Для кожного об'єкта співробітника створюється новий рядок таблиці з відповідними комірками для кожного поля.

Значення "Salary" форматуються як валюта.

Функція валідації validateData:

Функція приймає дані з форми та текстовий елемент для відображення помилок.

Вона перевіряє кожне поле на валідність та виводить відповідні повідомлення про помилки.

Функція для редагування комірок editCell:

Функція викликається при подвійному кліку на комірці таблиці.

Вона зберігає початковий текст комірки та замінює його полем вводу. Користувач може редагувати значення, і ці зміни можна зберегти, натиснувши "Enter" або втратити фокус на полі вводу.

Зміни застосовуються до таблиці після втрати фокусу або натискання "Enter".

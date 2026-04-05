- [DEMO LINK](https://ikseloi.github.io/js_employees_table_DOM/)

### Task: Employees table

1. Implement table sorting by clicking on the title (in two directions).
2. When the user clicks on a row, it should become selected.
3. Write a script to add a form to the document. Form allows users to add new employees to the spreadsheet.
4. Show notification if form data is invalid (use notification from the previous tasks).
5. Implement editing of table cells by double-clicking on them (optional).

##### Implement table sorting by clicking on the title (in two directions)

- When users click on one of the table headers, the table should be sorted in ASC order; the second click sorts it in DESC order.
- When users click on a new title, always sort in ASC order.

##### When the user clicks on a row, it should become selected.

- Use 'active' class for the table row to indicate it is selected.
- Only one line can be selected at a time.

##### Write a script to add a form to the document. Form allows users to add new employees to the spreadsheet.

- The form should have class `new-employee-form` (to apply correct styles).
- The form should have:
  - 4 inputs: `name`, `position`, `age`, and `salary`
  - 1 select: `office`
  - Submit button.
- Put inputs inside labels:

```html
<label>Name: <input name="name" type="text" /></label>
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
- Age and salary inputs should be of a numeric type. Don't forget to convert the string from the salary input to the correct value, like in the table.
- Click on `Save to table`; you should add a new employee to the table.
- All fields are required.

##### Show notification if form data is invalid.

- Click on `Save to table` should run validation for form inputs. If the data is valid, add a new employee to the table.
- If the `Name` value has fewer than 4 letters, show error notification.
- If the `Age` value is less than 18 or more than 90, show an error notification.
- If a new employee is successfully added to the table, show success notification.
- Notification titles and descriptions are up to you.
- Add qa attribute for notification: `data-qa="notification"` and class `error`/`success` depending on the result.

##### Implement editing of table cells by double-clicking on them (optional).

- Double click on the cell of the table, which should remove the text, and append input with `cell-input` class.
- The input value should be replaced by the input text.
- Only one cell can be edited at a time.
- On blur, save changes to the table cell. Remove input and set new text.
- On 'Enter' keypress, save changes to the table cell. Remove input and set new text in the table cell.
- If an input is empty on submission, return the initial value.

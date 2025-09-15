'use strict';

import { InputFieldGenerator, SelectFieldGenerator } from './fieldGenerator.js';

import {
  MinStrLenValidator,
  NumScopeValidator,
  NotEmptyValidator,
} from './fieldValidator.js';

import { CustomNotificationManager } from './customNotificationManager.js';

import { InlineEditor } from './inlineEditor.js';

import { MoneyAmountFormatter } from './fieldFormatter.js';

/**
 * Class for manage employees table
 */
class EmployeesTable {
  /**
   * Table selector
   *
   * @type {string}
   */
  static TABLE_SEL = 'table';

  /**
   * Selector for table head elements
   *
   * @type {string}
   */
  static TABLE_TH_SEL = ':scope > thead > tr > th';

  /**
   * Selector for table tbody
   *
   * @type {string}
   */
  static TABLE_TBODY_SEL = ':scope > tbody';

  /**
   * Selector for table rows
   *
   * @type {string}
   */
  static TABLE_ITEMS_SEL = ':scope > tr';

  /**
   * Another selector for table rows
   * @type {string}
   */
  static TABLE_TR_SEL = 'tr';

  /**
   * Selector for table cells
   * @type {string}
   */
  static TABLE_TD_SEL = 'tr > td';

  /**
   * Employees form selector
   * @type {string}
   */
  static TABLE_FORM_SEL = '#employeesForm';

  /**
   * Table form class
   */
  static TABLE_FORM_CLASS = 'new-employee-form';

  /**
   * Sorting state of column
   *
   * @type {{ASC: number, DESC: number, NONE: number}}
   */
  static STATE = {
    ASC: 1,
    DESC: -1,
    NONE: 0,
  };

  static STATE_CLASS = {
    [EmployeesTable.STATE.ASC]: 'sorted-asc',
    [EmployeesTable.STATE.DESC]: 'sorted-desc',
    [EmployeesTable.STATE.NONE]: 'sorted-none',
  };

  /**
   * Active row class
   */
  static ACTIVE_ROW_CLASS = 'active';

  static FIELDS = [
    {
      GeneratorClass: InputFieldGenerator,
      tag: 'input',
      args: ['name'],
      required: true,
      type: 'text',
      validator: new MinStrLenValidator('name', 4),
    },
    {
      GeneratorClass: InputFieldGenerator,
      tag: 'input',
      args: ['position'],
      required: true,
      type: 'text',
      validator: new NotEmptyValidator('position'),
    },
    {
      GeneratorClass: SelectFieldGenerator,
      tag: 'select',
      args: [
        'office',
        [
          'Tokyo',
          'Singapore',
          'London',
          'New York',
          'Edinburgh',
          'San Francisco',
        ],
      ],
      required: true,
      type: 'select',
    },
    {
      GeneratorClass: InputFieldGenerator,
      tag: 'input',
      args: ['age'],
      required: true,
      type: 'number',
      validator: new NumScopeValidator('age', 18, 90),
    },
    {
      GeneratorClass: InputFieldGenerator,
      tag: 'input',
      args: ['salary'],
      required: true,
      type: 'number',
      formatter: MoneyAmountFormatter,
      validator: new NotEmptyValidator('salary'),
    },
  ];

  static FORM_CTA_LABEL = 'Save to table';

  static BASE_CURRENCY = '$';

  /**
   * Table element in HTML
   * @type {HTMLElement}
   */
  _tableElement;

  /**
   * Table element in HTML
   * @type {HTMLElement}
   */
  _employeeForm;

  /**
   * Sorter state
   * @type Object
   */
  _sorterState = {
    COLUMN_INDEX: -1,
    SORT: EmployeesTable.STATE.NONE,
  };

  /**
   * Custom comparator used for table
   * @type Array
   */
  _customComparators = [];

  /**
   * Custom notification manager
   *
   * @type CustomNotificationManager
   * @private
   */
  _customNotificationManager;

  /**
   * Active inline editor
   * @type InlineEditor
   */
  _activeEditor;

  /**
   * Constructor
   *
   * @param {string} tableDomSelector
   * @param {function[]} customComparators
   * @return void
   */
  constructor(tableDomSelector, customComparators = []) {
    if (typeof tableDomSelector !== 'string') {
      throw new Error('Table DOM selector must be a string');
    }

    // table
    this._tableElement = document.querySelector(tableDomSelector);

    if (!Array.isArray(customComparators)) {
      throw new Error('Custom comparators must be an array with comparators');
    }

    /**
     * Process custom comparators and bind to object
     */
    for (let i = 0; i < customComparators.length; i++) {
      this._customComparators[customComparators[i].index] =
        customComparators[i].comparator;
    }

    // init
    // get header elements
    /**
     * Node list of th
     * @type {NodeListOf<Element>}
     */
    const header = this._tableElement.querySelectorAll(
      EmployeesTable.TABLE_TH_SEL,
    );

    // add sorter handlers
    for (let colIndex = 0; colIndex < header.length; colIndex++) {
      header[colIndex].addEventListener('click', () => {
        this._sortByColumnHandler(colIndex);
      });
    }

    /**
     * Presume that we have single tbody
     */
    if (this._tableElement.tBodies[0] !== undefined) {
      /**
       * Add on click listener to select rows
       */
      this._tableElement.tBodies[0].addEventListener(
        'click',
        // eslint-disable-next-line no-shadow
        function (event) {
          // Find the closest 'tr' ancestor
          const targetRow = event.target.closest('tr');

          // If any
          if (targetRow) {
            // Clear all row.active selection
            this._tableElement
              .querySelectorAll(EmployeesTable.TABLE_TR_SEL)
              .forEach((tr) => {
                tr.classList.remove(EmployeesTable.ACTIVE_ROW_CLASS);
              });
            // Add row selection class
            targetRow.classList.add(EmployeesTable.ACTIVE_ROW_CLASS);
          }
        }.bind(this),
      );

      /**
       * Add on dblclick listener to edit cell
       */
      this._tableElement.tBodies[0].addEventListener(
        'dblclick',
        // eslint-disable-next-line no-shadow
        function (event) {
          // close inlineEditor if any
          if (this._activeEditor) {
            this._activeEditor.complete();
          }

          this._activeEditor = new InlineEditor(
            event.target,
            EmployeesTable.FIELDS,
            () => {
              this._activeEditor = null;

              // trigger sort of table only in case when it is sorted by
              if (this._sorterState.COLUMN_INDEX >= 0) {
                this._sortByColumn(this._sorterState.COLUMN_INDEX);
              }
            },
          );
        }.bind(this),
      );
    }

    // create employee form
    this._employeeForm = this._createEmployeeForm(
      EmployeesTable.TABLE_FORM_SEL.slice(1),
    );

    this._customNotificationManager = new CustomNotificationManager();
  }

  /**
   * Simple default value comparator for sort
   * @param {string} a
   * @param {string} b
   * @param {number} sortType (-1 / 0 / 1)
   * @private
   */
  _defaultComparator(a, b, sortType) {
    // normalize strings
    const normA = (a ?? '').trim();
    const normB = (b ?? '').trim();

    /**
     * Empty strings are always lower
     */
    if (normA === '' && normB === '') {
      return 0;
    }

    if (normA === '') {
      return -sortType;
    }

    if (normB === '') {
      return sortType;
    }

    // parse numbers - removes spaces and commas etc
    const numA = parseFloat(normA.replace(/\s|,/g, ''));
    const numB = parseFloat(normB.replace(/\s|,/g, ''));

    // check if both values are numeric to compare
    const bothNumeric =
      Number.isFinite(numA) &&
      Number.isFinite(numB) &&
      normA.match(/^-?\d+([.,]\d+)?$/) &&
      normB.match(/^-?\d+([.,]\d+)?$/);

    // compare as numeric
    if (bothNumeric) {
      return (numA - numB) * sortType;
    }

    // compare string case-insensitive
    return (
      normA.localeCompare(normB, undefined, { sensitivity: 'base' }) * sortType
    );
  }

  /**
   * Extract text value from cell
   * @param {HTMLTableRowElement} row
   * @param {number} colIndex
   */
  _extractCellValue(row, colIndex) {
    const cell = row.children[colIndex];

    return (cell?.textContent ?? '').trim();
  }

  /**
   * Handle click on head row to sort table by column
   *
   * @param colIndex
   * @private
   */
  _sortByColumnHandler(colIndex) {
    if (this._sorterState.COLUMN_INDEX === colIndex) {
      // reverse sort asc-desc
      this._sorterState.SORT *= -1;
    } else {
      // init sort
      this._sorterState.COLUMN_INDEX = colIndex;
      this._sorterState.SORT = EmployeesTable.STATE.ASC;
    }
    // execute sort by column
    this._sortByColumn(colIndex);
  }

  /**
   * Perform sort table by column
   * if column is not defined - just refresh sort
   *
   * @param columnIndex
   * @private
   */
  _sortByColumn(columnIndex = undefined) {
    const colIndex = columnIndex === undefined ? 0 : columnIndex;

    // prepare header row
    this._tableElement
      .querySelectorAll(EmployeesTable.TABLE_TH_SEL)
      .forEach((th, i) => {
        // clean up all sort classes assigned to th
        Object.values(EmployeesTable.STATE_CLASS).forEach((className) => {
          th.classList.remove(className);
        });

        // if this is sort target header column
        if (i === this._sorterState.COLUMN_INDEX) {
          // add actual sort state class to th element
          th.classList.add(EmployeesTable.STATE_CLASS[this._sorterState.SORT]);
        }
      });

    /**
     * table body
     * @type {Element}
     */
    const container = this._tableElement.querySelector(
      EmployeesTable.TABLE_TBODY_SEL,
    );

    /**
     * table rows
     * @type {Element[]}
     */
    const items = Array.from(
      container.querySelectorAll(EmployeesTable.TABLE_ITEMS_SEL),
    );

    // prepare custom sort function if any, otherwise use default one
    const compareFunc =
      typeof this._customComparators[colIndex] === 'function'
        ? this._customComparators[colIndex]
        : this._defaultComparator;

    // perform sort
    items
      .sort((rowA, rowB) => {
        const valueA = this._extractCellValue(rowA, colIndex);
        const valueB = this._extractCellValue(rowB, colIndex);

        return compareFunc(valueA, valueB, this._sorterState.SORT);
      })
      .forEach(
        // RE-APPEND == MOVE
        (el) => container.appendChild(el),
      );
  }

  /**
   * Create employee form
   *
   * @param {string} formId
   * @return HTMLFormElement
   */
  _createEmployeeForm(formId) {
    const form = document.createElement('form');

    form.id = formId;
    form.classList.add('new-employee-form');

    // form form fields
    for (const field of EmployeesTable.FIELDS) {
      const fieldInstance = new field.GeneratorClass();
      const element = fieldInstance.generateElement(
        true,
        field.required,
        field.type,
        ...field.args,
      );

      // add validator to data element
      if (field.validator && element.children[0]) {
        element.children[0].validator = field.validator.bindField(
          element.children[0],
        );
      }

      form.append(element);
    }

    // add submit button
    const submitButton = document.createElement('button');

    submitButton.type = 'submit';

    submitButton.textContent = EmployeesTable.FORM_CTA_LABEL;

    form.append(submitButton);
    form.addEventListener('submit', this._saveEmployee.bind(this));

    // add base class
    form.classList.add(EmployeesTable.TABLE_FORM_CLASS);

    // append form to body
    document.body.appendChild(form);

    return form;
  }

  /**
   * Validate and save record from employee form to table
   *
   * @param event
   * @private
   */
  // eslint-disable-next-line no-shadow
  _saveEmployee(event) {
    event.preventDefault();

    /**
     * Employee fields
     * @type {NodeList}
     */
    const employeeFields = this._employeeForm.querySelectorAll(
      InlineEditor.EMPLOYEE_FIELDS_SEL,
    );

    if (this.validateEmployee(employeeFields)) {
      /**
       * @type {Element} tBody
       */
      const tBody = this._tableElement.querySelector(
        EmployeesTable.TABLE_TBODY_SEL,
      );

      // append new row from builder
      tBody.appendChild(this._buildEmployeeRow(employeeFields));
      // trigger sort of table
      this._sortByColumn(this._sorterState.COLUMN_INDEX);
      // reset *save to table* form
      this._employeeForm.reset();
    }
  }

  /**
   * Validate an employee form: show error message or / and return result
   *
   * @param {NodeList} employeeFields
   * @return {boolean} result
   */
  validateEmployee(employeeFields) {
    let success = true;

    employeeFields.forEach((field) => {
      try {
        if (field.validator) {
          const validationResult = field.validator.validate();

          success = success && validationResult.success;

          /**
           * Usual flow use exception, but we support a direct result also
           */
          if (!validationResult.success) {
            this._customNotificationManager.pushNotification(
              'Validation failed',
              validationResult.message,
              CustomNotificationManager.NOTIFICATION_TYPE_ERROR,
            );
          }
        }
      } catch (e) {
        success = false;

        this._customNotificationManager.pushNotification(
          'Error',
          e.message,
          CustomNotificationManager.NOTIFICATION_TYPE_ERROR,
        );
      }
    });

    if (success) {
      this._customNotificationManager.pushNotification(
        'Success',
        'New row was successfully added.',
        CustomNotificationManager.NOTIFICATION_TYPE_SUCCESS,
      );
    }

    return success;
  }

  /**
   * Apply field formatter if it is defined
   *
   * @param def - definition of field in COLUMNS structure
   * @param value
   */
  applyFormatter(def, value) {
    const { formatter } = def || {};

    if (
      typeof formatter !== 'function' ||
      typeof formatter.format !== 'function'
    ) {
      return value;
    }

    try {
      return formatter.format(value);
    } catch {
      return value;
    }
  }

  /**
   * Build employee row / fields based on passed employee field's values
   *
   * @type {NodeList} Employee employeeFields
   */
  _buildEmployeeRow(employeeFields) {
    /**
     * @type {HTMLTableRowElement} employeeRow
     */
    const employeeRow = document.createElement('tr');

    // map employee fields by name
    const employeeFieldsByName = new Map();

    for (const element of employeeFields) {
      const elementName = element.name;

      if (elementName) {
        employeeFieldsByName.set(elementName, element);
      }
    }

    // format values if any formatter is in preset
    for (const field of EmployeesTable.FIELDS) {
      const fieldElementName = field.args[0];
      const fieldElement = fieldElementName
        ? employeeFieldsByName.get(fieldElementName)
        : undefined;
      const fieldElementVal = fieldElement ? fieldElement.value : '';
      const formattedVal = this.applyFormatter(field, fieldElementVal);

      /**
       * @type {HTMLTableCellElement} employeeField
       */
      const employeeFieldElement = document.createElement('td');

      employeeFieldElement.textContent = formattedVal;
      employeeRow.appendChild(employeeFieldElement);
    }

    return employeeRow;
  }
}

// prepare custom sorter for money column
const ourComparators = [
  {
    index: 4, // for salary index
    comparator: function (a, b, sortType) {
      return (
        (parseFloat(a.replace(/[^0-9.,]/g, '')) -
          parseFloat(b.replace(/[^0-9.,]/g, ''))) *
        sortType
      );
    },
  },
];

// Ensure instantiation occurs after the table exists
document.addEventListener('DOMContentLoaded', function () {
  // eslint-disable-next-line no-unused-vars
  const employeesTable = new EmployeesTable(
    EmployeesTable.TABLE_SEL,
    ourComparators,
  );
});

'use strict';

Cypress.Commands.add('fillNewEmployeeForm',
  (fullName, position, city, age, salary) => {
    cy.get('[data-qa="name"]').type(fullName);
    cy.get('[data-qa="position"]').type(position);
    cy.get('[data-qa="city"]').select(city);
    cy.get('[data-qa="age"]').type(age);
    cy.get('[data-qa="salary"]').type(salary);
    cy.get('button').contains('Save to table').click();
  });

Cypress.Commands.add('checkDataDoesntExist',
  (fullName, salary) => {
    cy.get('tbody').contains(fullName).should('not.exist');
    cy.get('tbody').contains(salary).should('not.exist');
  });

Cypress.Commands.add('hasData', (inputName, compareValue) => {
  cy.contains(inputName).parent().should(($column) => {
    const array = [...$column].map((td) => td.innerText.split('\t'));

    for (let i = 0; i < 5; i++) {
      expect(array[0][i]).to.equal(compareValue[i]);
    }
  });
});

Cypress.Commands.add('isSortedASC', (columnName, columnNumber) => {
  cy.contains(columnName).click();

  cy.get(`tr:nth-child(n) td:nth-child(${columnNumber})`).then(($column) => {
    const columns = [...$column].map((column) =>
      column.innerText.replace('$', '').replace(',', ''));
    let counter = 0;

    for (let i = 0; i < columns.length; i++) {
      if (isNaN(Number(columns[i]))) {
        if (columns[i].localeCompare(columns[i + 1]) === -1) {
          counter += 1;
        }
      }

      if (Number(columns[i + 1]) >= Number(columns[i])) {
        counter += 1;
      }
    }
    expect(counter).to.equal(columns.length - 1);
  });
});

Cypress.Commands.add('isSortedDESC', (columnName, columnNumber) => {
  cy.contains(columnName).dblclick();

  cy.get(`tr:nth-child(n) td:nth-child(${columnNumber})`).then(($column) => {
    const columns = [...$column].map((column) =>
      column.innerText.replace('$', '').replace(',', ''));
    let counter = 0;

    for (let i = 0; i < columns.length; i++) {
      if (isNaN(Number(columns[i]))) {
        if (columns[i].localeCompare(columns[i + 1]) === 1) {
          counter += 1;
        }
      }

      if (Number(columns[i + 1]) <= Number(columns[i])) {
        counter += 1;
      }
    }
    expect(counter).to.equal(columns.length - 1);
  });
});

describe('Employees table', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should sort by name ASC', () => {
    cy.isSortedASC('Name', 1);
  });

  it('should sort by name DESC', () => {
    cy.isSortedDESC('Name', 1);
  });

  it('should sort by age ASC', () => {
    cy.isSortedASC('Age', 4);
  });

  it('should sort by age DESC', () => {
    cy.isSortedDESC('Age', 4);
  });

  it('should sort by salary ASC', () => {
    cy.isSortedASC('Salary', 5);
  });

  it('should sort by salary DESC', () => {
    cy.isSortedDESC('Salary', 5);
  });

  it('should have proper values in rows after the sorting ASC', () => {
    cy.get('th').contains('Name').click();

    cy.hasData('Airi Satou',
      ['Airi Satou', 'Accountant', 'Tokyo', '33', '$162,700']);
  });

  it('should have proper values in rows after the sorting DESC', () => {
    cy.get('th').contains('Name').dblclick();

    cy.hasData('Zorita Serrano', ['Zorita Serrano', 'Software Engineer',
      'San Francisco', '56', '$115,000']);
  });

  it('row should have class active after click', () => {
    cy.contains('Airi Satou').parent().should('not.have.class', 'active');
    cy.contains('Airi Satou').click();
    cy.contains('Airi Satou').parent().should('have.class', 'active');
  });

  it('should be able to add a new employee', () => {
    cy.fillNewEmployeeForm('Adam', 'QA Engineer', 'San Francisco', 18, 50000);

    cy.get('[data-qa="notification"]').should('have.class', 'success');

    cy.hasData('Adam',
      ['Adam', 'QA Engineer', 'San Francisco', '18', '$50,000']);
  });

  it(`should have warning notification on name field
   with invalid input`, () => {
    cy.fillTable('Ada', 'QA Engineer', 'San Francisco', 18, 50000);

    cy.get('[data-qa="notification"]').should('have.class', 'error');
    cy.checkDataDoesntExist('Ada', 50000);
  });

  it(`should have warning notification on position 
  field with invalid input`, () => {
    cy.get('[data-qa="name"]').type('Adam');
    cy.get('[data-qa="city"]').select('San Francisco');
    cy.get('[data-qa="age"]').type('18{enter}');
    cy.get('[data-qa="salary"]').type('50000{enter}');
    cy.get('button').contains('Save to table').click();

    cy.get('[data-qa="notification"]').should('have.class', 'error');
    cy.checkDataDoesntExist('Adam', 50000);
  });

  it(`should have warning notification on age field
   if the age less than 18`, () => {
    cy.fillTable('Adam', 'QA Engineer', 'San Francisco', 17, 50000);

    cy.get('[data-qa="notification"]').should('have.class', 'error');
    cy.checkDataDoesntExist('Adam', 50000);
  });

  it(`should have warning notification on age field
   if the age bigger than 90`, () => {
    cy.fillTable('Adam', 'QA Engineer', 'San Francisco', 91, 50000);

    cy.get('[data-qa="notification"]').should('have.class', 'error');
    cy.checkDataDoesntExist('Adam', 50000);
  });
});

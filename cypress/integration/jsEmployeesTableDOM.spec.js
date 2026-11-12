'use strict';

Cypress.Commands.add('fillNewEmployeeForm',
  (fullName, position, city, age, salary) => {
    cy.get('[data-qa="name"]').type(fullName);
    cy.get('[data-qa="position"]').type(position);
    cy.get('[data-qa="office"]').select(city);
    cy.get('[data-qa="age"]').type(age);
    cy.get('[data-qa="salary"]').type(salary);
    cy.get('button').contains('Save to table').click();
  });

Cypress.Commands.add('checkDataDoesntExist',
  (fullName, salary) => {
    cy.get('tbody').contains(fullName).should('not.exist');
    cy.get('tbody').contains(salary).should('not.exist');
  });

Cypress.Commands.add('compareRowValuesAfterSort',
  (employeeName, expectedValues) => {
    cy.contains('tr', employeeName).find('td').should(($rowValues) => {
      for (let i = 0; i < 5; i++) {
        expect($rowValues.get(i).innerText).to.equal(expectedValues[i]);
      }
    });
  });

const ColumnsNames = {
  name: 1,
  position: 2,
  office: 3,
  age: 4,
  salary: 5,
};

const checkValuesSorted = function(value1, value2) {
  if (isNaN(Number(value1))) {
    if (value1.localeCompare(value2) === -1) {
      return true;
    }
  }

  if (Number(value2) >= Number(value1)) {
    return true;
  }

  return false;
};

Cypress.Commands.add('checkValuesSorted', (columnName, direction) => {
  cy.get(
    `tr:nth-child(n) td:nth-child(${ColumnsNames[columnName.toLowerCase()]})`
  ).then(($rowValues) => {
    const columnValues = [...$rowValues].map((rowValue) =>
      rowValue.innerText.replace('$', '').replace(',', ''));

    for (let i = 1; i < columnValues.length; i++) {
      if (direction === 'ASC') {
        expect(checkValuesSorted(columnValues[i - 1], columnValues[i]))
          .to.be.true;
      } else if (direction === 'DESC') {
        expect(checkValuesSorted(columnValues[i], columnValues[i - 1]))
          .to.be.true;
      }
    }
  });
});

describe('Employees table', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should sort by name ASC', () => {
    cy.contains('Name').click();
    cy.checkValuesSorted('Name', 'ASC');
  });

  it('should sort by name DESC', () => {
    cy.contains('Name').dblclick();
    cy.checkValuesSorted('Name', 'DESC');
  });

  it('should sort by age ASC', () => {
    cy.contains('Age').click();
    cy.checkValuesSorted('Age', 'ASC');
  });

  it('should sort by age DESC', () => {
    cy.contains('Age').dblclick();
    cy.checkValuesSorted('Age', 'DESC');
  });

  it('should sort by salary ASC', () => {
    cy.contains('Salary').click();
    cy.checkValuesSorted('Salary', 'ASC');
  });

  it('should sort by salary DESC', () => {
    cy.contains('Salary').dblclick();
    cy.checkValuesSorted('Salary', 'DESC');
  });

  it('should have proper values in rows after the sorting ASC', () => {
    cy.get('th').contains('Name').click();

    cy.compareRowValuesAfterSort('Airi Satou',
      ['Airi Satou', 'Accountant', 'Tokyo', '33', '$162,700']);
  });

  it('should have proper values in rows after the sorting DESC', () => {
    cy.get('th').contains('Name').dblclick();

    cy.compareRowValuesAfterSort('Zorita Serrano',
      ['Zorita Serrano', 'Software Engineer',
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

    cy.compareRowValuesAfterSort('Adam',
      ['Adam', 'QA Engineer', 'San Francisco', '18', '$50,000']);
  });

  it(`should have warning notification on name field
   with invalid input`, () => {
    cy.fillNewEmployeeForm('Ada', 'QA Engineer', 'San Francisco', 18, 50000);

    cy.get('[data-qa="notification"]').should('have.class', 'error');
    cy.checkDataDoesntExist('Ada', 50000);
  });

  it(`should have warning notification on position 
  field with invalid input`, () => {
    cy.get('[data-qa="name"]').type('Adam');
    cy.get('[data-qa="office"]').select('San Francisco');
    cy.get('[data-qa="age"]').type('18{enter}');
    cy.get('[data-qa="salary"]').type('50000{enter}');
    cy.get('button').contains('Save to table').click();

    cy.get('[data-qa="notification"]').should('have.class', 'error');
    cy.checkDataDoesntExist('Adam', 50000);
  });

  it(`should have warning notification on age field
   if the age less than 18`, () => {
    cy.fillNewEmployeeForm('Adam', 'QA Engineer', 'San Francisco', 17, 50000);

    cy.get('[data-qa="notification"]').should('have.class', 'error');
    cy.checkDataDoesntExist('Adam', 50000);
  });

  it(`should have warning notification on age field
   if the age bigger than 90`, () => {
    cy.fillNewEmployeeForm('Adam', 'QA Engineer', 'San Francisco', 91, 50000);

    cy.get('[data-qa="notification"]').should('have.class', 'error');
    cy.checkDataDoesntExist('Adam', 50000);
  });

  it('should edit a cell and format an edited salary', () => {
    cy.contains('td', '$162,700').dblclick();
    cy.get('.cell-input').should('have.value', '162700');
    cy.get('.cell-input').clear();
    cy.get('.cell-input').type('200000{enter}');

    cy.contains('td', '$200,000').should('exist');
    cy.get('.cell-input').should('not.exist');
  });

  it('should reject an edited age outside the allowed range', () => {
    cy.contains('tr', 'Airi Satou').find('td').eq(3).dblclick();
    cy.get('.cell-input').clear();
    cy.get('.cell-input').type('17{enter}');

    cy.contains('tr', 'Airi Satou').find('td').eq(3).should('have.text', '33');
    cy.get('[data-qa="notification"]').should('have.class', 'error');
  });

  it('should reject an office not available in the form', () => {
    cy.contains('tr', 'Airi Satou').find('td').eq(2).dblclick();
    cy.get('.cell-input').clear();
    cy.get('.cell-input').type('Mars{enter}');

    cy.contains('tr', 'Airi Satou')
      .find('td')
      .eq(2)
      .should('have.text', 'Tokyo');
    cy.get('[data-qa="notification"]').should('have.class', 'error');
  });

  it('should save the current cell before editing another one', () => {
    cy.contains('td', 'Airi Satou').dblclick();
    cy.get('.cell-input').clear();
    cy.get('.cell-input').type('Airi Sato');
    cy.contains('td', 'Accountant').dblclick();

    cy.contains('td', 'Airi Sato').should('exist');
    cy.get('.cell-input').should('have.length', 1);
  });
});

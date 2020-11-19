'use strict';

describe('Test', () => {
  beforeEach('Open site', () => {
    cy.visit('http://localhost:8080/');
  });

  it('sort by name ASC', () => {
    cy.get('th').contains('Name').click();

    cy.get('tbody > :nth-child(1) > :nth-child(1)')
      .contains('Airi Satou').should('exist');
  });

  it('sort by name DESC', () => {
    cy.get('th').contains('Name').dblclick();

    cy.get('tbody > :nth-child(1) > :nth-child(1)')
      .contains('Zorita Serrano').should('exist');
  });

  it('sort by position ASC', () => {
    cy.get('th').contains('Position').click();

    cy.get('tbody > :nth-child(1) > :nth-child(2)')
      .contains('Accountant').should('exist');
  });

  it('sort by position DESC', () => {
    cy.get('th').contains('Position').dblclick();

    cy.get('tbody > :nth-child(1) > :nth-child(2)')
      .contains('Technical Author').should('exist');
  });

  it('sort by office ASC', () => {
    cy.get('th').contains('Office').click();

    cy.get('tbody > :nth-child(1) > :nth-child(3)')
      .contains('Edinburgh').should('exist');
  });

  it('sort by office DESC', () => {
    cy.get('th').contains('Office').dblclick();

    cy.get('tbody > :nth-child(1) > :nth-child(3)')
      .contains('Tokyo').should('exist');
  });

  it('sort by age ASC', () => {
    cy.get('th').contains('Age').click();

    cy.get('tbody > :nth-child(1) > :nth-child(4)')
      .contains(20).should('exist');
  });

  it('sort by age DESC', () => {
    cy.get('th').contains('Age').dblclick();

    cy.get('tbody > :nth-child(1) > :nth-child(4)')
      .contains(66).should('exist');
  });

  it('sort by salary ASC', () => {
    cy.get('th').contains('Salary').click();

    cy.get('tbody > :nth-child(1) > :nth-child(5)')
      .contains('$98,540').should('exist');
  });

  it('sort by salary DESC', () => {
    cy.get('th').contains('Salary').dblclick();

    cy.get('tbody > :nth-child(1) > :nth-child(5)')
      .contains('$452,500').should('exist');
  });

  it('shoud have class active after click', () => {
    cy.get('tbody > :nth-child(1) > :nth-child(1)').click();
    cy.get('tr').should('have.class', 'active');
  });

  it('edit name by double click', () => {
    cy.get('body').then(($body) => {
      cy.get('tbody > tr:nth-child(1) > td:nth-child(1)').dblclick()
        .then(() => {
          if ($body.find('[class="cell-input"]').length > 0) {
            cy.get('[class="cell-input"]').clear().type('Ihor Oliinyk{enter}');
            cy.contains('Ihor Oliinyk');
          } else {
            cy.get(' tbody > tr:nth-child(1) > td:nth-child(1)');
          }
        });
    });
  });

  it('edit position by double click', () => {
    cy.get('body').then(($body) => {
      cy.get('tbody > tr:nth-child(1) > td:nth-child(2)').dblclick()
        .then(() => {
          if ($body.find('[class="cell-input"]').length > 0) {
            cy.get('[class="cell-input"]').clear().type('COO{enter}');
            cy.contains('COO');
          } else {
            cy.get(' tbody > tr:nth-child(1) > td:nth-child(2)');
          }
        });
    });
  });

  it('edit office by double click', () => {
    cy.get('body').then(($body) => {
      cy.get('tbody > tr:nth-child(1) > td:nth-child(3)').dblclick()
        .then(() => {
          if ($body.find('[class="cell-input"]').length > 0) {
            cy.get('[class="cell-input"]').clear().type('Kyiv{enter}');
            cy.contains('Kyiv');
          } else {
            cy.get(' tbody > tr:nth-child(1) > td:nth-child(3)');
          }
        });
    });
  });

  it('edit age by double click', () => {
    cy.get('body').then(($body) => {
      cy.get('tbody > tr:nth-child(1) > td:nth-child(4)').dblclick()
        .then(() => {
          if ($body.find('[class="cell-input"]').length > 0) {
            cy.get('[class="cell-input"]').clear().type('29{enter}');
            cy.contains(29);
          } else {
            cy.get(' tbody > tr:nth-child(1) > td:nth-child(4)');
          }
        });
    });
  });

  it('edit salary by double click', () => {
    cy.get('body').then(($body) => {
      cy.get('tbody > tr:nth-child(1) > td:nth-child(5)').dblclick()
        .then(() => {
          if ($body.find('[class="cell-input"]').length > 0) {
            cy.get('[class="cell-input"]').clear().type('$120,000{enter}');
            cy.contains('$120,000');
          } else {
            cy.get(' tbody > tr:nth-child(1) > td:nth-child(5)');
          }
        });
    });
  });

  it('create an employee', () => {
    cy.get('[name="name"]').type('Adam{enter}');
    cy.get('[name="position"]').type('QA Engineer{enter}');
    cy.get('select').select('San Francisco');
    cy.get('[name="age"]').type('18{enter}');
    cy.get('[name="salary"]').type('50000{enter}');
    cy.get('button').contains('Save to table').click();

    cy.get('.notification').contains('Success!').should('exist');

    cy.get('tbody').contains('Adam');
    cy.get('tbody').contains('QA Engineer');
    cy.get('tbody').contains('18');
    cy.get('tbody').contains('$50,000');
  });

  it('validation notification on name field', () => {
    cy.get('[name="name"]').then(($input) => {
      expect($input[0].validationMessage).to.exist;
    });
  });

  it('validation notification on position field', () => {
    cy.get('[name="name"]').type('Adam{enter}');

    cy.get('[name="position"]').then(($input) => {
      expect($input[0].validationMessage).to.exist;
    });
  });

  it('validation notification on age field', () => {
    cy.get('[name="name"]').type('Adam{enter}');
    cy.get('[name="position"]').type('QA Engineer{enter}');

    cy.get('[name="age"]').then(($input) => {
      expect($input[0].validationMessage).to.exist;
    });
  });

  it('validation notification on age field', () => {
    cy.get('[name="name"]').type('Adam{enter}');
    cy.get('[name="position"]').type('QA Engineer{enter}');

    cy.get('[name="age"]').then(($input) => {
      expect($input[0].validationMessage).to.exist;
    });
  });

  it('validation notification on salary field', () => {
    cy.get('[name="name"]').type('Adam{enter}');
    cy.get('[name="position"]').type('QA Engineer{enter}');
    cy.get('select').select('San Francisco');
    cy.get('[name="age"]').type('30{enter}');

    cy.get('[name="salary"]').then(($input) => {
      expect($input[0].validationMessage).to.exist;
    });
  });

  it('age less than 18', () => {
    cy.get('[name="name"]').type('Adam{enter}');
    cy.get('[name="position"]').type('QA Engineer{enter}');
    cy.get('select').select('San Francisco');
    cy.get('[name="age"]').type('17{enter}');
    cy.get('[name="salary"]').type('300000{enter}');
    cy.get('button').contains('Save to table').click();

    cy.get('.notification').contains('Error').should('exist');
  });

  it('age bigger than 90', () => {
    cy.get('[name="name"]').type('Adam{enter}');
    cy.get('[name="position"]').type('QA Engineer{enter}');
    cy.get('select').select('San Francisco');
    cy.get('[name="age"]').type('91{enter}');
    cy.get('[name="salary"]').type('300000{enter}');
    cy.get('button').contains('Save to table').click();

    cy.get('.notification').contains('Error').should('exist');
  });

  it('salary less than $50000', () => {
    cy.get('[name="name"]').type('Adam{enter}');
    cy.get('[name="position"]').type('QA Engineer{enter}');
    cy.get('select').select('San Francisco');
    cy.get('[name="age"]').type('23{enter}');
    cy.get('[name="salary"]').type('49999{enter}');
    cy.get('button').contains('Save to table').click();

    cy.get('.notification').contains('Error').should('exist');
  });
});

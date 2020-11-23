'use strict';

describe('Employees table', () => {
  beforeEach('Open site', () => {
    cy.visit('/');
  });

  it('should sort by name ASC', () => {
    cy.get('th').contains('Name').click();

    cy.get('tbody > :nth-child(1) > :nth-child(1)')
      .contains('Airi Satou');
  });

  it('should sort by name DESC', () => {
    cy.get('th').contains('Name').dblclick();

    cy.get('tbody > :nth-child(1) > :nth-child(1)')
      .contains('Zorita Serrano');
  });

  it('should sort by position ASC', () => {
    cy.get('th').contains('Position').click();

    cy.get('tbody > :nth-child(1) > :nth-child(2)')
      .contains('Accountant');
  });

  it('should sort by position DESC', () => {
    cy.get('th').contains('Position').dblclick();

    cy.get('tbody > :nth-child(1) > :nth-child(2)')
      .contains('Technical Author');
  });

  it('should sort by office ASC', () => {
    cy.get('th').contains('Office').click();

    cy.get('tbody > :nth-child(1) > :nth-child(3)')
      .contains('Edinburgh');
  });

  it('should sort by office DESC', () => {
    cy.get('th').contains('Office').dblclick();

    cy.get('tbody > :nth-child(1) > :nth-child(3)')
      .contains('Tokyo');
  });

  it('should sort by age ASC', () => {
    cy.get('th').contains('Age').click();

    cy.get('tbody > :nth-child(1) > :nth-child(4)')
      .contains(20);
  });

  it('should sort by age DESC', () => {
    cy.get('th').contains('Age').dblclick();

    cy.get('tbody > :nth-child(1) > :nth-child(4)')
      .contains(66);
  });

  it('should sort by salary ASC', () => {
    cy.get('th').contains('Salary').click();

    cy.get('tbody > :nth-child(1) > :nth-child(5)')
      .contains('$98,540');
  });

  it('should sort by salary DESC', () => {
    cy.get('th').contains('Salary').dblclick();

    cy.get('tbody > :nth-child(1) > :nth-child(5)')
      .contains('$452,500');
  });

  it('row should have class active after click', () => {
    cy.get('tbody > :nth-child(1) > :nth-child(1)').click();
    cy.get('tr').should('have.class', 'active');
  });

  it('should be able to add a new employee', () => {
    cy.get('[data-qa="name"]').type('Adam{enter}');
    cy.get('[data-qa="position"]').type('QA Engineer{enter}');
    cy.get('data-qa="city"').select('San Francisco');
    cy.get('[data-qa="age"]').type('18{enter}');
    cy.get('[data-qa="salary"]').type('50000{enter}');
    cy.get('button').contains('Save to table').click();

    cy.get('[data-qa="notification"]').should('have.class', 'success');

    cy.get('tbody').contains('Adam');
    cy.get('tbody').contains('QA Engineer');
    cy.get('tbody').contains('18');
    cy.get('tbody').contains('$50,000');
  });

  it('should have warning notification on name field with invalid input', () => {
    cy.get('[data-qa="name"]').type('Ada{enter}');
    cy.get('[data-qa="position"]').type('QA Engineer{enter}');
    cy.get('data-qa="city"').select('San Francisco');
    cy.get('[data-qa="age"]').type('18{enter}');
    cy.get('[data-qa="salary"]').type('50000{enter}');
    cy.get('button').contains('Save to table').click();

    cy.get('[data-qa="notification"]').should('have.class', 'warning');
  });

  it('should have warning notification on position field with invalid input', () => {
    cy.get('[name="name"]').type('Adam{enter}');
    cy.get('select').select('San Francisco');
    cy.get('[name="age"]').type('30{enter}');
    cy.get('[data-qa="salary"]').type('50000{enter}');
    cy.get('button').contains('Save to table').click();

    cy.get('[data-qa="notification"]').should('have.class', 'warning');
  });

  it('should have warning notification on age field if the age less than 18', () => {
    cy.get('[name="name"]').type('Adam{enter}');
    cy.get('[name="position"]').type('QA Engineer{enter}');
    cy.get('select').select('San Francisco');
    cy.get('[name="age"]').type('17{enter}');
    cy.get('[name="salary"]').type('300000{enter}');
    cy.get('button').contains('Save to table').click();

    cy.get('[data-qa="notification"]').should('have.class', 'warning');
  });

  it('should have warning notification on age field if the age bigger than 90', () => {
    cy.get('[name="name"]').type('Adam{enter}');
    cy.get('[name="position"]').type('QA Engineer{enter}');
    cy.get('select').select('San Francisco');
    cy.get('[name="age"]').type('91{enter}');
    cy.get('[name="salary"]').type('300000{enter}');
    cy.get('button').contains('Save to table').click();

    cy.get('[data-qa="notification"]').should('have.class', 'warning');
  });

  it('should have warning notification on salary field if the salary less than $50000', () => {
    cy.get('[name="name"]').type('Adam{enter}');
    cy.get('[name="position"]').type('QA Engineer{enter}');
    cy.get('select').select('San Francisco');
    cy.get('[name="age"]').type('23{enter}');
    cy.get('[name="salary"]').type('49999{enter}');
    cy.get('button').contains('Save to table').click();

    cy.get('[data-qa="notification"]').should('have.class', 'warning');
  });
});

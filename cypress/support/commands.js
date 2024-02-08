import './commands'

Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function() {
    cy.get('#firstName').type('André')
    cy.get('#lastName').type('Farias')
    cy.get('#email').type('andre@email.com')
    cy.get('#open-text-area').type('The quick brown fox jumps over the lazy dog', {delay: 0})
    
    cy.contains('button', 'Enviar').click()
})
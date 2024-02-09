it('1 - Encontre o gato', function () {
    cy.visit('./src/index.html')
    
    cy.get('#cat').invoke('show').should('be.visible')
})
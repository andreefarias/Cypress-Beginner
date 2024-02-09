Cypress._.times(5, function () {
  it('1 - Acessa a página da política de privacidade removendo o target e então clicando no link', function () {
    cy.visit('./src/privacy.html')

    cy.contains('Talking About Testing').should('be.visible')
  })
})
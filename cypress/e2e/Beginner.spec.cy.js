/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function () {
  const THREE_SECONDS_IN_MS = 3000

  beforeEach(() => {
    cy.visit('./src/index.html')
  })

  it('1 - Verifica o título da aplicação', function () {
    cy.title().should('be.equals', 'Central de Atendimento ao Cliente TAT')
  })

  it('2 - Preenche os campos obrigatórios e envia', function () {
    cy.clock()

    cy.get('#firstName').type('André')
    cy.get('#lastName').type('Farias')
    cy.get('#email').type('andre@email.com')
    cy.get('#open-text-area').type('The quick brown fox jumps over the lazy dog', { delay: 0 })

    cy.contains('button', 'Enviar').click()

    cy.get('.success').should('be.visible')

    cy.tick(THREE_SECONDS_IN_MS)

    cy.get('.success').should('not.be.visible')
  })

  it('3 - Exibe mensagem de erro ao submeter um email com formatação inválida', function () {
    cy.clock()

    cy.get('#firstName').type('André')
    cy.get('#lastName').type('Farias')
    cy.get('#email').type('af')
    cy.get('#open-text-area').type('The quick brown fox jumps over the lazy dog', { delay: 0 })

    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')

    cy.tick(THREE_SECONDS_IN_MS)

    cy.get('.error').should('not.be.visible')
  })

  it('4 - Campo telefone permanece vazio quando adiciona texto', function () {
    cy.get('#phone').type('André').should('have.value', '')
  })

  it('5 - Exibe mensagem de erro ao não preencher campos obrigatórios', function () {
    cy.clock()

    cy.get('#firstName').type('André')
    cy.get('#lastName').type('Farias')
    cy.get('#email').type('andre@gmail.com')
    cy.get('#open-text-area').type('The quick brown fox jumps over the lazy dog', { delay: 0 })
    cy.get('#phone-checkbox').check()

    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')

    cy.tick(THREE_SECONDS_IN_MS)

    cy.get('.error').should('not.be.visible')
  })

  it('6 - Preenche e limpa os campos nome, sobrenome, email e telefone', function () {
    cy.get('#firstName').type('André').should('have.value', 'André').clear().should('have.value', '')
    cy.get('#lastName').type('Farias').should('have.value', 'Farias').clear().should('have.value', '')
    cy.get('#email').type('andre@gmail.com').should('have.value', 'andre@gmail.com').clear().should('have.value', '')
    cy.get('#phone').type('12345678').should('have.value', '12345678').clear().should('have.value', '')
    cy.get('#open-text-area').type('The quick brown fox jumps over the lazy dog', { delay: 0 }).should('have.value', 'The quick brown fox jumps over the lazy dog').clear().should('have.value', '')

    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')
  })

  it('7 - Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {
    cy.clock()

    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')

    cy.tick(THREE_SECONDS_IN_MS)

    cy.get('.error').should('not.be.visible')
  })

  it('8 - Envia o formuário com sucesso usando um comando customizado', function () {
    cy.clock()

    cy.fillMandatoryFieldsAndSubmit()

    cy.get('.success').should('be.visible')

    cy.tick(THREE_SECONDS_IN_MS)

    cy.get('.success').should('not.be.visible')
  })

  it('9 - Seleciona um produto (YouTube) por seu texto', function () {
    cy.get('#product').select('Mentoria').should('have.value', 'mentoria')
  })

  it('10 - Marca o tipo de atendimento "Feedback"', function () {
    cy.get('input[type="radio"][value="feedback"]').check().should('have.value', 'feedback')
  })

  it('11 - Marca cada tipo de atendimento', function () {
    cy.get('input[type="radio"]').should('have.length', 3)
      .each(function ($radio) {
        cy.wrap($radio).check()
        cy.wrap($radio).should('be.checked')
      })
  })

  it('12 - Marca ambos checkboxes, depois desmarca o último', function () {
    cy.get('input[type="checkbox"]').check().should('be.checked').last().uncheck().should('not.be.checked')
  })

  it('13 - Seleciona um arquivo da pasta fixtures', function () {
    cy.get('input[type="file"]').should('not.have.value').selectFile('./cypress/fixtures/example.json')
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })

  it('14 - Seleciona um arquivo simulando um drag-and-drop', function () {
    cy.get('input[type="file"]').should('not.have.value').selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })

  it('15 - Seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
    cy.fixture('example.json').as('sampleFile')
    cy.get('input[type="file"]').selectFile('@sampleFile')
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal('example.json')
      })
  })

  it('16 - Verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function () {
    cy.get('#privacy a').should('have.attr', 'target', '_blank')
  })

  it('17 - Acessa a página da política de privacidade removendo o target e então clicando no link', function () {
    cy.get('#privacy a').invoke('removeAttr', 'target').click()

    cy.contains('Talking About Testing').should('be.visible')
  })

  it('18 - Exibe e esconde as mensagens de sucesso e erro usando o .invoke', function () {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it('19 - Preenche a area de texto usando o comando invoke', function () {
    const longText = Cypress._.repeat('0123456789', 20)

    cy.get('#open-text-area').invoke('val', longText).should('have.value', longText)
  })

  it('20 - Faz uma requisição HTTP', function () {
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      .should(function (response) {
        const { status, statusText, body } = response
        expect(status).to.equal(200)
        expect(statusText).to.equal('OK')
        expect(body).to.include('CAC TAT')
      })
  })
})
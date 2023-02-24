Cypress.Commands.add('login', ({ username, password }) => {
    cy.visit('http://localhost:3000')
    cy.contains('log in').click()
    cy.get('#username').type(username)
    cy.get('#password').type(password)
    cy.get('#login-button').click()
})

Cypress.Commands.add('logout', () => {
    cy.get('#logout-button').click()
    cy.visit('http://localhost:3000')

})
Cypress.Commands.add('createBlog', ({ title, author, url }) => {
    cy.get('#title').type(title)
    cy.get('#author').type(author)
    cy.get('#url').type(url)
    cy.get('#create-button').click()
})

describe('Blog app', function() {
    beforeEach(function() {
        let backendUrl = `${Cypress.env('BACKEND')}`
        cy.request('POST', backendUrl + '/testing/reset')
        const user = {
            name: 'super user for test',
            username: 'admin',
            password: 'super'
        }
        cy.request('POST', backendUrl + '/users/', user)
        cy.visit('')
    })

    it('Login form is shown', function() {
        cy.contains('log in')
    })

    describe('Login',function() {
        it('succeeds with correct credentials', function() {
            cy.contains('log in').click()
            cy.get('#username').type('admin')
            cy.get('#password').type('super')
            cy.get('#login-button').click()

            cy.contains('super user for test logged-in')
        })

        it('fails with wrong credentials', function() {
            cy.contains('log in').click()
            cy.get('#username').type('admin')
            cy.get('#password').type('false')
            cy.get('#login-button').click()

            cy.get('.error')
                .should('contain','Wrong credentials')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
        })
    })

    describe('When logged in', function() {
        beforeEach(function() {
            cy.contains('log in').click()
            cy.get('#username').type('admin')
            cy.get('#password').type('super')
            cy.get('#login-button').click()
        })

        it('A blog can be created', function() {
            let newBLog = {
                title:'cypress is power full for E2E tests',
                author:'mohammed stitane',
                url:'https://www.linkedin.com/in/mstitane/'
            }
            cy.contains('new blog').click()
            cy.createBlog(newBLog)

            cy.get('.blog').contains(newBLog.title)
        })
        it('A user can like a blog', function() {
            let newBLog = {
                title:'cypress is power full for E2E tests',
                author:'mohammed stitane',
                url:'https://www.linkedin.com/in/mstitane/'
            }
            cy.contains('new blog').click()
            cy.createBlog(newBLog)

            cy.get('.blog').contains('view').click()
            cy.get('#button-likes').click()
            cy.get('#nb-likes').should('contain', 1)
        })
        it('A user who created a blog can delete it', function() {

            let newBLog = {
                title:'cypress is power full for E2E tests',
                author:'mohammed stitane',
                url:'https://www.linkedin.com/in/mstitane/'
            }
            cy.contains('new blog').click()
            cy.createBlog(newBLog)

            cy.get('.blog').contains('view').click()
            cy.get('.blog').contains('remove').click()
            cy.on('window:confirm', () => true)
            cy.get('.blog').should('not.exist')
        })
    })

    describe('When others logged in', function() {
        beforeEach(function() {
            let backendUrl = `${Cypress.env('BACKEND')}`
            const user = {
                name: 'another user',
                username: 'test',
                password: 'test'
            }
            cy.request('POST', backendUrl + '/users/', user)
        })
        it('A user who do not created a blog can not delete it', function() {
            cy.login({ username: 'admin', password: 'super' })
            let newBLog = {
                title:'cypress is power full for E2E tests',
                author:'mohammed stitane',
                url:'https://www.linkedin.com/in/mstitane/'
            }
            cy.contains('new blog').click()
            cy.createBlog(newBLog)

            cy.get('.blog').contains(newBLog.title)

            cy.logout()

            cy.login({ username: 'test', password: 'test' })
            cy.get('.blog').contains('view').click()
            cy.get('.blog').contains('remove').should('be.hidden')
        })
    })

    describe('the blogs are ordered ', function() {
        let newBLog1 = {
            title:'test blog 1 ',
            author:'mohammed stitane',
            url:'https://www.linkedin.com/in/mstitane/',
            likes:10
        }
        let newBLog2 = {
            title:'test blog 2 ',
            author:'mohammed stitane',
            url:'https://www.linkedin.com/in/mstitane/',
            likes:100
        }
        let newBLog3 = {
            title:'test blog 3 ',
            author:'mohammed stitane',
            url:'https://www.linkedin.com/in/mstitane/',
            likes:50
        }
        beforeEach(function() {
            let backendUrl = `${Cypress.env('BACKEND')}`
            cy.request('POST', backendUrl + '/login/', { username: 'admin', password: 'super' })
                .then((response) => {
                    const options = {
                        method: 'POST',
                        url: backendUrl + '/blogs/',
                        headers:{
                            authorization:`bearer ${response.body.token}`,
                        } }
                    cy.request({ ...options, body : newBLog1 })
                    cy.request({ ...options, body : newBLog2 })
                    cy.request({ ...options, body : newBLog3 })
                }
                )
        })
        it('according to likes with the blog with the most likes being first.', function() {
            cy.login({ username: 'admin', password: 'super' })

            cy.get('.blog').eq(0).contains('#blog-title', newBLog2.title)
            cy.get('.blog').eq(1).contains('#blog-title', newBLog3.title)
            cy.get('.blog').eq(2).contains('#blog-title', newBLog1.title)
        })
    })
})
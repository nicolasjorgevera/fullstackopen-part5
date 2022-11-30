describe('Blog app', function() {

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      username: 'Nico',
      name: 'Vera',
      password: '1234'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#loginFormUsername').type('Nico')
      cy.get('#loginFormPassword').type('1234')
      cy.get('#loginFormSubmit').click()
      cy.contains('Nico is logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#loginFormUsername').type('Nico')
      cy.get('#loginFormPassword').type('wrong')
      cy.get('#loginFormSubmit').click()
      cy.get('.error')
        .should('contain', 'ERROR: invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('html').should('not.contain', 'Nico is logged in')
    })
  })

  describe('When looged in', function() {
    beforeEach(function() {
      cy.login({ username: 'Nico', password: '1234' })
    })

    it('a blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('This is a test blog')
      cy.get('#author').type('This is a test author')
      cy.get('#url').type('a test URL')
      cy.get('#likes').type(4)
      cy.get('#blogFormSubmit').click()
      cy.contains('This is a test blog')
      cy.contains('This is a test author')
    })

    it('a user can be like a blog', function() {
      cy.createBlog({
        title: 'This is a test blog',
        author: 'This is a test author',
        url: 'a test URL',
        likes: 4
      })
      cy.contains('This is a test blog').parent().find('#showButton').click()
      cy.contains('This is a test blog').parent().find('#likeButton').click()
      cy.contains('Likes: 5')
    })

    it('a user can be delete a blog', function() {
      cy.createBlog({
        title: 'This is a test blog',
        author: 'This is a test author',
        url: 'a test URL',
        likes: 4
      })
      cy.contains('This is a test blog').parent().find('#showButton').click()
      cy.contains('This is a test blog').parent().find('#removeButton').click()
      cy.get('.successful')
        .should('contain', 'The blog This is a test blog by This is a test author deleted')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
      cy.get('#blogList').should('not.contain', 'This is a test blog')
    })

    it('a user can not delete a blog with wrong user', function() {
      const user = {
        username: 'Fredy',
        name: 'Castañeda',
        password: '1234'
      }
      cy.request('POST', 'http://localhost:3003/api/users', user)
      cy.visit('http://localhost:3000')
      cy.createBlog({
        title: 'This is a test blog',
        author: 'This is a test author',
        url: 'a test URL',
        likes: 4
      })
      cy.get('#logoutButton').click()
      cy.login({ username: 'Fredy', password: '1234' })
      cy.contains('Fredy is logged in')
      cy.contains('This is a test blog').parent().find('#showButton').click()
      cy.contains('This is a test blog').should('not.contain', 'remove')
    })

    it('blog list is sorted by number of likes', function() {
      cy.createBlog({
        title: 'This is a test blog',
        author: 'This is a test author',
        url: 'a test URL',
        likes: 4
      })
      cy.createBlog({
        title: 'This is a second test blog',
        author: 'This is a second test author',
        url: 'a second test URL',
        likes: 2
      })
      cy.contains('Title').parent().find('#showButton').click()
      cy.contains('Title').should('contain', 'Likes: 4')
      cy.contains('This is a second test blog').parent().find('#showButton').click()
      cy.contains('This is a second test blog').parent().find('#likeButton').as('likeButton')
      for (let i = 0; i < 3; i++) {
        cy.get('@likeButton').click()
      }

      cy.contains('Title').should('contain', 'This is a second test blog')
      cy.contains('Title').should('contain', 'Likes: 5')

    })
  })
})
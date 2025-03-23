describe('Frontend App', () => {
  beforeEach(() => {
    cy.visit('/', { failOnStatusCode: false })
    // Wait for any potential JavaScript to load
    cy.wait(1000)
  })

  it('should load the frontend application with Task Manager heading', () => {
    // Verify that the Task Manager heading is present
    cy.get('h1').should('be.visible')
      .and('contain.text', 'Task Manager')
  })

  it('should have a tasks container ready to display tasks', () => {
    // Verify the tasks container exists
    cy.get('#tasks').should('exist')
  })

  it('should show initial loading message or tasks', () => {
    // It will either show a loading message or tasks if backend is available
    cy.get('body').then(($body) => {
      // If backend is not available, it should show an error message
      if ($body.text().includes('Error loading tasks')) {
        cy.contains('Error loading tasks').should('be.visible')
      } else if ($body.text().includes('Loading tasks')) {
        // If still loading
        cy.contains('Loading tasks').should('be.visible')
      } else {
        // If tasks loaded successfully, the task container should not be empty
        cy.get('#tasks').should('not.be.empty')
      }
    })
  })

  it('should have the correct document title', () => {
    cy.title().should('include', 'Task Manager')
  })
}) 
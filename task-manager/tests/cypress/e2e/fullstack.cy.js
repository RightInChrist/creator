describe('Full Stack Application', () => {
  beforeEach(() => {
    cy.visit('/')
    // Wait for data to load
    cy.wait(2000)
  })

  it('should load the Task Manager application', () => {
    cy.get('h1').should('be.visible')
      .and('contain.text', 'Task Manager')
  })

  it('should display tasks from the backend', () => {
    // Since we know there's at least one task from our API check
    cy.get('#tasks')
      .should('exist')
      .and('not.be.empty')
    
    // Verify a task is displayed with its details
    cy.get('.task')
      .should('exist')
      .within(() => {
        cy.get('h3').should('exist') // Task title
        cy.contains('Status:').should('exist') // Task status
      })
  })

  it('should show proper content in task items', () => {
    cy.get('.task').first().within(() => {
      cy.get('h3').invoke('text').should('not.be.empty')
    })
  })
}) 
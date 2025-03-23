describe('Frontend App', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the frontend application', () => {
    // Verify the app is loaded by checking for common elements
    cy.get('body').should('be.visible')
    // Add more specific assertions based on your app structure
    // e.g., cy.contains('Task Manager').should('be.visible')
  })

  it('should have the correct title', () => {
    cy.title().should('include', 'Task Manager')
  })
}) 
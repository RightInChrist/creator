describe('Full Stack Application', () => {
  beforeEach(() => {
    cy.visit('/')
    // Wait for React to load
    cy.wait(5000)
  })

  it('should load the Task Manager application', () => {
    // Check for the header with Task Manager
    cy.get('h1, h2').should('be.visible')
      .and('contain.text', 'Task Manager')
  })

  it('should display navigation buttons', () => {
    // Look for buttons from HomeScreen
    cy.contains('View All Tasks').should('exist')
    cy.contains('Create New Task').should('exist')
    cy.contains('Manage Task Types').should('exist')
  })

  it('should navigate to Tasks screen when clicking View All Tasks', () => {
    cy.contains('View All Tasks').click()
    cy.wait(2000)
    
    // Should show Tasks screen title
    cy.contains('All Tasks').should('exist')
  })
}) 
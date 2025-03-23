# Frontend Cypress Tests

This directory contains Cypress tests for verifying the functionality of the frontend application.

## Running Tests

To run the tests, first start the demo frontend:

```bash
docker-compose -f docker-compose.demo.yaml up
```

Then, in a separate terminal, run Cypress:

```bash
# If Cypress is installed globally
cypress open --config-file tests/cypress/cypress.config.js

# Or using npx
npx cypress open --config-file tests/cypress/cypress.config.js
```

## Test Structure

- `e2e/` - Contains end-to-end tests
- `fixtures/` - Contains test data
- `support/` - Contains custom commands and configuration

## Adding New Tests

To add new tests, create a new file in the `e2e/` directory with the `.cy.js` extension. 
# Todo App - Playwright Training Demo

A comprehensive React application built specifically for demonstrating Playwright testing concepts including Page Object Model (POM), Fixtures, API testing, and Authentication flows.

## 🎯 Purpose

This application serves as a training tool for QA engineers learning Playwright. It demonstrates:

- **Page Object Model (POM)**: Organized, maintainable test code using page objects
- **Fixtures**: Reusable test setup and teardown with Playwright fixtures
- **API Testing**: Testing REST APIs with Playwright's request context
- **Authentication Flows**: Login/logout testing with session management
- **E2E Testing**: Full end-to-end user journey testing

## 🛠️ Tech Stack

**Frontend:**
- React 19
- TypeScript
- Tailwind CSS
- React Router
- Vite

**Backend:**
- Express.js (via Vite middleware)
- JWT Authentication
- In-memory database

**Testing:**
- Playwright
- TypeScript

## 📦 Installation

\`\`\`bash
npm install
\`\`\`

## 🚀 Running the Application

### Development Mode
\`\`\`bash
npm run dev
\`\`\`

The app will be available at http://localhost:5173

### Demo Credentials
\`\`\`
Username: demo
Password: password123

or

Username: testuser
Password: password123
\`\`\`

## 🧪 Running Tests

### Run all tests
\`\`\`bash
npx playwright test
\`\`\`

### Run tests in UI mode (recommended for learning)
\`\`\`bash
npx playwright test --ui
\`\`\`

### Run only E2E tests
\`\`\`bash
npx playwright test tests/e2e
\`\`\`

### Run only API tests
\`\`\`bash
npx playwright test tests/api
\`\`\`

### Run tests in headed mode (see browser)
\`\`\`bash
npx playwright test --headed
\`\`\`

### Generate test report
\`\`\`bash
npx playwright show-report
\`\`\`

## 🎓 Training Guide

### 1. Page Object Model (POM)

**Files to study:**
- \`tests/pages/BasePage.ts\` - Base class with common functionality
- \`tests/pages/LoginPage.ts\` - Login page interactions
- \`tests/pages/TodoPage.ts\` - Todo page interactions

### 2. Fixtures

**Files to study:**
- \`tests/fixtures/page.fixture.ts\` - Basic page fixtures
- \`tests/fixtures/auth.fixture.ts\` - Authentication fixtures
- \`tests/fixtures/todo.fixture.ts\` - Todo-specific fixtures

### 3. API Testing

**Files to study:**
- \`tests/api/auth-api.spec.ts\` - Auth API tests
- \`tests/api/todos-api.spec.ts\` - Todos API tests

### 4. E2E Tests

**Files to study:**
- \`tests/e2e/auth.spec.ts\` - Authentication E2E tests
- \`tests/e2e/todos.spec.ts\` - Todo management E2E tests

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Playwright Fixtures](https://playwright.dev/docs/test-fixtures)

## 📄 License

MIT

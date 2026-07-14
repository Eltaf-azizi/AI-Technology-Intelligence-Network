# Contributing to ATIN

Thank you for your interest in contributing to the AI Technology Intelligence Network.

---

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/atin.git
   cd atin
   ```
3. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
4. Copy `.env.example` to `.env` and configure
5. Start development:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

---

## Branch Naming

- `feat/description` — new features
- `fix/description` — bug fixes
- `docs/description` — documentation changes
- `refactor/description` — code refactoring
- `test/description` — adding or updating tests

---

## Coding Standards

- **JavaScript**: ES2022+, CommonJS modules in backend, ES modules in frontend
- **Formatting**: Prettier with the project config (`.prettierrc`)
- **Linting**: Run `npm run lint` before committing
- **Naming**: camelCase for variables/functions, PascalCase for classes/components
- **Imports**: Group by external packages, then internal modules, separated by blank lines
- **No comments** unless explicitly requested
- **Error handling**: Always handle errors with appropriate status codes and messages
- **Security**: Never commit secrets, keys, or credentials

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>
```

**Types:**
- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation
- `style` — formatting (no code change)
- `refactor` — code restructuring
- `test` — adding/updating tests
- `chore` — tooling, config, dependencies
- `perf` — performance improvement

**Examples:**
```
feat(news): add sentiment filtering to news list
fix(auth): prevent token refresh race condition
docs(api): update notifications endpoints
test(trends): add trend search integration tests
```

---

## Pull Request Process

1. Create a branch from `main`
2. Make your changes with clear, focused commits
3. Run tests and linting:
   ```bash
   npm test
   npm run lint
   ```
4. Update documentation if your change affects the API or setup
5. Push your branch and open a PR against `main`
6. Fill out the PR description with:
   - What changed and why
   - How to test
   - Any breaking changes or migration steps
7. Request review from a maintainer
8. Address feedback promptly

---

## Testing Guidelines

### Unit Tests

```bash
npm run test:unit
```

- Test utility functions, services, and models
- Mock external dependencies (database, APIs, email)
- Aim for meaningful coverage, not 100%

### Integration Tests

```bash
npm run test:integration
```

- Test API endpoints end-to-end
- Use a test MongoDB instance (never test against production)
- Each test should clean up after itself

### E2E Tests

```bash
npm run test:e2e
```

- Test complete user flows in a real browser
- Use Playwright page objects for reusability
- Run against a running dev or staging environment

---

## Code Review Checklist

- [ ] Code follows project style guidelines
- [ ] No hardcoded secrets or credentials
- [ ] Error handling is appropriate
- [ ] New code has corresponding tests
- [ ] Documentation updated if needed
- [ ] No breaking changes without migration plan
- [ ] All tests pass locally

---

## Reporting Issues

Open a GitHub issue with:
- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, browser)
- Screenshots if applicable

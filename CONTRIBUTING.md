# Contributing to ALM Operational Platform

## Development Workflow

### Branching Strategy

```
main        ── Stable, production-ready code
├── develop ── Integration branch for feature development
│   ├── feature/module-liquidity
│   ├── feature/module-irrbb
│   ├── feature/module-capital
│   └── feature/module-ecl
├── prototype/iterations ── HTML sandbox updates
└── hotfix/... ── Emergency fixes
```

### Pull Request Process

1. Create a feature branch from `develop`
2. Write code with tests
3. Update documentation
4. Submit PR to `develop` with detailed description
5. Require 2 approvals before merge
6. Squash merge to keep history clean

### Code Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **React**: Functional components with hooks, no class components
- **Styling**: TailwindCSS utility classes, no custom CSS unless necessary
- **Testing**: Jest + React Testing Library, 80% coverage minimum
- **Linting**: ESLint + Prettier, enforced in CI

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(liquidity): add LCR waterfall chart component
fix(ftp): correct deposit beta calculation for savings accounts
docs(readme): update installation instructions
```

## Documentation Standards

- Every PRD must include: user stories, acceptance criteria, calculation logic, validation rules
- Every visual spec must include: chart type, color codes, demo data, interaction behaviors
- Every HTML prototype page must be interactive with realistic demo data

## Security

- Never commit `.env.local` or API keys
- Use Firebase Auth claims for role-based access
- All database queries must include tenant filter (RLS)
- Sanitize all user inputs
- Use parameterized queries for database access

## Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run linting
npm run lint

# Run type checking
npm run type-check
```

## Deployment

- `develop` branch auto-deploys to staging environment
- `main` branch auto-deploys to production (with manual approval)
- Prototype deploys to GitHub Pages on every push to `main`

---

*Thank you for contributing to the ALM Platform!*

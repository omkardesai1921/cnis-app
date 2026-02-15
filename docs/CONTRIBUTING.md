# Contributing to CNIS

First off, thank you for considering contributing to CNIS! 🎉

The following is a set of guidelines for contributing to the Child Nutrition Intelligence System. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, Node version, browser)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:

- `good first issue` - Easy issues for newcomers
- `help wanted` - Issues that need attention
- `documentation` - Documentation improvements

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code, add tests (when test suite exists)
3. Ensure the code follows our coding standards
4. Update documentation as needed
5. Write a clear commit message

## Development Setup

### Prerequisites

```bash
node -v  # v18.0.0 or higher
npm -v   # v9.0.0 or higher
git --version
```

### Setup Steps

1. **Fork and clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cnis-app.git
   cd cnis-app
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd backend
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Copy example files
   cp .env.example .env
   cp backend/.env.example backend/.env
   
   # Edit with your keys
   nano .env
   nano backend/.env
   ```

4. **Run development servers**
   ```bash
   # Terminal 1: Frontend
   npm run dev
   
   # Terminal 2: Backend
   cd backend && npm run dev
   ```

5. **Verify setup**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001/health

## Coding Standards

### JavaScript/React

- Use **functional components** with hooks
- Use **arrow functions** for component definitions
- Use **destructuring** for props and state
- Keep components **small and focused** (< 300 lines)
- Extract repeated logic into **custom hooks**
- Use **meaningful variable names**

**Good Example:**
```javascript
// ✅ Good
const NutritionCard = ({ height, weight, age }) => {
  const { zScore } = useGrowthCalculation(height, weight, age);
  
  if (!zScore) return null;
  
  return (
    <div className="nutrition-card">
      <h3>Z-Score: {zScore.toFixed(2)}</h3>
    </div>
  );
};
```

**Bad Example:**
```javascript
// ❌ Bad
function Component(props) {
  var x = props.height;
  var y = props.weight;
  var z = calculateZScore(x, y, props.age);
  return <div><h3>Z-Score: {z}</h3></div>;
}
```

### CSS

- Use **BEM-like naming** for classes
- Keep selectors **specific** but not overly nested
- Use **CSS variables** for theming
- Group related properties together

```css
/* ✅ Good */
.screening-card {
  /* Layout */
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  /* Visual */
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--card-shadow);
}

.screening-card__title {
  font-size: 1.5rem;
  color: var(--primary-color);
}
```

### File Organization

```
src/
├── components/        # Reusable UI components
│   └── Header.jsx     # PascalCase for components
├── pages/             # Page-level components
│   └── DashboardPage.jsx
├── utils/             # Utility functions
│   └── growthCalculator.js  # camelCase for utilities
├── hooks/             # Custom hooks
│   └── useAuth.js     # 'use' prefix
└── contexts/          # React contexts
    └── AuthContext.jsx
```

## Commit Guidelines

We follow **Conventional Commits** specification:

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, build, etc.)

### Examples

```bash
# Good commits
feat(chatbot): add voice input support
fix(screening): correct WHO z-score calculation
docs(readme): update setup instructions
refactor(auth): simplify token refresh logic

# With body
feat(chatbot): integrate Gemini fallback

Added Google Gemini as a fallback provider when OpenAI is unavailable.
This improves reliability and reduces downtime.

Closes #123
```

## Pull Request Process

### Before Submitting

1. **Update documentation** if you changed APIs
2. **Test your changes** thoroughly
3. **Run linter** (if configured)
4. **Update CHANGELOG.md** with your changes
5. **Rebase on latest main** to avoid conflicts

### PR Title Format

Use the same format as commit messages:

```
feat(chatbot): add multilingual voice support
fix(security): patch rate limiting vulnerability
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran.

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
```

### Review Process

1. At least **one maintainer approval** required
2. All **CI checks must pass** (when configured)
3. **No merge conflicts**
4. **Code review feedback addressed**

## Specific Contribution Areas

### 1. Adding New Languages

To add a new language (e.g., Tamil):

1. Create `src/locales/ta.json`
2. Copy structure from `en.json`
3. Translate all keys
4. Add to `src/i18n.js`:
   ```javascript
   import ta from './locales/ta.json';
   i18n.addResourceBundle('ta', 'translation', ta);
   ```
5. Update language switcher in `LanguageSwitcher.jsx`

### 2. Adding NFHS Data for New Districts

Edit `src/data/nfhsStats.js`:

```javascript
export const nfhsData = {
  // ... existing entries
  "NewDistrict": d("StateName", 25, 12, 22, "Medium", "Context here"),
};
```

### 3. Adding PDF Knowledge to RAG

Edit `src/data/ragPdfKnowledge.js`:

```javascript
export const ragKnowledge = [
  // ... existing entries
  {
    source: "New WHO Guideline",
    content: "Key information here...",
    keywords: ["keyword1", "keyword2"],
    relevance: "high"
  }
];
```

### 4. Security Enhancements

Security contributions are **highly valued**! Please:

1. Report vulnerabilities privately first (email: security@cnis-app.com)
2. Wait for confirmation before public disclosure
3. Include proof-of-concept if possible
4. Suggest remediation steps

## Questions?

- **General questions**: Open a [GitHub Discussion](https://github.com/yourusername/cnis-app/discussions)
- **Bug reports**: [GitHub Issues](https://github.com/yourusername/cnis-app/issues)
- **Security issues**: security@cnis-app.com (private)

---

**Thank you for contributing to CNIS!** 🎉

Every contribution, no matter how small, helps us combat child malnutrition in India.

# Contributing to Simulation Hypothesis Explorer

We welcome contributions from the community! This project explores the fascinating intersection of machine learning, theoretical physics, and philosophy. Whether you're a physicist, developer, or curious explorer, your contributions are valuable.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Style Guidelines](#style-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [project email].

## How Can I Contribute?

### Reporting Bugs
This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

- Use a clear and descriptive title for the issue
- Describe the exact steps to reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots or code examples if possible

### Suggesting Enhancements
This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain which behavior you expected to see instead
- Explain why this enhancement would be useful

### Pull Requests
- Fill in the pull request template
- Do not include issue numbers in the PR title
- Include screenshots in your pull request when adding new features
- End all files with a newline

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/simulation-hypothesis-explorer.git
   ```
3. Navigate to the project directory:
   ```bash
   cd simulation-hypothesis-explorer
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
simulation-hypothesis-explorer/
├── public/                 # Frontend assets
│   ├── index.html          # Main application
│   ├── app.js              # Main frontend logic
│   ├── styles.css          # Styling
│   └── ...
├── routes/                 # API routes
├── controllers/            # Business logic
├── models/                 # ML/DL models
├── utils/                  # Utility functions
├── docs/                   # Documentation
└── tests/                  # Test files
```

## Style Guidelines

### JavaScript
- Use 2 spaces for indentation
- Use semicolons
- Use camelCase for variables and functions
- Use PascalCase for constructors
- Write clear, descriptive variable names

### CSS
- Use BEM methodology where appropriate
- Use consistent naming conventions
- Organize styles logically
- Use CSS custom properties for theme colors

### Documentation
- Use Markdown for documentation
- Follow consistent formatting
- Include examples where helpful

## Pull Request Process

1. Update the README.md with details of changes to the interface
2. Update the documentation as needed
3. Create a pull request to the `main` branch
4. Ensure all tests pass
5. Wait for review and approval

Thank you for your contributions!
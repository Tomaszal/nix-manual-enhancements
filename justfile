usage := '''
  Just: A Command Runner

  Usage:
      just <recipe>

'''

[private]
@default:
  echo '{{usage}}'
  just --list --unsorted

# Start development server
dev:
  bunx --bun vite

# Build for production
build:
  NODE_ENV=production bunx --bun vite build

# Preview production build
preview:
  bunx --bun vite preview

# Generate a dependency graph using Madge
gen-dep-graph *OPTIONS:
  bun madge . --warning --image dependency-graph.svg {{OPTIONS}}

# Verify code and repository conventions
@lint:
  echo 'Checking ESLint rules...'
  bun eslint .
  echo 'All matched files comply with ESLint rules!'
  echo
  bun prettier --check .
  echo
  echo 'Checking for circular dependencies using Madge...'
  bun madge . --circular
  echo 'Checking Nix formatting...'
  git ls-files '*.nix' | xargs alejandra --check
  echo
  echo 'Success! No linting errors found.'

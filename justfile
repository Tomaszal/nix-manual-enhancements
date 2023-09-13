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
  bunx --bun vite build

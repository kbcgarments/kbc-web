#!/usr/bin/env bash
set -e

echo "🔍 Adding 'unoptimized' to <Image /> components (where missing)..."

# Ensure we run from project root
cd "$(dirname "$0")/../.."

echo "Working directory: $(pwd)"

FILES=$(rg "<Image\b" -g "*.tsx" -g "*.jsx" -l)

if [ -z "$FILES" ]; then
  echo "⚠️  No files with <Image /> found"
  exit 0
fi

count=0

for file in $FILES; do
  # Only touch files that contain at least ONE Image missing unoptimized
  if ! rg "<Image\b(?![^>]*\bunoptimized\b)" "$file" > /dev/null; then
    continue
  fi

  cp "$file" "$file.bak"

  perl -0777 -i -pe '
    s{
      <Image\b(?![^>]*\bunoptimized\b)
    }{
      <Image unoptimized
    }gx
  ' "$file"

  echo "✅ Updated: $file"
  ((count++))
done

echo ""
echo "🎉 Done! Updated $count file(s)."
echo "💾 Backups created with .bak extension."
#!/usr/bin/env bash

echo "🔍 Searching for <Image fill> without sizes prop..."
echo "-----------------------------------------------"

rg -n "<Image" \
  --glob "!node_modules/**" \
  --glob "!dist/**" \
  --glob "*.{ts,tsx,js,jsx}" \
| while read -r line; do
    if echo "$line" | grep -q "fill" && ! echo "$line" | grep -q "sizes="; then
        echo "⚠️  Possible missing sizes:"
        echo "$line"
        echo
    fi
done
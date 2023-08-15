#!/bin/bash

js_file_found=false
css_file_found=false

YELLOW='\033[1;33m'
NC='\033[0m' # No Color

for file in packages/content/build/static/js/main.*.js; do
    if [ -f "$file" ]; then
        cp "$file" build/cs.js
        js_file_found=true
    fi
done

for file in packages/content/build/static/css/main.*.css; do
    if [ -f "$file" ]; then
        cp "$file" build/cs.css
        css_file_found=true
    fi
done

if [ "$js_file_found" = false ]; then
    echo -e "${YELLOW}Warning: No JavaScript file matching the pattern was found! Creating an empty cs.js file.${NC}"
    touch build/cs.js
fi

if [ "$css_file_found" = false ]; then
    echo -e "${YELLOW}Warning: No CSS file matching the pattern was found! Creating an empty cs.css file.${NC}"
    touch build/cs.css
fi

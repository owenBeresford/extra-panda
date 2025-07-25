#!/bin/bash 

node ./node_modules/.bin/eslint --exit-on-fatal-error --no-cache ./src/*.ts;  
node ./node_modules/.bin/eslint --exit-on-fatal-error --no-cache src/tests/*; 
node ./node_modules/.bin/eslint --exit-on-fatal-error --no-cache tools/*.ts tools/*mjs; 
node ./node_modules/.bin/prettier --write ./src ./tools/*.ts ./tools/*.mjs; 
git checkout src/fixtures/*mjs; 


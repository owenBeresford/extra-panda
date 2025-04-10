#!/bin/bash 

node ./node_modules/.bin/eslint --exit-on-fatal-error --no-cache ./src/*.ts;  
node ./node_modules/.bin/eslint --exit-on-fatal-error --no-cache src/tests/*; 
node ./node_modules/.bin/eslint --exit-on-fatal-error --no-cache tools/*; 
node ./node_modules/.bin/prettier --write ./src; # this will do sub-dirs 
node ./node_modules/.bin/prettier --write ./tools/; 
git checkout src/fixtures/*mjs; 


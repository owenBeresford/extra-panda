#!/bin/bash 

cd $(dirname "$0")/..
export NODE_ENV=web-test; 
node ./node_modules/.bin/vite -c vite.config.modal.ts build; 

node ./node_modules/.bin/vite -c vite.config.cookie.ts build;
node ./node_modules/.bin/vite -c vite.config.desktop-biblio.ts build;
node ./node_modules/.bin/vite -c vite.config.dom-base.ts build;
node ./node_modules/.bin/vite -c vite.config.networking.ts build;
rm ./dist/tests/*.js; 
node ./node_modules/.bin/vite -c vite.config.index.ts build;
export FN=`ls ./dist/index.webtest* | sed -e 's/\.\/dist\///' `
sed -i ./dist/index-* -e 's/'$FN'.*/index\.webtest\.mjs";/'
mv ./dist/index.webtest* ./dist/tests/index.webtest.mjs
mv ./dist/index-* ./dist/tests/
echo -e '\n\n\t\tAdd more tests' 


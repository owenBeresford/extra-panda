#!/bin/bash  

# exports nothing to PUBLICATION
cd $(dirname "$0")/..
export NODE_ENV=web-test; 
for x in `ls -1 vite.config*webtest.ts`; do
	node ./node_modules/.bin/vite -c $x build; 
done 

rm ./dist/tests/*.js; 
node ./node_modules/.bin/vite -c vite.config.index.webtest.ts build;
export FN=`ls ./dist/index.webtest* | sed -e 's/\.\/dist\///' `
sed -i ./dist/index-* -e 's/'$FN'.*/index\.webtest\.mjs";/'
mv ./dist/index.webtest* ./dist/tests/index.webtest.mjs
mv ./dist/index-* ./dist/tests/
echo -e '\n\n\t\tAlways add more tests' 


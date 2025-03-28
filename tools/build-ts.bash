#!/bin/bash 
if [ -z "$PUBLICATION" ]; then
	echo "ERROR: Defining variable PUBLICATION is required for where to put compiled code. ABORTING"
	exit 1
fi
# strip the generate-css libraries to reduce volume

node ./node_modules/.bin/vite --config ./vite.config.lib.ts build 
node ./node_modules/.bin/uglifyjs ./dist/ob1.mjs -o /tmp/ob1.min.mjs 
# only needed in old copy of uglyfy
# tail -n 11 ./dist/ob1.mjs >> /tmp/ob1.min.mjs 
echo 'INFO: Generated /tmp/ob1.min.mjs as over compressed version if this helps'
node node_modules/.bin/vite --config vite.config.lang-go.ts build 
node node_modules/.bin/vite --config vite.config.lang-bash.ts build 
node node_modules/.bin/vite --config vite.config.lang-conf.ts build 
node node_modules/.bin/vite --config vite.config.lang-html.ts build 
node node_modules/.bin/vite --config vite.config.lang-js.ts build 
node node_modules/.bin/vite --config vite.config.lang-php.ts build 
node node_modules/.bin/vite --config vite.config.lang-xml.ts build 
node node_modules/.bin/vite --config vite.config.lang-sql.ts build 
node node_modules/.bin/vite --config vite.config.lang-ts.ts build 
node node_modules/.bin/vite --config vite.config.lang-perl.ts build 
node node_modules/.bin/vite --config vite.config.lang-css.ts build
if [ -f dist/magic-strin* ]; then
	rm dist/magic-string*
fi

cp dist/*.mjs $PUBLICATION


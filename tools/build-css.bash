#!/bin/bash 
PARENT=/var/www/oab1/ast

#export compress=" "
#if [ -z "$1" ]; then
	echo "INFO: Making production compressed versions of CSS assets"
#	export compress=" --config-file ./.uglyjsrc "
#fi

if [ -f /tmp/ob1.css ];then
	rm /tmp/ob1.css;
fi

cat $PARENT/fontello.css src/presentation/fonts.css $PARENT/foundation.css src/presentation/components.css src/presentation/pages.css src/presentation/utils.css src/presentation/colours.css ./src/presentation/overloads.css > /tmp/ob1.css
node ./node_modules/.bin/uglifycss --max-line-len 1000 --debug /tmp/ob1.css --output /tmp/ob1.min.css
# node14 /usr/bin/uglifycss --debug /tmp/ob1.css --output /tmp/ob1.min.css
cp /tmp/ob1.min.css $PARENT



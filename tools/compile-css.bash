#!/bin/bash -x 
PARENT=/var/www/oab1/ast

export compress=" "
if [ -z "$1" ]; then
	echo "INFO: Making production compressed versions of CSS assets"
	export compress=" --config-file ./.uglyjsrc "
fi

if [ -f /tmp/ob1.css ];then
	rm /tmp/ob1.css;
fi

cat $PARENT/fontello.css src/presentation/fonts.css $PARENT/foundation.css ./src/presentation/overloads.css src/presentation/utils.css src/presentation/components.css src/presentation/pages.css $PARENT/jquery-biblio.css src/presentation/colours.css > /tmp/ob1.css
node14 /usr/bin/uglifycss --debug /tmp/ob1.css > /tmp/ob1.min.css
mv /tmp/ob1.min.css $PARENT



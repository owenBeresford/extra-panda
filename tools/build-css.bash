#!/bin/bash 
if [ -z "$PUBLICATION" ]; then
	echo "ERROR: Defining variable PUBLICATION is required for where to put compiled code. ABORTING"
	exit 1
fi
echo "INFO: Making production compressed versions of CSS assets"

if [ -f /tmp/ob1.css ];then
	rm /tmp/ob1.css;
fi
# note 3rd party assets are currently in the PUBLICATION dir, as they are used in some tests

cat $PUBLICATION/fontello.css src/presentation/fonts.css $PUBLICATION/foundation.css src/presentation/components.css src/presentation/pages.css src/presentation/utils.css src/presentation/colours.css ./src/presentation/overloads.css > /tmp/ob1.css
node ./node_modules/.bin/uglifycss --max-line-len 1000 --debug /tmp/ob1.css --output /tmp/ob1.min.css
cp /tmp/ob1.min.css $PUBLICATION
cp /tmp/ob1.min.css ./src/fixtures/

node ./node_modules/.bin/uglifycss --max-line-len 1000 --debug src/presentation/librewolf.css --output /tmp/librewolf.min.css
cp /tmp/librewolf.min.css $PUBLICATION
cp /tmp/librewolf.min.css ./src/fixtures/

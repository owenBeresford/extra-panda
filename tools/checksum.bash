#!/bin/bash 
#
# Setup the files that arent checked-in. 
# Written in bash as faster to write and is more concise
#

export BASE=`dirname "$0"`
export BASE="$BASE/.."

if [ ! -d "$BASE/src/fixtures" ]; then
	echo -e "Source code broken, please talk to the dev\n$BASE/src/fixtures"
	exit 1
fi
if [ ! -f "$BASE/src/fixtures/index.html" ];then
	echo -e "Source code broken, please talk to the dev\n$BASE/src/fixtures/index.html"
	exit 1	
fi
if [ ! -f "$BASE/package-lock.json" ];then
	echo "Did you run 'npm install'?  There are missing files."
	exit 2
fi

if [ ! -f "$BASE/dist/tests" ]; then
	mkdir -p $BASE/dist/tests
fi
if [ -z  `ls "$BASE/dist/tests/*.mjs"` ]; then
	node ./node_modules/.bin/vite -c ./vite.config.tests.ts build
fi

# https://www.golinuxcloud.com/openssl-cheatsheet/
if [ ! -f "$BASE/src/fixtures/*.pem" ];then
	openssl ecparam -name prime256v1 -genkey -out "$BASE/src/fixtures/ecdsa_private.key"
	openssl req -new -x509 -days 365 -key "$BASE/src/fixtures/ecdsa_private.key" -out "$BASE/src/fixtures/ecdsa.crt"
	openssl ec -in "$BASE/src/fixtures/ecdsa_private.key" -pubout -out "$BASE/src/fixtures/ecdsa.pem" 
fi
	
# vim: nospell syn=bash

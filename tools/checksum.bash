#!/bin/bash 
#
# Setup the files that arent checked-in. 
# Written in bash as faster to write and is more concise
#
#  Node people will probably get anxiety about all the return early branches
#    So I used bash
# Unfortunately , this script can't really be unit tested,
#  please run with a '-x' param to the bash interpreter 

# exports nothing to PUBLICATION
export BASE=`dirname "$0"`
export BASE="$BASE/.."
cd $BASE

if [ ! -f "$BASE/package-lock.json" ];then
	if [ -z "`which npm`" ]; then
		echo "ERROR: npm isnt installed or is absent from PATH.  Please fix"
		exit 5
	fi
	read -t 5 -n 5 -i "Running 'npm install' unless aborted now with <cntl-C>." IGNORED
	if [ $? -ne 0 ]; then
		exit 2
	fi
	npm install
fi
if [ -z "`which openssl`" ]; then
	echo "ERROR: Please install openassl, or add it to the PATH."
	exit 6
fi

if [ ! -d "$BASE/src/fixtures" ]; then
	echo -e "ERROR: Source code broken, please talk to the dev\n$BASE/src/fixtures"
	exit 1
fi
if [ ! -f "$BASE/src/fixtures/index.html" ];then
	echo -e "ERROR: Source code broken, please talk to the dev\n$BASE/src/fixtures/index.html"
	exit 1	
fi
if [ -z "`which chromium`" ]; then
	echo -e "ERROR: Pls install chromium, or reconfig this test for other browsers that support the debug protocol \nSee playwright docs https://playwright.dev/docs/intro"
	exit 3
fi
if [ -n "`ps axw | grep ignore-this | grep -v grep`" ]; then
	echo "WARNING a test instance of Chromium is still running.  Aborting this checksum script"
	exit 4
fi


if [ ! -d "$BASE/dist/tests" ]; then
	mkdir -p $BASE/dist/tests
fi
if [ -z  `ls "$BASE/dist/tests/*.mjs"` ]; then
	node ./node_modules/.bin/vite -c ./vite.config.tests.ts build
fi

# https://www.golinuxcloud.com/openssl-cheatsheet/
# if you are an enterprise, please set more restrictions to access.
if [ ! -f "$BASE/src/fixtures/*.pem" ];then
# Alternate means to create certs ::
#	openssl ecparam -name prime256v1 -genkey -out "$BASE/src/fixtures/ecdsa_private.key"
#	openssl req -new -x509 -days 365 -key "$BASE/src/fixtures/ecdsa_private.key" -out "$BASE/src/fixtures/ecdsa.crt"
#	openssl ec -in "$BASE/src/fixtures/ecdsa_private.key" -pubout -out "$BASE/src/fixtures/ecdsa.pem" 
	openssl genrsa -out "$BASE/src/fixtures/private.key"
	openssl req -new -key "$BASE/src/fixtures/private.key" -out "$BASE/src/fixtures/csr.pem"
	openssl x509 -req -days 365 -in "$BASE/src/fixtures/csr.pem" -signkey "$BASE/src/fixtures/private.key" -out "$BASE/src/fixtures/cert.pem"
	echo "INFO: Created your local self-sign certs, **DO NOT** commit these"
fi
	
# vim: nospell syn=bash


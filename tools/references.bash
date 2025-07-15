#/bin/bash 

# "node node_modules/.bin/vite-node tools/generate-references2.ts --url http://192.168.1.218/resource/elixir-toolkit  --out /tmp/hfhfhf4.wiki"
if [ $# -ne 3 ]; then
	echo " run as $0 <url-to-extract> <output-file>"
	exit 1
fi

node ./node_modules/.bin/vite-node tools/generate-references2.ts --url $1 --out $2
 



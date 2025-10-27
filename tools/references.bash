#/bin/bash 
# #TODO: look up this IP
# To build a patch on an existing file append --patch to the command
# Note, running vite-node not node, which is why this script,
myip=192.168.1.218

if [ $# -eq 1 ]; then
	echo " filename to URL conversion not written, please add it if needed"
	exit 2
elif [ $# -ne 2 ]; then
	echo " Run as $0 <url-to-extract> <output-file>"
	exit 1
fi

# SAMPLE: "node node_modules/.bin/vite-node tools/generate-references2.ts --url http://192.168.1.218/resource/elixir-toolkit  --out /tmp/hfhfhf4.wiki"
node ./node_modules/.bin/vite-node tools/generate-references2.ts --url http://$myip/resource/$1 --out $2 
 



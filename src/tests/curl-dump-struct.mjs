import { Curl } from "node-libcurl";

const curl = new Curl();

console.log("Dump of known HTTP options (via node-libCurl): ", Curl.option);

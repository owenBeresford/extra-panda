If you see any security errors please rise a fault in github. <link>

### Security review

* My client-side JS only loads assets that are from the same server [by settings in Fetch].
* All my assets are hosted on the same server
* As far as I can, the SM links are direct links / URLs, not 3rd party JS
* The inbound comms are all hosted on third party services, and assumed to be secure (as that would affect their revenue) 
* So to get my webpages to show wrong content, you need to breach the server
* If somehow I have uploaded bad content, the article will show a relevant error.  I am fairly sure it's not possible for data in a JSON file to be auto executed when parsing the JSON
* My server is administrated by professionals, and they seem to know what they are doing.
* All access as a webpage is inside HTTPS, exclusively.
* At point of setup, my new IP is clean for any reputation usage (e.g. not also used by a spammer / scammer / con-artist).
* I have held this domain a long time, it was new to me, AFAIK 
* If you disable some assets on the client side, you get the same HTML / content, and usable user journeys.
*  .
* TODO: adding more integrity HTTP headers
* Most common failure: bad English by me, due to volume of text added.  Not a security concern
* If third party articles are allowed, they get a 24hour review period ~ to review ~ before their content is generally visible or indexable.
* I have done an audit, all the URLs loaded are relative URLs (not absolute URLs).
* Nothing new learned in these links: 
  * https://aptori.dev/blog/javascript-security-a-secure-coding-checklist-for-developers
  * https://raygun.com/blog/js-security-vulnerabilities-best-practices/



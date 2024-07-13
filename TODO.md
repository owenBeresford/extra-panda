### TODO
- Add type washing to JSON ingestion used in multiple places 
- Add wrapper objects to JSON payload as OWASP says to (not explained why necessary) see https://cheatsheetseries.owasp.org/cheatsheets/AJAX_Security_Cheat_Sheet.html
- Performance hack:: https://webreflection.medium.com/linkedom-a-jsdom-alternative-53dd8f699311 https://www.npmjs.com/package/linkedom
- Add config for minifier via terser to build step.  Out of time.
- Build some solution to syntax highlighting for CSS and JS inside highlighting for other languages.  Also possibly patch 3rd party library for CSS syntax highlighting.
- I haven't added tests for highlight code.  This statement may change to isolate some problems in CSS highlighting
- think about adding mobile view biblio better display/ wrap
- multilingual support
- port the everything* tests to storybook
- WCAG tests (lighthouse) for whole pages need to go some where 
- log fault on validate class for HTML with no doctype header
- add better tooltips on effect html

### Previous Updates

- Discuss: Perl-style encapsulation by culture rather than armed enforcers
- Discuss: every time I am setting CSS vis JS, this is code smell & I need more information
- DONE remove local scope use of global vars
- DONE reduce use a lambda functions
- DONE check accessibility of currentSize
- DONE move inpage JS to pageStartup
- DONE Add further modules
- DONE move post handler in search to JS, as this can't work on mew site 
- DONE copy back the top functions for vanilla 
- DONE check base.mjs is OK
- DONE lookup fetch stuff 
- DONE add vite to build
- DONE add vitest
- DONE replace all log() calls
- DONE Convert to TS
- DONE move mobile shareBar to a Nav element
- DONE move appendIsland + setIsland to code-collection 
- DONE unify page() macro in tests
- DONE setup eslint after git
- DONE Move to an import log 
- DONE improve TEST_MACHINE to isLocal
- DONE title clipping in adjacent is too short, add wrap, or make it longer
- DONE add CSS for copy label, propose text to green for 2s
- DONE patch adjacent CSS for newer HTML layout
- DONE deploy as mjs
- DONE use the newer code for tabs on home page
- DONE suppress chaotic interaction between CSS columns and CSS position:absolute
- DONE setup 1 language syntax highlighting, each language separate as each article is normally only 1 language.
- DONE add HTML validation to tests and when adding HTML, scramble ids for uniqueness
- DONE add complexity monitor to eslint
- DONE another "add doc header" pass
- DONE add API docs
- DONE port JS highlight files to TS, add at least 1 test


I'm dragging this group of features kicking and screaming into the century of the fruitbat.   If I didn't think needed a website, I have made other things with my dev-time.   I normally use 3rd party libraries to reduce dev time, but here I didn't see things that are relevant.  

## "business english" changelog

- Improve Google ranking on site as JS is smaller and faster.
- Port UI features from 2010 tech to more recent 2021 JS with 2022 compile and test tools.
- Due to better technology environment, I vastly improve software engineering quality metrics.

### Motivation

- Github keeps whining about old versions of jQuery ~ that I am not using, but may have been 5Y ago.
- Google keeps whining where I am pointlessly downloading 300KB of jQuery, and barely using it.
- Aside from this rewrite, JS changes are quite slow, as I don't write 2010 edition JS very often.

### Accounting

- This is an outsize, painful, death march of a rewrite for hygiene and flow improvements.  Every PM would say 'this is Bad Planning', and I agree.  I cannot see any means to split this change into smaller releases.
- PMs would also be happy that I kept 2010 era code this long, as good return on investment.
- I wrote the first edition of these features as I was unable to find anything that existed previously (aside from syntax highlighting).  
- This has a fairly high test coverage, as the early dev time was after I had done a long run, and was then sat on a train ~ sometimes with the sun in my eyes.   Multiple train trips.  I am testing-in to get improved confidence and adding types as a further safety.   Factoid: today, 73% of the code volume is tests.^H^H^H^H^H There is now extra layers of testing, the project is about 85% test data, but twice the volume of data (some tests are in TS).
- Some previous feedback: "your history/commits are messy".  True, its messier than I would like.  I can delete my Git history from any work I do for you if you wish ~ but my Dyslexia is permanent.  This project is building towards good Software engineering code from a lower jQuery baseline.  As the only version that a third party would use is the **complete copy** I lean towards a complete audit.   

<details>
<summary> User journeys in this project </summary>

### User journeys in this project

I am making a copy of the user interactions here (in the new project), as I would like to deprecate the older projects entirely.  There are some sample pages on my website, with stress on 'some', but I would like to avoid adding further samples here.  I can make links on this README...

- Adjacent articles 
	- User AJ deep links into my site from a search engine.
	- The target information is precise, but my boring site has enough meta information so this article seems relevant.  
	- AJ scans the longish page, the page content is organised, this is comfortable;  
	- however, this was the wrong article. 
	- but having read to the end, AJ sees a row of other articles.
	- The third one seems better to his needs, not what he typed into the search, and AJ starts to open it
	- when the mouse gets to the button, a tooltip appears showing the new page description; 
	- This is definitely what AJ needs, and clicks on the button.
	- New page loads and replaces the previous.
	- UX iteration: should I make this feature an infinite scroll of articles?  Currently the range of articles is clipped to what will fit on the screen,
	- UX iteration: the tooltips do no block mouse events, but people can't see this.  Translucence is bad for readability, but may indicate this.
    - UX note: categorisation was done my me.  It's possible other people may categorise differently.
- Fancy meta data on links
	- On a deep-link article, AJ is reading in detail, but needs authoritative sources to hand to management.
	- This site uses Harvard notation? But whilst hovering a link to see the URL, a rich link description appears.
	- AJ likes the convenience of this, it allows him to easily make an evaluation about the usefulness of the link to his needs. 
    - The links correlate with the text, which is good.
	- AJ feels more confident about the site that is clearly making it easy to depart if he wishes.
	- AJ wishes there was a copy link option, but he also thinks that he ought to read the links rather than send them to a director. 
	- Later he views the site from his phone, and discovers that the now-too-small links in the page are moved to a list at the end of the page.  Bonus.  This makes this page accessible.
	- UX: there are no hover actions on a phone, so the extra information is permanently displayed.
	- UX: There is a warning ~ mostly for the dev ~ when links are dead to the meta building script.  Cloudflare is the blocking action.
- SM/ share feature 
	- Whilst on the phone, AJ sees there has been some redesign for the smaller screen.
	- The row of SM links is now folded away,
	- AJ can see a "share" button, and uses this
	- and sees the previous list of SM.  Standard.  
	- But the first option is 'copy link' for the current article.  Useful.  But not relevant to current needs.
- 'Reading time' guide
	- On first impression AJ notes a fairly standard "reading time" guide.  This is useful but not that noteworthy.
	- It does mean that he sorts the order of his reading list for best use of time. 
- Effects
	- On a more code focussed page, AJ sees the links have been decorated with some sort of emoji.   The little logos for docs and Github.  Cute, improves readability, but again not significant.

</details>
<details>
<summary> Engineering details </summary>

## Engineering

Unlike many situations at work, there is no value and no attention for intermediate steps to be applied on this project.   I have a running platform, I will upgrade when the painful rewrite is complete.
In many places this project drags legacy "this code is good, it fixes this awkward oversight in that browser" to "this code is organised and tidy AND adds these UX features".  So this JS is now closer to how I write other languages.

My work sequence has been:

- port JS 1.6 to es2020
- ditch unused features, and improve readability/ English
- split into better modules
- port to typescript and better CSS/HTML
- add many tests using newer test frameworks
- split into better modules, refactor, and improve English again

Pls note English is my first language #leSigh.

### Engineering changelog

Software architecture
* This code is properly modular, with isolation and encapsulation
* None of this features are "long lived", they just tweak the document on page load
* This does show SRP, and layering
* This does show clear reporting on errors
* This doesn't have any global variables (i.e. document or window)
* With JS modules, there are less functions inside functions, so unit tests are easier and faster to build.   Improved unit-test coverage as it's now feasible (rather than behaviour testing).
* Early versions did have actual object composition, but I removed that as it made the types too complex
* this is not currently OO code, but would be when:
  - add single DocumentChange and  DataAdaptor interfaces and everything implements these
  - reduce the importance of "settings dicts", in favour of a more OO style setters
  - convert un-exported functions into private methods
* this code is not actual FP, but could be when:
  - drop any loops in favour of map() or forEach()
  - add other higher order functions, reducing fiddly branching
  - move module config to a function returning functions
  - there are no streams in this project, so nothing to lazily evaluate.  It doesn't make sense to stream the data files, as to make a complete page you need all the data.
* Sensible question: why doesn't this use Alpine, Stimulus or something (modern JS, and modules)?  I am trying to migrate the DOM fiddling sections over to CSS, and without those this code is small and not in a 3rd party framework.  This rewrite was to make everything SMALL. 

Notes:
- Functions tagged "PURE" do not effect the DOM, and tend to test quickly.
- **_NOTE_** Commits at the start of this project are completely meaningless, as it's just when I moved the code back to my dev machine. They are meaningless duration markers, rather than feature markers.
- Proper TDD units, as I have better tools now (JS modules + a fake DOM), make code better ~ separately to, and above every other bullet point.
- Vastly improve English / readability of the code. Gain is separate to all other points.
- Some of these unit tests are less meaningful than others, regrettably (running from Node).   It would be nice to setup test from a browser **UPDATE** I did, see `npm run web:test` .  Initially, to *look* at the UX (as in, I am being the success / fail criterion), I did some manual testing
- Use new language features (ADD a few KB of source) without jQuery (DROP >300KB of source). Dropping jQuery, as "select downloaded features" feature has been removed from https://jquery.com
- Use TEST_ONLY symbols that expose entire module to unit tests.   Tree-shaking means these do not show in release builds and is a free feature of most build tools.   I didn't invent this structure, but I have used it ever since I started with JS modules, rather than plain JS.
- As all this code is made after a minimiser script is adopted, faction code more finely into logical modules. So it's more readable.
- As a very non-funny joke: the first two versions of the SM sharebar are legacy HTML, but very easy to unit-test. Now I have much better test tech and libraries and less good tests on this feature.
- Assuming this project is frozen on feature completion, I do not need an installer.   I will manually copy 1 compiled file to the static-host local-image.   This project may not have any rollbacks/ reverts, tests are mandated.   
- I have used a short term solution to minification, as I need to move forward.  XXX #FIXME
- As far as Vite is a _code bundler_, I need to make all these separate outcome files as separate configs.  I probably can reduce the amount of configs duplication at a later date.   To repeat for clarity, each generated file is a separate file to syntax high-lighting for other languages.  Again via this library, CSS syntax highlighting isn't perfect. 
- There are some demo pages that I will need to retire or use CDN to host needed libraries.
- There isn't much logging, but logging is held to a wrapper, so I could jump to a centralised log (such as ELK) if I need to in future.
- My code has complex / unexpected behaviour if you change the DOM / document object without changing state.  This shouldn't be an issue outside tests, as this code doesn't support SSR presently.
- I want to reduce the amount of manually made snap-shot tests, as again it's a code smell (test and measure outcomes, not the recipe to achieve them, or the recipe is forced to be immutable).
- Minor gain for Google, I made the sliding window feature in Adjacent module this time, as I have more articles in each group.  This means unnecessary (not-rendered) nodes are not added to the HTML.  My rebuild of the Adjacent HTML is also smaller.  
- As this lump of JS is a single project rather than 6, there are less control flags needed.  This makes the code a bit simpler.
- This has a function equivalent to `int main(int argc, char * argv[])`, called _core_.  This is allowed to have a high volume and complexity as it wraps *all the other* methods.  As an architecture detail, this isn't avoidable.
- The highlight source is now in TS, as I found the type definitions.
- The process of expanding the number of tools in this project is adding features, but also acting as a lint as it shows small oversights.
- I added a UI feature that added extra HTML, but this didn't invalidate any of the unit-tests ~ they are not snapshot tests.
- I am adding search params for testing, rather than a Mock, as I may want to use them during QA
- It is expensive [in devtime] to create keyboard events in a different tab/ window.
- Why do I not tidy-up unused vars in this code base?  Most are in unit tests, its better readability if *standard* args are present, IMO (Promises, forEach or map etc)
- I think that most people do not need a commit for lint/prettier changes.  BUT I do this so I can see what changes /I/ made easily.  Occasionally lint tools product non-compilable changes, but this is rare.  If all the commits are squashed together with `rebase`, it's a nul-point difference.  UPDATE: the expanded eslint config does make garbage changes on some files, I do not know why.
- More recently, I made the eslint config more complex, and this reports extra details.
- I am also moving the MJS files in tests to TS.

#### Metrics that are important to goals

- OLD TECH (for the JS):: 
  - first bundle: 1MB flat
  - second bundle (smaller stdlib): 670KB
  - above but with with minify: 361KB
  - above but with dead code removal: 250KB
- initial NEW TECH (ignoring unit tests)::
  - complete build: 75KB flat files             >50% volume is comment headers
  - above with with minification: 23KB
  - Dead code removal didn't make any impact here, as tree shaking works properly now
  - above with gzip: 9KB   
    - UPDATE: due to further features, I have crept over the 10k boundary &lt;Meme: "so it begins"&gt;
  - I think I have perfect feature match, and new solution is 4% of volume of previous solution. UPDATE 6% in 2025

I have replaced the local CSS with better organised CSS to make it more readable.  I have updated to add more recent phones every few years.   I am adding more features using CSS.   I could reduce CSS volume if I had a tool to remove unneeded code from foundation imnport.   Recently, I have removed some old CSS from my style-sheet, but not much volume of change.   

</details>
<details open>
<summary> Engineering details </summary>

#### Outsize late in project commit
- The goal of this change is testing HTTPS only features (eg copy-and-paste) in a unit test AND testing CSS (eg z-index) features.   I never expected this thing to be useful in the longer term, just I couldn't find how to use some Vitest features.   UPDATE: as of 2025, the docs are updated, or a feature finished, or I found the information, in 2024 I was unable to find "how do I get a Page object in Vitest" (I also use playwright, but that architecture info isn't useful here).   This is a two-three day hack.
- **This code isn't a reference, just due process on (boring) website features **   
- Started to build another test harness, to be able to run Vitest in a browser.
   - Have new smol webserver in Express + HTTPS - this is NOT what I mean when I say I build internal services in Node as its lower initial dev-cost, this is just a test rig.   Never let this use an externally accessible IP.
   - Have a fresh captive version of Chrome.
   - Create "fake Vitest output" in the new script so can be integrated with other scripts into larger testing runtime.
- Iterate second build step to achieve this, obviously can't send TS to browser.
- Discover can't be done, change to jest for browser unit tests.
- Discover can't be done, change jest for jest-lite.
- Remove normal *build* use of JSDOM in Vitest as it was polluting variables.  This required moving the global variables round again.
- Rebuild all the tests due to this change (line above).
- Revalidate against TSC, as types became invalid.
- Refactor cookie code for readability.
- Do more code readability changes.
- DONE: Add jest-lite/ browser unit-tests for the skip() sections in vitest.  These are often behaviour centric tests.
- As the suite sits in Nov 2024, it takes about a minute to exec on a fast PC.   Most of the exec delay is **sleep()** due to the many process model in these tests.
- I have added template files, for later extension.  
- TODO: Want to add some CSS tests for crucial UI processes, like z-index.
- TODO: Make support for win32.
- TODO: Workout least stupid solution to test-harness needing unit tests, as its not simple code.
- Am I aware that Vitest supports a GUI mode? [✔].   It was doing that when I first started using this tool, see [https://vitest.dev/guide/ui.html].   Unless I read this feature wrongly, this is just an output driver, not running the modules in the browser.     

</details>
<details>
<summary>There is CSS here?</summary>
This project now holds the CSS used to style the site.   There is a slow moving change to move as much display logic into CSS as this is still presentation work.  I have structured the CSS to modern standards (2008 knowledge !== 2025 knowledge).   Most of my previous experience is "making a new feature with current tools" (each time).  

- I moved the CSS into this project, and rationalised it.
- The standards and browsers have moved since my first edition, and using newer CSS features works better.
- I have refactored the CSS to make it more readable, rather than minimum-spend "append abit more to the end".  My investment was all on English texts.   
- For browsers in 2005-8, I thought that CSS via HTML IDs worked better.   This may have been true for MSIE 5-6, but is false today.   I have reduced the number of HTML IDs used as CSS selectors.   
- I restructured the CSS into "features", rather than cloud of unique IDs/ class names.   I think I have improved the names used so it will be more clear to any readers.
- I have removed various old commented CSS, and also aggregated all my ideas notes into a single ideas file that I might read [ever].
- In 2022, I pulled any CSS blobs from the articles into the single CSS sheet, as I was hoping this would mean I could factor common sections and have less code.  This has worked somewhat.
- I discarded SOME older work when I imported Foundation [https://get.foundation/sites/docs/installation.html installation] [https://get.foundation/sites/docs/ docs] in 2017.   Most of the current CSS volume is Foundation
The articles with no extra/ dedicated CSS are composed of "standard components".  This is 25 features ~ all with enough RWD support:

- accessSrc         ~ vis ~ right aligned container for source repo links. 
- betterDL          ~ vis ~ where I define a list of terms, they are rendered via this.
- buttonBar	        ~ vis ~ some longer articles are chopped up, the button bar holds links to each sub article.
- addReferences     ~ a marker to enable references extra UI features.
- mobileBiblio      ~ vis ~ CSS feature to style the list of external links at the end of the article, when using a phone.
- tabs-content      ~ CSS for a tabsWidget, some code is Foundation, so different naming scheme.
- maquetteContainer ~ no-vis ~ maquette articles have a dedicated layout...
- footWidget        ~ vis ~ template to layout the links in the footer.  
- keyWordsWidget    ~ vis ~ some pages list keywords, this is added to support recruiters.
- accordionWidget   ~ vis ~ not used often, a CSS wrapper for DETAILS/ SUMMARY.
- logWidget         ~ vis ~ A widget for holding on screen messages like a console.  This approach is good for phones.
- popOverWidget     ~ vis ~ A display popup that overlays the rest of the page, includes X-to-close.   Used to make pages seem less long on first glance.
- linksWidget       ~ via heading ~ The CSS for the default menu on the top right of desktop mode.
- headingsWidget    ~ vis ~ The menu of internal headings in the current article .
- mastodonWidget    ~ vis ~ A feature with a DIALOG for choosing which [https://joinmastodon.org/servers Mastodon] server to send a SM link to.
- SMshareWidget     ~ via meta ~ A container/ list for all the external links and the article meta data. 
- metaWidget        ~ vis ~ A larger container for all the external links and the article meta data, contains previous element.
- adjacentWidget    ~ vis ~ CSS container for the related content same-site links, appears at the end of the article.  Mostly big-screen only.
- mobilePopupWidget ~ vis ~ for mobile only ~ the above SM links, but optimised for mobile.

- articleHeader     ~ via wholeArticle ~ CSS component to build the document headers.
- browserTest       ~ no-vis ~ Articles that includes technical features should include a test report on what browsers support the technology.  This renders it.
- lotsOfWords       ~ no-vis ~ a full-width block
- quiteWide         ~ no-vis ~ a 70em / 1120px block 
- halferWords       ~ no-vis ~ a 48em / 680px block
- fewWords          ~ no-vis ~ a 30em / 480px block  

Classes that start "add" normally just enable some feature, and have no CSS behaviour of their own.   There are some classes that are too simple and widely used to get a test.   
**With the test script running the vis-tests are served as https://127.0.0.1:8081/vis/*   Unlike my site, they need a full file-name**  Looking from multiple devices and screen sizes is advised

I may refactor to eliminate the word Widget.   Some pages have extra features eg [https://owenberesford.me.uk/resource/form-no-js-maquette], but this is rarer than adjustments.
I am adding test pages to show the articles with with broad range of content, rather than just the content when I made the feature. 
When running locally the "debug-layout" test capacity is useful.  

</details>
<details>
<summary> Lists of technical names </summary>

#### Browsers I manually test the boring site against

I initially just had the most common three, were I only adding Firefox as it is "not Chrome".   I am being vague about device here, as everything locally is a linux.  Modern linuxen will work on whatever screen you plugin.   I have run interactions on:
- Node/ Vitest   for tests
- recent Chrome / big-screen (BS)
- recent firefox / BS
- recent microsoft Edge / BS 
- recent Vivaldi / BS                 \ due to shenanigans on FF funding, I added these.
- recent libreWolf / BS               /
- recent duckduck / BS               I think this is Chrome with a hat on
- recent chrome / small-screen (SS)
- recent "android browser" / SS      I think this is Chrome with a hat on
- recent firefox / SS

#### Process to add a new webtest \#leSigh
I ought to improve this process.  These are the tests that build their own GUI/ browser.
* make src/test/\*webtest.mjs not the vitest files which are automated
* ensure execTest line is on the end of the new test
* copy config and rename files inside vite.config.*.ts 
* AUTOMATED update build script (the bash file) to include new artefact
* AUTOMATED update file list in the test runner
* run npm run build
* AUTOMATED copy compiled code to the fixtures dir (ts->min.mjs, css->min.css)
* if the test refers to any HTML, the HTML will need to be added as a fixture, or CORs will shut you down. 
* run npm run build:test
* run npm run test:web

#### values for 'NODE_ENV'
- development ~ used at runtime, in tests
- web-test ~ used at compile time, to make tests (affects linked libraries), '''RARE'''
- production ~ includes less libraries, used at build time and runtime

#### Known URL params that this code processes

- ''first'' string - only used in the group-indexes articles
- ''debug'' boolean - adjusts how many log messages are written
- ''width'' number - adds a fake width to the browser
- ''mobile'' boolean - force interpretation of current machine as a mobile device. Boolean value. In unit tests this MUST BE SET, as JSdom isn't a phone
- ''select'' - enable select and word count feature
- ''dump-css'' number 1 or 2               Currently disabled in the codebase
- ''aspect''   used with ''dump-css''
- ''debug-layout'' in the HTML rendering engine

#### Known CSS containers that this code processes

- .popOverWidget
- .tabsComponent
- .shareMenu
- .addReading
- .addArrow
- .addBashSamples
- .adjacentWidget 
- .addReferences
- .showBiblioErrors - this turns the broken link alert ON, which is OFF before all the content is downloaded
- .screenDocs - suppress DETAILS expansion on page load, as these are full width docs 
- .maquette - do not apply any effects ~ like DETAILS ~ to code demos
- Basic Containers
- .lotsOfWords
- .halferWords
- .fewWords
-
- **Please ensure .sr-only is defined (idea from bootstrap)**
</details>


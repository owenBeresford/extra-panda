I'm dragging this group of features kicking and screaming into the century of the fruitbat.   If I didn't think needed a website, I have made other things with my dev-time.

## "business english" changelog

- Improve Google ranking on site as JS is smaller and faster.
- Port UI features from 2010 tech to more recent 2020 JS with 2022 compile and test tools.
- Due to better technology environment vastly improve software engineering quality metrics.

### Motivation

- Github keeps whining about old versions of jQuery ~ that I am not using, but may have been 5Y ago.
- Google keeps whining where I am pointlessly downloading 300KB of jQuery, and barely using it.
- Aside from this rewrite, JS changes are quite slow, as I don't write 2010 edition JS very often.

### Accounting

- This is an outsize, painful, death march of a rewrite for hygiene and flow improvements.  Every PM would say 'this is Bad planning', and I agree.  I cannot see any means to split this change into smaller releases.
- Note, PMs would also be happy that I kept 2010 era code this long, as good return on investment.
- I wrote the first edition of these features as I was unable to find anything that existed previously (aside from syntax highlighting).  
- This has a fairly high test coverage, as the early dev time was after I had done a long run, and was then sat on a train ~ sometimes with the sun in my eyes.   Multiple train trips.  I am testing-in to get improved confidence and adding types as a further safety.  
- Some previous feedback: "your history/commits are messy".  True, its messier than I would like.  I can delete my Git history from any work I do for you if you would like ~ but Dyslexia is permanent.  This project is building towards good Software engineering code from a lower jQuery baseline.  As the only version that a third party would use is the **complete copy** I lean towards a complete audit.   

<details>
<summary> User journeys in this project </summary>

### User journeys in this project

I am making a copy of the user interactions here (in the new project), as I would like to deprecate the older projects entirely.  There are some sample pages in my website, with stress on 'some', but I would like to avoid adding further samples here.  I can make links on this README...

- Adjacent articles 
	- User AJ deep links into my site from a search engine.
	- The target information is precise, but my boring site has enough meta information that this article is seems relevant.  
	- AJ scans the longish page, the page content is organised this this is comfortable;  
	- however, this was the wrong article. 
	- but having read to the end, AJ sees a row of other articles.
	- The third one seems better to his needs, not what he typed into the search, and AJ starts to open it
	- when the mouse gets to the button, a tooltip appears showing the new page description; 
	- This is definitely what AJ needs, and clicks on the button.
	- New page loads and replaces previous.
	- UX iteration: should I make feature this an infinite scroll of articles?  Currently the range of articles is clipped to what will fit on the screen,
	- UX iteration: the tooltips do no block mouse events, but people can't see this.  Translucence is bad for readability, but may indicate this.
    - UX note: categorisation was done my me.  Its possible other people may categorise differently.
- Fancy meta data on links
	- On a deep-link article, AJ is reading in detail, but needs authoritative sources to hand to management.
	- This site uses Harvard notation? But whilst hovering a link to see the URL, a rich link description appears.
	- AJ like the convenience of this, it allows him to easily make an evaluation about the usefulness of the link to his needs. 
    - The links correlate with the text, which is good.
	- AJ feels more confident about the site that is clearly making it easy to depart if he wishes.
	- AJ wishes there was a copy link option, but he also thinks that he ought to read the links rather than send them to a director. 
	- Later he views the site from his phone, and discover the now too small links in the page are moved to a list at the end of the page.  Bonus.  This makes this page accessible.
	- UX: there are no hover actions on a phone, so the extra information is permanently displayed.
	- UX: There is a warning ~ mostly for the dev ~ when links are dead to the meta building script.  Cloudflare is blocking action.
- SM/ share feature 
	- Whilst on the phone, AJ sees there has been some redesign for the smaller screen.
	- The row of SM links is now folded away,
	- AJ can see a "share" button, and uses this
	- and sees the previous list of SM.  Standard.  
	- But the first option is 'copy link' for the current article.  Useful.  But not relevant to needs now.
- 'Reading time' guide
	- On first impression AJ notes a fairly standard "reading time" guide.  This is useful but not that noteworthy.
	- It does mean that he sorts the order of his reading list for best use of time. 
- Effects
	- On a more code focussed page, AJ sees the links have been decorated with some sort of emotie.   The little logos for docs and github.  Cute, improves readability, but again not significant.

</details>
<details>
<summary> Engineering details </summary>

## Engineering

Unlike many situations at work, there is no value and no attention to intermediate steps should be applied on this project.   I have a running platform, I will upgrade when the painful rewrite is complete.

My work sequence has been:

- port JS 1.6 to es2020
- ditch unused features, and improve readability/ English
- split into better modules
- port to typescript and better CSS/HTML
- add many tests
- split into better modules, refactor, and improve English again

Pls note English is my first language #leSigh.

### Engineering changelog

- **_NOTE_** Commits at the start of this project are completely meaningless, as its just when I moved the code back to my dev machine. They are meaningless duration markers, rather than feature markers.
- Some of these unit tests are less meaningful than others, regrettably (running from Node).   It would be nice to setup test from a browser.  To *look* at the UX (as in, I am being the success/ fail criterion), I did some manual testing
- Use new language features (ADD a few KB of source) without jQuery (DROP >300KB of source). Dropping jQuery, as "select downloaded features" feature has been removed from https://jquery.com
- Drop unused features. This makes everything less confusing and more readable.
- With JS modules, have less functions inside functions, so unit tests are easier.   Improve unit-test coverage as its now feasible (rather than behaviour testing).
- Use TEST_ONLY symbols that expose entire module to unit tests.   I will add config to strip them in release build.
- Drop legacy test tools.
- As proper TDD units as I have better tools now (JS modules + a fake DOM), make code better ~ separately to, and above every other bullet point. WARN: Some tests cannot be run outside of a real webrowser.
- Vastly improve English/ readability of the code. Gain is separate to all other points.
- As all this code is made after a minimiser script is adopted, faction code more finely into logical modules. So its more readable.
- As a design principle, I have tried to avoid using global objects in my code to make testing easier.   I can pass in, say, ''document'' as an optional param.
- As a very non-funny joke: the first two versions of the SM sharebar are legacy HTML, but very easy to unit-test. Now I have much better test tech and libraries and less good tests on this feature.
- This has quite high levels of testing.   I have used JSDOM as part of JEST and similar tools.  This project is the first time I am using it directly.   It is a quite civilised was to test.
- Assuming this project is frozen on feature completion, I do not need an installer.   I will manually copy 1 compiled file to the static-host local-image.
- I have used a short term solution to minification, as I need to move forward.
- As far as Vite is a _code bundler_, I need to make all these separate outcome files as separate configs.  I probably can reduce the amount of configs duplication at a later date.   To repeat for clarity, each generated file is a separate file to syntax high-lighting for other languages.  Note again, CSS syntax highlighting isn't perfect. 
- There are some pages that I will need to retire or use CDN to host.
- There isn't much logging, but logging is held to a wrapper, so I could jump to a centralised log (such as ELK) if I need to in future.
- Minor gain for Google, I made the sliding window feature in Adjacent module this time, as I have more articles in each group.  This means unnecessary (not-rendered) nodes are not added to the HTML.  My rebuild of the Adjacent HTML is also smaller.  
- OLD TECH:: 
  - first bundle: 1MB flat
  - second bundle (smaller stdlib): 670KB
  - above but with with minify: 361KB
  - above but with dead code removal: 250KB
- NEW TECH (ignoring unit tests)::
  - complete build: 75KB flat
  - above with with minification: 23KB
  - Note dead code removal didn't make any impact here, as tree shaking works properly now
  - above with gzip: 9KB  
  - I think I have perfect feature match, and new solution is 4% of volume of previous solution.

</details>
<details>
<summary> Lists of technical names </summary>

#### Known params that this code processes

- ''first'' string - only used in the group-indexes articles
- ''debug'' boolean - adjusts how many log messages are written
- ''mobile'' boolean - force interpretation of current machine as a mobile device. In unit tests this MUST BE SET (1 or 0), as JSdom isn't a phone

#### Known CSS containers that this code processes

- .popOverWidget
- .tabsComponent
- .shareMenu
- .addReading
- .addArrow
- .addBashSamples
- .addReferences

</details>


I'm dragging this group of features kicking and screaming into the century of the fruitbat.  If I didn't think needed a website, I have made other things I could have done with my dev-time.    

## "business english" changelog

* Improve Google ranking on site as JS is smaller and faster.
* Port UI features from 2010 tech to more recent 2020 JS with 2022 compile and test tools.
* Due to better technology environment vastly improve software engineering quality metrics.

### Motivation

* Github keeps whining about old versions of jQuery that I am not using.
* Google keeps whining where I am pointlessly downloading 300KB of jQuery, and barely using it.
* Aside from this rewrite, JS changes are quite slow, as I don't write 2010 edition JS very often.

### Accounting

* This is an outsize, painful, death march of a rewrite for hygiene and flow improvements.  Every PM would say 'this is Bad planning', and I agree.
* Note, PMs would also be happy that I kept 2010 era code this long, as good return on investment.  


### Engineering changelog

Unlike many situations at work, there is no value and should be no attention to intermediate steps on this project.  I have a running platform, I will upgrade when the painful rewrite is complete.

My work sequence has been:
* port JS 1.6 to es2020
* ditch unused features, and improve readability/ english
* split into better modules
* port to typescript and better CSS/HTML
* add many tests
* split into better modules and improve english again
Pls note English is my first language #leSigh.

### Engineering changelog

* ***NOTE*** Commits at the start of this project are completely meaningless, as its just when I moved the code back to my dev machine.   They are meaningless duration markers, rather than feature markers.
* Some of these unit tests are less meaningful than others, regrettably (running from Node). 
* Use new language features (ADD a few KB of source) without jQuery (DROP >300KB of source). Dropping jQuery, as "select downloaded features" feature has been removed from https://jquery.com 
* Drop unused features. This makes everything less confusing and more readable.
* With JS modules, have less functions inside functions, so unit tests are easier.  Improve unit-test coverage as its now feasible (rather than behaviour testing).
* Use TEST\_ONLY symbols that expose entire module to unit tests.  I will add config to strip them in release build.
* Drop legacy test tools.
* As proper TDD units as I have better tools now (JS modules + a fake DOM), make code better ~ separately to, and above every other bullet point.  WARN: Some tests cannot be run outside of a real webrowser.
* Vastly improve English/ readability of the code.  Gain is separate to all other points. 
* As all this code is made after a minimiser script is adopted, faction code more finely into logical modules.  So its more readable.
* As a design principle, I have tried to avoid using global objects in my code, to make testing easier.  I can pass in, say, document as an optional param.   
* As a very non-funny joke: the first two versions of the SM sharebar are legacy HTML, but very easy to unit-test.  Now I have much better test tech and libraries and less good tests on this feature.

### Known params that this code processes

* first  string  - only used in the group-indexes articles
* debug  boolean - adjusts how many log messages are written
* mobile boolean - force interpretation of current machine as a mobile



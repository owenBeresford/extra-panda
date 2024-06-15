Im dragging this group of features kicking and screaming into the century of the fruitbat.

"business english" changelog
* Improve Google ranking onsite as JS is smaller and faster.
* Port feature from 2010 tech to more recent 2020 JS with 2022 compile and test tools.
* Due to better technology environment vastly improve software engineering quality metrics.

Motivation
* Github keeps whining about old versions of jQuery that I am not using
* Google keeps whining where I am pointlessly downloading 300KB of Jquery, and barely using it
* Aside fon this rewrite, changes are qute slow, as I dont write 2010 edition JS very often

Accounting
* This is an outsize, painful, death march of a rewrite for hygene and flow improvements.  Every PM would say 'this is Bad planning', and I agree
* Note, PMs would also be happy that I kept 2010 era code this long, as good return on investment  

engineering changelog
* use new language features (ADD a few KB of source) without jQuery (DROP >300KB of source). Dropping jQuery, as "select downloaded features" feature has ben removed
* Drop unused features. This makes everything less confusing
* With JS modules, have less functions inside function, so unit tests are easier.  Improve test coverage as its now feasible
* Use TEST_ONLY symbols that expose entire module to unit tests.  Will add config to strip them in release build
* Drop legacy test tools
* As proper TDD units, make code better ~ seperately to, and above every other bullet point. 
* Vastly improve english/ readability of the code.  Gain is seperate to all other points. 
* As all code made after minimiser script is adopted, faction code more finely into logical modules.  So moore readable
* As a design principle, I have tried to avoid using global objects in my code, to make testing easier.  I can pass in, say, document as an optional param.   


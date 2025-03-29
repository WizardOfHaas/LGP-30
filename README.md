# Web LGP-30

This is my attempt at an LGP-30 emulator that can run in a browser.

# Why do this?

I want an accessible way to show off the LGP-30. My big plan is to use this emulator to construct demos of how software was written, and how programs were loaded in 1956.

...and I want to try and run Mel Kaye's famous blackjack program.

# Current State:

In a word: fluid.

I have a 90% working emulator hooked up in `lgp30.html`. It can do most things... but there is a pernicious issue with loading tapes. It's something structural, so I'm refactoring. 

In this process I'm moving from JavaScript(a langauge I'm OK with) to TypeScript(a language I actually like). The new version is in `src/`. It isn't working yet, but I'm getting close. I'm planning to implement unit testing and the works.

Keep your eyes peeled, as things should be moving quickly.
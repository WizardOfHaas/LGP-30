# Release Notes

## Other Content

* [Read Me](./README.md)
* [Release Notes](./release-notes.md)
* [Developer Notes](./ts-lgp-30-dev/developer-notes.md)
* [TODO](./ts-lgp-30-dev/todo.md)

## Release Summary

| Version | Date     | Summary                                 |
|---------|----------|-----------------------------------------|
| 1.4.0   | 20260125 | removed all async/await                 |
| 1.3.0   | 20260104 | adopt html5 by default                  |
| 1.2.1   | 20251226 | fix a design choice for track / sector  |
| 1.2.0   | 20251221 | cleanup jquery, html5                   |
| 1.1.1   | 20251214 | Fix issues with asm                     |
| 1.1.0   | 20251212 | Isolating LGP30 class with its own test |
| 1.1.0   | 20251130 | Working ts-lgp-30-html5 project         |
| 1.1.0   | 20251114 | Working on pure HTML5 version           |
| 1.0.1   | 20251112 | Merged Vite version to ts-lgp-30        |
| 1.0.1   | 20251101 | Vite version.                           |
| 1.0.0   | 20251031 | Tidy up node dependencies.              |
| 1.0.0   | 20251019 | Tidy project and folder layout.         |
| 1.0.0   | 20250920 | Fork of Sean's original source.         |
| 1.0.0   | 20250724 | Sean's original source.                 |

## Version 1.4.0

* renamed my folder to ts-lgp3-dev
* removed all async/await and implemented a clock timer to simulate the clock track on the drum

## Version 1.3.0

* adopt the html5 changes by default

## Version 1.2.1

* fix the design choice to define types for TrackNumber and SectorNumber. these should be number types.
  * use `number` for all parameter passing.
  * range check the value of `number`
  * add formatters that convert `number` to and from `string` as decimal and flex (flexowrite hex).
  * improved lint for typescript

## Version 1.2.0

* kept jquery and removed the global window object hack
* migrated to html5
* attempted to remove boostrap, postponed for another time.

## Version 1.1.1

Fix issues with asm

assembleLine breaks when you change the `l` parameter type from `any` to `string`
The root cause is that the type of Track and Sector is expected to be 2 digit `hexadecimal` strings.
The better approach is that Track and Sector are `number` and provide conversion methods to encode and decode the `hex` string to the numeric type.
Track and Sector touch lots of places in the codebase, hopefully most of it is transparent.
Unit test will be written to cover the refactor needed to address this issue.

## Version 1.1.0

* 20251212 Isolating LGP30 class with its own test
  * Attempt to document the current objects

* 20251130 Working ts-lgp-30-html5 project
  * added ts-lgp-30-html

* 20251114 Working on pure HTML5 version
  * eliminate jquery
  * eliminate xterm
  * eliminate bootstrap
* Deploy "dev" version to cloudflare
* Added eslint
* Added unit test for RegisterC before fixing issues raised by lint.
* Added unit test for util before fixing issues raised by lint.
* Added proto.html, main.css, main.ts for independant html5 development.
* Fixed issues raised by lighthouse.

## Version 1.0.1

* 20251112 Merged Vite version to ts-lgp-30 folder.

* 20251101 Using Vite as a bundler.
* Is just a platform and config change, so only considered an edition.
* Development to be done on a copy in ts-lgp-30-vite
* Vite is working
* Added favicon from advent of computing
* Basic Vitest is working

## Version 1.0.0

* 20251031 Tidy up node dependencies.

* 20251019 Tidied up project and folder layout.
  * Identified and split out various projects to their own folders.
  * Restructured TS version to a normal TS project layout.
  * Made sure build / test / local run still works.
* 20250920 Forked Sean's original source.
* 20250724 Sean's original source.

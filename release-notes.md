# Release Notes

## Other Content

* [Read Me](./README.md)
* [Release Notes](./release-notes.md)
* [Developer Notes](./ts-lgp-30/developer-notes.md)

## Release Summary

| Version | Date     | Summary                                 |
|---------|----------|-----------------------------------------|
| 1.1.0   | 20251212 | Isolating LGP30 class with its own test |
| 1.1.0   | 20251130 | Working ts-lgp-30-html5 project         |
| 1.1.0   | 20251114 | Working on pure HTML5 version           |
| 1.0.1   | 20251112 | Merged Vite version to ts-lgp-30        |
| 1.0.1   | 20251101 | Vite version.                           |
| 1.0.0   | 20251031 | Tidy up node dependencies.              |
| 1.0.0   | 20251019 | Tidy project and folder layout.         |
| 1.0.0   | 20250920 | Fork of Sean's original source.         |
| 1.0.0   | 20250724 | Sean's original source.                 |

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

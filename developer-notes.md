# Developer Notes

## Other Content

* [Read Me](./README.md)
* [Release Notes](./release-notes.md)
* [Developer Notes](./developer-notes.md)

## TODO

Categories are:

* bug
* feature
* wish
* tidy

Newest items at top

| Item                                    | Category | Status   | Note                  |
|-----------------------------------------|----------|----------|-----------------------|
| compile and test with new folder layout | tidy     | done     | works as per original |
| restructure folder layout               | tidy     | done     |                       |
| act1 in it's own folder                 | tidy     | done     |                       |
| original js version in its own folder   | tidy     | done     |                       |

## Suggested TS Project Layout

Only the basics of this is implements so far.

Suggested minimal directory layout for a TypeScript + HTML project (placed under LGP-30/ts-lgp30):

* package.json
* package-lock.json
* tsconfig.json

* src/
  * index.ts (app entry / client bootstrap)
  * app/ (TypeScript app code)
    * main.ts
    * lib/
      * utils.ts
  * public/ (static assets that should be committed)
    * index.html
    * styles.css
    * assets/
  * test/
    * unit/
      * utils.test.ts
* dist/ (compiled output; created by tsc)
* .github/
  * workflows/
    * main.yml

Why this layout (short):

* src/ contains all source TS and a public/ subfolder for HTML/CSS/images — keeps sources tracked and easy to copy to dist or deploy.
* public/ holds the HTML entry (index.html) and other static files, so build and CI can copy them to the output or server root.
* dist/ is the compile output (ignored in git).
* test/ holds unit tests (vitest / jest / mocha).
* .github/workflows/ci.yml runs build + tests.

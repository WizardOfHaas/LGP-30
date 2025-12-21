# To Do List

## Other Content

* [Read Me](../README.md)
* [Release Notes](../release-notes.md)
* [Developer Notes](./developer-notes.md)
* [TODO](./todo.md)

## TODO

Categories are:

* bug
* feature
* wish
* tidy

Newest items at top

Status are:

* progress
* done
* todo

| Item                                    | Category | Status   | Note                                       |
|-----------------------------------------|----------|----------|--------------------------------------------|
| migrate to html5, inhouse styles        | tidy     | progress | use rem font size                          |
| keep and cleanup jquery                 | tidy     | progress | remove the global hack                     |
| document and unit test mem class        | feature  | done     | npm vite:test src/mem/mem.test.ts          |
| document and unit test asm class        | feature  | progress | npm vite:test src/asm.test.ts finish tests |
| add typedocs                            | feature  | done     | added docs script                          |
| write pure html5 version                | feature  | progress | remove 3rd party css and js dependencies   |
| expand vitest tests                     | wish     | todo     | all other *.test.ts files                  |
| write vitest tests                      | feature  | progress | index.test.ts complete                     |
| use Vite tooling                        | feature  | done     | vite and vitest works                      |
| compile and test with new folder layout | tidy     | done     | works as per original                      |
| restructure folder layout               | tidy     | done     |                                            |
| act1 in it's own folder                 | tidy     | done     |                                            |
| original js version in its own folder   | tidy     | done     |                                            |

## HTML5 Migration

The existing html is 4.something with quirks mode. Migration to html5 includes the removal of 3rd party styles and bring all the styles inhouse written in plain CSS. No external style libraries.

## Relative Font Sizes

| rem      | Points (pt)  | Pixels (px) | CSS Keyword,rem Equivalent,Approx. Pixels |
|----------|--------------|-------------|-------------------------------------------|
| 0.5rem   |  6pt         |  8px        |                                           |
|          |              |             | xx-small,~0.56rem,9px                     |
|          |              |             | x-small,~0.625rem,10px                    |
| 0.75rem  |  9pt         | 12px        |                                           |
|          |              |             | small,~0.81rem,13px                       |
| 0.875rem | 10.5pt       | 14px        |                                           |
| 1rem     | 12pt         | 16px        | medium,1rem,16px (Default)                |
| 1.25rem  | 15pt         | 20px        | large,~1.125rem,18px                      |
| 1.5rem   | 18pt         | 24px        | x-large,~1.5rem,24px                      |
| 2rem     | 24pt         | 32px        | xx-large,~2rem,32px                       |
|          |              |             | xxx-large,~3rem,48px                      |

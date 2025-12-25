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
* hold

| Item                                    | Category | Status   | Note                                       |
|-----------------------------------------|----------|----------|--------------------------------------------|
| inhouse styles                          | wish     | todo     | remove bootstrap                           |
| migrate to html5, inhouse styles        | tidy     | done     | use rem font size                          |
| keep and cleanup jquery                 | tidy     | done     | remove the global window hack              |
| document and unit test mem class        | feature  | done     | npm vite:test src/mem/mem.test.ts          |
| document and unit test asm class        | feature  | progress | npm vite:test src/asm.test.ts finish tests |
| add typedocs                            | feature  | done     | added docs script                          |
| write pure html5 version                | wish     | hold     | remove all 3rd party js, css dependencies  |
| expand vitest tests                     | wish     | todo     | all other *.test.ts files                  |
| write vitest tests                      | feature  | progress | index.test.ts complete                     |
| use Vite tooling                        | feature  | done     | vite and vitest works                      |
| compile and test with new folder layout | tidy     | done     | works as per original                      |
| restructure folder layout               | tidy     | done     |                                            |
| act1 in it's own folder                 | tidy     | done     |                                            |
| original js version in its own folder   | tidy     | done     |                                            |

## HTML5 Migration

The existing html is 4.something with quirks mode. Migrate to html5 and fix layout issues caused by well defined standards.

## Relative Font Sizes

| CSS Keyword | rem       | Points (pt)  | Pixels (px) |
|-------------|-----------|--------------|-------------|
|             | 0.5rem    | 6pt          | 8px         |
| xx-small    | 0.5625rem |              | 9px         |
| x-small     | 0.625rem  |              | 10px        |
|             | 0.75rem   | 9pt          | 12px        |
| small       | 0.8125rem |              | 13px        |
|             | 0.875rem  | 10.5pt       | 14px        |
| medium      | 1rem      | 12pt         | 16px        |
| large       | 1.25rem   | 15pt         | 20px        |
| x-large     | 1.5rem    | 18pt         | 24px        |
| xx-large    | 2rem      | 24pt         | 32px        |
| xxx-large   | 3rem      |              | 48px        |

## Flexo Hex

| dec | hex |
|-----|-----|
|   0 |   0 |
|   1 |   1 |
|   2 |   2 |
|   3 |   3 |
|   4 |   4 |
|   5 |   5 |
|   6 |   6 |
|   7 |   7 |
|   8 |   8 |
|   9 |   9 |
|  10 |   f |
|  11 |   g |
|  12 |   j |
|  13 |   k |
|  14 |   q |
|  15 |   w |

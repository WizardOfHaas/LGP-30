import { describe, test, expect } from 'vitest'
import { insertArrayAt } from './util'

describe("utils", () => {
    test("test insertArrayAt", () => {
        const arr = insertArrayAt([1, 2, 3, 4, 5], 2, ['a', 'b', 'c'])
        expect(arr).toStrictEqual([1, 2, 'a', 'b', 'c']) // TODO, insert should extend the array as per below
        //expect(arr).toStrictEqual([1, 2, 'a', 'b', 'c', 4, 5])
    })
})
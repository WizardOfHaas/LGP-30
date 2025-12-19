import { describe, test, expect } from 'vitest'
import { insertArrayAt, toLGPHex } from './util'

describe("test the utils class", () => {

    test("test toLGPHex", () => {
        expect(toLGPHex("")).toEqual("")
        expect(toLGPHex(" ")).toEqual(" ")
        expect(toLGPHex("0")).toEqual("0")
        expect(toLGPHex("9")).toEqual("9")
        expect(toLGPHex("1a2b3c4d")).toEqual("1f2g3j4k")
        expect(toLGPHex("0123456789abcdef")).toEqual("0123456789fgjkqw")
        expect(toLGPHex("ff")).toEqual("ww")
        expect(toLGPHex("fg")).toEqual("wg")
    })

    test("test insertArrayAt", () => {
        const arr = insertArrayAt([1, 2, 3, 4, 5], 2, ['a', 'b', 'c'])
        expect(arr).toStrictEqual([1, 2, 'a', 'b', 'c']) // TODO, insert should extend the array as per below
        //expect(arr).toStrictEqual([1, 2, 'a', 'b', 'c', 4, 5])
    })
})
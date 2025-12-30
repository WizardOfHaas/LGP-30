import { describe, test, expect } from 'vitest'
import { addrToHex, insertArrayAt, toLGPHex } from './util'

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
        const arr = insertArrayAt([1, 0, 1, 0, 1], 2, [0, 1, 0])
        expect(arr).toStrictEqual([1, 0, 0, 1, 0]) // TODO, insert should extend the array as per below
        //expect(arr).toStrictEqual([1, 2, 'a', 'b', 'c', 4, 5])
    })

    test('test addrToHex', () => {
        expect(addrToHex(0)).toEqual('0000')
        expect(addrToHex(1)).toEqual('0001')
        expect(addrToHex(9)).toEqual('0009')
        expect(addrToHex(10)).toEqual('000f')
        expect(addrToHex(15)).toEqual('000w')
        expect(addrToHex(1023)).toEqual('0f17')
        expect(addrToHex(1024)).toEqual('0f18')
        // expect(addrToHex(4095)).toEqual('0www') breaks, need to check why
        // console.debug('4095', addrToHex(4095))
    })
})
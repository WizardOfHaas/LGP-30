/**
 * unit test for asm class
 */
import { describe, test, beforeEach, expect } from 'vitest'
import { Memory } from './mem'
import { BitArray } from '../types'

describe("test the mem class", () => {
    let mem: Memory

    beforeEach(() => {
        mem = new Memory()
    })

    test("test the first memory location is clear", () => {
        const expected = Array<BitArray>(1).fill(Array(32).fill(0))
        const val = mem.get('00', '00')
        expect(val).toEqual(expected)
    })

    // test("test the first memory location is clear", () => {
    //     const expected = Array<BitArray>(1).fill(Array(32).fill(0))
    //     const data = Array<BitArray>(1).fill(Array(32).fill(0))
    //     mem.set('00', '09', data)
    //     const val = mem.get('00', '09')
    //     expect(val).toEqual(expected)
    // })
})

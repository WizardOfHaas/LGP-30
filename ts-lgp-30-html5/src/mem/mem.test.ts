/**
 * unit test for asm class
 */
import { describe, test, beforeEach, expect } from 'vitest'
import { Memory } from './mem'
import type { BitArray } from "../types";
import { asTrack, asSector } from "../types/numbers";

describe("test the mem class", () => {
    let mem: Memory

    beforeEach(() => {
        mem = new Memory()
    })

    test("test that the first memory location is clear", () => {
        const val = mem.get(asTrack('00'), asSector('00'))
        const zeros: BitArray = new Array(32).fill(0);
        expect(val).toEqual(zeros)
    })

    test("test that mem set and get return expected values", () => {
        // expect memory at '0009' to be empty
        const track = asTrack('00')
        const sector = asSector('09')
        const val = mem.get(track, sector)
        const zeros: BitArray = new Array(32).fill(0);
        expect(val).toEqual(zeros)
        // set memory at '0009' to new value
        const ones: BitArray = new Array(32).fill(1);
        mem.set(track, sector, ones)
        // read it back and expect to see the new value
        const val2 = mem.get(track, sector)
        expect(val2).toEqual(ones)
        // clear the memory and expect to see zeros
        mem.clear()
        const val3 = mem.get(track, sector)
        expect(val3).toEqual(zeros)
    })
})

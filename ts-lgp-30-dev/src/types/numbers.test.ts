// numbers.test.ts
import { describe, test, expect, expectTypeOf } from 'vitest'
import type { SixBitNumber, TrackNumber, SectorNumber } from './numbers'
import { asSixBit, asTrack, asSector, toBinary, toBits } from './numbers'

describe("test SixBitNumber type and functions", () => {

    test("asSixBit wraps values around 6 bits", () => {
        expect(asSixBit(-1)).toBe(63);
        expect(asSixBit(0)).toBe(0);
        expect(asSixBit(64)).toBe(0);
    });

    test("test asSixBit from number", () => {
        const zero = asSixBit(0)
        expectTypeOf(zero).toEqualTypeOf<SixBitNumber>();
        expect(zero).toBe(0)
        expect(toBinary(zero)).toBe('000000')
        const sixtyThree = asSixBit(63)
        expect(sixtyThree).toBe(63)
        expect(toBinary(sixtyThree)).toBe('111111')
    })

    test("test asSixBit from bits", () => {
        const zero = asSixBit([0, 0, 0, 0, 0, 0])
        expectTypeOf(zero).toEqualTypeOf<SixBitNumber>();
        expect(zero).toBe(0)
        expect(toBinary(zero)).toBe('000000')
        const sixtyThree = asSixBit([1, 1, 1, 1, 1, 1])
        expect(sixtyThree).toBe(63)
        expect(toBinary(sixtyThree)).toBe('111111')
        expect(toBits(sixtyThree)).toStrictEqual([1, 1, 1, 1, 1, 1])
    })
})

describe("test TrackNumber type and functions", () => {

    test("asTrack wraps values around 6 bits", () => {
        expect(asTrack(-1)).toBe(63);
        expect(asTrack(0)).toBe(0);
        expect(asTrack(64)).toBe(0);
    });

    test("test asTrack from number", () => {
        const zero = asTrack(0)
        expectTypeOf(zero).toEqualTypeOf<TrackNumber>();
        expect(zero).toBe(0)
        const sixtyThree = asTrack(63)
        expect(sixtyThree).toBe(63)
    })

    test("test asTrack from string", () => {
        const zero = asTrack('00')
        expectTypeOf(zero).toEqualTypeOf<TrackNumber>();
        expect(zero).toBe(0)
        const sixtyThree = asTrack('63')
        expect(sixtyThree).toBe(63)
    })
})

describe("test SectorNumber type and functions", () => {
    test("asSector wraps values around 6 bits", () => {
        expect(asSector(-1)).toBe(63);
        expect(asSector(0)).toBe(0);
        expect(asSector(64)).toBe(0);
    });

    test("test asSector from number", () => {
        const zero = asSector(0)
        expectTypeOf(zero).toEqualTypeOf<SectorNumber>();
        expect(zero).toBe(0)
        const sixtyThree = asSector(63)
        expect(sixtyThree).toBe(63)
    })

    test("test asSector from string", () => {
        const zero = asSector('00')
        expectTypeOf(zero).toEqualTypeOf<SectorNumber>();
        expect(zero).toBe(0)
        const sixtyThree = asSector('63')
        expect(sixtyThree).toBe(63)
    })
})
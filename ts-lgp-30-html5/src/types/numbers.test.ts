// numbers.test.ts
import { describe, test, expect, expectTypeOf } from 'vitest'
import type { SixBitNumber, TrackNumber, SectorNumber } from './numbers'
import { asSixBit, asTrack, asSector, toBinary, toBits } from './numbers'


describe("test SixBitNumber type and functions", () => {

    test("asSixBit throws on invalid number", () => {
        expect(() => asSixBit(-1)).toThrow();
        expect(() => asSixBit(64)).toThrow();
        expect(() => asSixBit('64')).toThrow();
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

    test("asTrack throws on invalid number", () => {
        expect(() => asTrack(-1)).toThrow();
        expect(() => asTrack(64)).toThrow();
        expect(() => asTrack('64')).toThrow();
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
    test("asSector throws on invalid number", () => {
        expect(() => asSector(-1)).toThrow();
        expect(() => asSector(64)).toThrow();
        expect(() => asSector('64')).toThrow();
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
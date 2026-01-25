/**
 * unit test for asm class
 */
import { describe, test, beforeEach, expect } from 'vitest'
import type { BitArray } from "./types";
import { asTrack, asSector } from "./types/numbers";
import { assembleLine } from './asm'
import { LGP30 } from "./lgp30"

describe("test the asm module", () => {
    let lgp30: LGP30

    // this is purely access to memory, no other states are affected
    beforeEach(() => {
        lgp30 = new LGP30()
    })

    test("test assemble a single line with constant", () => {
        // expect memory at '0009' to be zeros
        const track = asTrack('00')
        const sector = asSector('09')
        const val = lgp30.state.memory.get(track, sector)
        const zeros: BitArray = new Array(32).fill(0);
        expect(val).toEqual(zeros)
        // assemble a line that sets location "0009" to the value 5
        assembleLine(lgp30.state.memory, "0009 5")
        // expect memory at '0009' to be 5
        const val2 = lgp30.state.memory.get(track, sector)
        // set expected to 5 - last 3 bits are 1,0,1
        const expected: BitArray = new Array(32).fill(0);
        expected[29] = 1
        expected[31] = 1
        expect(val2).toEqual(expected)
    })

    test("test assemble unconditional jump order to '0002' into location '0000'", () => {
        // check pre-assembly memory
        const zeros: BitArray = new Array(32).fill(0);
        expect(lgp30.state.memory.get(asTrack('00'), asSector('00'))).toEqual(zeros)
        // assemble unconditional jump to '0002' into location '0000'
        assembleLine(lgp30.state.memory, "0000 u0002")
        // check the pattern assembled into memory
        //       ignore|order|pad| track|sector|pad
        // 000000000000| 1010| 00|000000|000010| 00
        const expected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
        expect(lgp30.state.memory.get(asTrack('00'), asSector('00'))).toEqual(expected)
    })

    test("test assemble unconditional jump order to '1000' into location '0000'", () => {
        // check pre-assembly memory
        const zeros: BitArray = new Array(32).fill(0);
        expect(lgp30.state.memory.get(asTrack('00'), asSector('00'))).toEqual(zeros)
        // assemble unconditional jump to '0002' into location '0000'
        assembleLine(lgp30.state.memory, "0000 u1000")
        // check the pattern assembled into memory
        //       ignore|ord |xx| track|sector|xx
        // 000000000000|1010|00|001010|000000|00
        const expected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        expect(lgp30.state.memory.get(asTrack('00'), asSector('00'))).toEqual(expected)
    })



    test('test the example program', () => {
        assembleLine(lgp30.state.memory, '0000 u1000 #Jump to entry')
        // 000000000000|1010|00|001010|000000|00
        expect(lgp30.state.memory.get(asTrack('00'), asSector('00'))).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0])

        assembleLine(lgp30.state.memory, '1000 p0000')
        // 000000000000|1000|00|000000|000000|00
        expect(lgp30.state.memory.get(asTrack('10'), asSector('00'))).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

        assembleLine(lgp30.state.memory, '1001 b1000')
        // 000000000000|0001|00|001010|000000|00
        expect(lgp30.state.memory.get(asTrack('10'), asSector('01'))).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0])

        assembleLine(lgp30.state.memory, '1002 a2005 #Add up 1 to track')
        // 000000000000|1110|00|010100|000101|00
        expect(lgp30.state.memory.get(asTrack('10'), asSector('02'))).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0])



        assembleLine(lgp30.state.memory, '1003 y1000 #Modify p')
        assembleLine(lgp30.state.memory, '1004 b2002 #Sets A to (2002)')
        assembleLine(lgp30.state.memory, '1005 a2001 #Adds (2001) to A')
        assembleLine(lgp30.state.memory, '1006 h2002 #Saves results in (2002)')
        assembleLine(lgp30.state.memory, '1007 s2003 #Subtracts 5 from A')
        assembleLine(lgp30.state.memory, '1008 t1000 #Tests, and jumps to top of loop')
        assembleLine(lgp30.state.memory, '1009 z0000 #Stop')
        assembleLine(lgp30.state.memory, '2001 1 #Counter start')
        // 000000000000|0000|00|000000|000000|01
        // [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0]
        expect(lgp30.state.memory.get(asTrack('20'), asSector('01'))).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])

        assembleLine(lgp30.state.memory, '2003 64 #Counter stop')
        assembleLine(lgp30.state.memory, '2005 256 #Track = 1. This is our incrementer')
    })




    // TODO do the rest
    // test("test assembleLine", () => {
    //     assembleLine(lgp30.state.memory, "0000 u0002")
    //     assembleLine(lgp30.state.memory, "0002 b0001")
    //     assembleLine(lgp30.state.memory, "0003 a0010")
    //     assembleLine(lgp30.state.memory, "0004 h0001")
    //     assembleLine(lgp30.state.memory, "0005 s0009")
    //     assembleLine(lgp30.state.memory, "0006 t0002")
    //     assembleLine(lgp30.state.memory, "0009 5")
    //     assembleLine(lgp30.state.memory, "0010 1")
    // })






})

/**
 * unit test for asm class
 */
import { describe, test, beforeEach, expect } from 'vitest'
import { BitArray, SectorNumber, TrackNumber } from './types'
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
        const track: TrackNumber = '00'
        const sector: SectorNumber = '09'
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
        expect(lgp30.state.memory.get('00', '00')).toEqual(zeros)
        // assemble unconditional jump to '0002' into location '0000'
        assembleLine(lgp30.state.memory, "0000 u 0002")
        // check the pattern assembled into memory
        //       ignore|order|pad| track|sector|pad
        // 000000000000| 1010| 00|000000|000010| 00
        const expected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
        expect(lgp30.state.memory.get('00', '00')).toEqual(expected)
    })

    // TODO do the rest
    // test("test assembleLine", () => {
    //     assembleLine(lgp30.state.memory, "0000 u 0002")
    //     assembleLine(lgp30.state.memory, "0002 b 0001")
    //     assembleLine(lgp30.state.memory, "0003 a 0010")
    //     assembleLine(lgp30.state.memory, "0004 h 0001")
    //     assembleLine(lgp30.state.memory, "0005 s 0009")
    //     assembleLine(lgp30.state.memory, "0006 t 0002")
    //     assembleLine(lgp30.state.memory, "0009 5")
    //     assembleLine(lgp30.state.memory, "0010 1")
    // })
})

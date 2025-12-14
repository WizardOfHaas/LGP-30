/**
 * unit test for asm class
 */
import { describe, test, beforeEach } from 'vitest'
import { assembleLine } from './asm'
import { LGP30 } from "./lgp30"

describe("test the asm module", () => {
    let lgp30: LGP30

    // this is purely access to memory, no other states are affected
    beforeEach(() => {
        lgp30 = new LGP30()
    })


    test("test assemble a single line with order", () => {
        assembleLine(lgp30.state.memory, "0000 u 0002")
console.debug('memory:',        lgp30.state.memory.get('00', '00'))
        // TODO check memory
    })

    test("test assemble a single line with constant", () => {
        // TODO check memory
        assembleLine(lgp30.state.memory, "0009 5")
console.debug('memory:',        lgp30.state.memory.get('00', '09'))
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

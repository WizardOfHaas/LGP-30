import { describe, test } from 'vitest'
import { assembleLine } from './asm'
import { LGP30 } from "./lgp30"
import { State } from "./state"

const displayRegs = (state: State) => {
    console.info('state', state)
}
const displayMem = (state: State) => {
    console.log('mem', state)
}
const displayMode = (state: State) => {
    console.log('mode', state)
}

describe("test asm module", () => {
    test("test assembleLine", () => {

        const lgp30 = new LGP30({
            onStep: () => {
                displayRegs(lgp30.state)
                displayMem(lgp30.state)
                displayMode(lgp30.state)
            },
            onTx: async (b) => {
                console.log('b', b)
                // console.log(b, bitsToChar(b))
                // term.write(bitsToChar(b))
            }
        })

        assembleLine(lgp30.state.memory, "0000 u 0002")
        assembleLine(lgp30.state.memory, "0002 b 0001")
        assembleLine(lgp30.state.memory, "0003 a 0010")
        assembleLine(lgp30.state.memory, "0004 h 0001")
        assembleLine(lgp30.state.memory, "0005 s 0009")
        assembleLine(lgp30.state.memory, "0006 t 0002")
        assembleLine(lgp30.state.memory, "0009 5")
        assembleLine(lgp30.state.memory, "0010 1")
    })
})

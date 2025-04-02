import { assembleLine } from "./asm"
import { Flexowriter } from "./flexo"
import { LGP30 } from "./lgp30"
import { dumpRegs, hexToBin } from "./util"

const lgp30 = new LGP30({
    onTx: async (b) => {
        console.log(b)
    }
})

const flexo = new Flexowriter()

/*
assembleLine(lgp30.state.memory, "0000 u 0002")
assembleLine(lgp30.state.memory, "0002 b 0001")
assembleLine(lgp30.state.memory, "0003 a 0010")
assembleLine(lgp30.state.memory, "0004 h 0001")
assembleLine(lgp30.state.memory, "0005 s 0009")
assembleLine(lgp30.state.memory, "0006 t 0002")

assembleLine(lgp30.state.memory, "0009 5")
assembleLine(lgp30.state.memory, "0010 1")
*/

assembleLine(lgp30.state.memory, "0000 p 0000")
assembleLine(lgp30.state.memory, "0001 i 0000")

lgp30.state.running = true
await lgp30.run()

//lgp30.state.setMode("MANUAL")

"c3200'".split("").forEach(async (c) => {
    await lgp30.rx(flexo.convert(c))
})

//lgp30.fillIns()
//dumpRegs(lgp30.state)
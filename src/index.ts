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

/*
const asm = `0000 p 0000 #Setup input
0001 i 0000 #Kick to input mode
0002 h 1000 #Store A in memory
0003 b 0002 #Put store ins into A
0004 a 0049 #Increment
0005 y 0002 #Update the store instruction
0006 u 0000 #Loop

0049 1 #Inc constant`

asm.split("\n").forEach((l) => {
    assembleLine(lgp30.state.memory, l)
})
*/

await lgp30.run()

//lgp30.state.setMode("MANUAL")

"c3200'".split("").forEach(async (c) => {
    await lgp30.rx(flexo.convert(c))
})

console.log(lgp30.state.memory.get("10", "00"))
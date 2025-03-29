import { assembleLine } from "./asm"
import { LGP30 } from "./lgp30"

const lgp30 = new LGP30()

/*
lgp30.state.memory.set("00", "00", [
    0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 1,
    0, 0,
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 0
])

lgp30.fetchOrder()
lgp30.executeOrder()

console.log(lgp30.state.registers.r.get())
*/

assembleLine(lgp30.state.memory, "0000 b 0000")
console.log(lgp30.state.memory.get("00", "00"))

lgp30.fetchOrder()
lgp30.executeOrder()

console.log(lgp30.state.registers.a.get())
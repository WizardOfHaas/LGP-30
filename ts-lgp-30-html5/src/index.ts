import { Flexowriter } from "./flexo"
import { LGP30 } from "./lgp30"
import { decodeOrder } from "./orders/orderMap"
import { decToBin, dumpRegs, halfToHex } from "./util"

const lgp30 = new LGP30({
    onTx: async (b) => {
        // console.debug(b)
    }
})

const flexo = new Flexowriter({
    onTx: async (b) => {
        return await lgp30.rx(b)
    }
})

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

/**
 * I need to be sure that decode skips bit 31
000c3wl8'000u3w00'
c3wlj'p0000'
c3w20'i0000'
c3w24'0gwc0000'
c3w28'b3wg8'
c3w2j's3w68'
c3w30'u3w58'
c3w34'z0000'
c3w38'u0000'
c3w58't3w34'
c3w5j'h3w24'
c3w60'c3wg8'
c3w64'u3wlj'
c3w68'000wwwwj'
c3wg8'0gwc0000'
u3wlj''
 */

/**
 * 3w06 u 3w00
 * 3w07 p 0000 <--Entry point
 * 3w08 i 0000 #Input
 * 3w09 c 0000 #Clear and store in 00:00
 * 3w0f b 3w2q #Bring `c 0000` into A
 * 3w0g s 3w1f #Subtract `s 3w3w`
 * 3w0j u 3w16 #Jump to test
 * 3w0k z 0000 #STOP. This must be used as a counter?
 * 3w0q u 0000 #Jump to start of memory?
 * 3w16 t 3w0k #Test STOP instruction.
 * 3w17 h 3w09 #Move clear ins into A
 * 3w18 c 3w2q #Save that ins into var after end of prog
 * 3w19 u 3w07 #Jump to entry point
 * 
 * 3w1f s 3w3w
 * 3w2q c 0000
 * 
 * u 3w07 <-- Jump to Entry point
 */

//Load in bootstrap for p104.tx
await manualScript(`000c3wl8'000u3w00'
c3wlj'p0000'
c3w20'i0000'
c3w24'0gwc0000'
c3w28'b3wg8'
c3w2j's3w68'
c3w30'u3w58'
c3w34'z0000'
c3w38'u0000'
c3w58't3w34'
c3w5j'h3w24'
c3w60'c3wg8'
c3w64'u3wlj'
c3w68'000wwwwj'
c3wg8'0gwc0000'
u3wlj''`)

for (let i = 0; i < 63; i++) {
    const sector = halfToHex(decToBin(i, 6))
    // console.debug("3w", sector, decodeOrder(lgp30.state.memory.get("3w", sector)))
}

lgp30.state.mode = "NORMAL"
//await lgp30.run() //THis hangs... but it should bail

//LGP-30 halts and goes to manual input

//Run manual input with COND-STOP
/*"c3200'h1234'".split("").forEach(async (c) => {
    await flexo.tx(c)
})*/

//flexo.loadTape(fs.readFileSync("./p104.tx").toString())
//await flexo.sendTape()

//console.debug(lgp30.state.memory.get("10", "00"))

/**
 * Make this function available to the test suite
 * @param s the script to execute
 */
export async function manualScript(s: string) {
    const insructions = s.split("\n")
    // console.debug(ins)

    lgp30.state.mode = "MANUAL"

    for (const instruction of insructions) {
        const [sto, ord] = instruction.split("'")

        await flexo.tx(sto) //Send over storage part
        // console.debug(sto, '->', decodeOrder(lgp30.state.registers.a.get()))

        lgp30.fillIns() //Setup to run sto

        if (ord && ord.length > 0) { //We have a store order, and an instruction order

            await flexo.tx(ord) //Load in next part
            // console.debug(ord, '->', decodeOrder(lgp30.state.registers.a.get()))
            dumpRegs(lgp30.state)
        }

        await lgp30.step() //Run the instruction
    }
}
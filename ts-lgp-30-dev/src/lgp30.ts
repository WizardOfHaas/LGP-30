import { State } from "./state"
import { orderIdMap } from "./orders/orderMap"
import { binToDec, dumpRegs } from "./util"
import { BitArray } from "./types"
import { charToBits } from "./chars"
import { asTrack, asSector } from "./types/numbers"

type TConfig = {
    onStep?: () => void
    onTx?: (b: BitArray) => void
}

/**
 * Represents an LGP30 computer. Excluding the Flexowriter which is a separate I/O device.
 * @public
 */
export class LGP30 {
    state: State

    config: TConfig

    /**
     * Create and initialise a new instance of an LGP30
     * @param config the object that hooks onStep and onTx methods
     */
    constructor(config?: TConfig) {
        this.state = new State()

        if (typeof config !== "undefined") {
            this.config = config
        } else {
            this.config = {}
        }
    }

    fetchOrder() {
        const track = asTrack(this.state.registers.c.getTrack())
        const sector = asSector(this.state.registers.c.getSector())
        this.state.registers.r.set(this.state.memory.get(track, sector))
    }

    executeOrder() {
        //Extract and compose order bit id
        const orderId = this.state.registers.r.getOrder().join("")
        // const track = this.state.registers.r.getHexTrack()
        // const sector = this.state.registers.r.getHexSector()
        const track = asTrack(this.state.registers.r.getTrack())
        const sector = asSector(this.state.registers.r.getSector())

        if (orderId in orderIdMap) {
            const nextState = orderIdMap[orderId].eval(this.state, track, sector)
            this.state = nextState
            if (typeof this.config.onStep !== "undefined") {
                this.config.onStep()
            }
            // delay(100)
        }
        //Do I have anything in the tx buffer? Then we better send it out!
        while (this.state.txBuffer.length > 0) {
            //It's a FIFO buffer, so grab the first entry
            const txBits = this.state.txBuffer.shift()
            if (txBits) { //Make sure we get a return, since shift is (T | undefined)
                this.tx(txBits) //Handle transmit logic
            }
        }
    }

    step() {
        this.executeOrder() //Execute order in R, transition to new state
        dumpRegs(this.state) //Show it
    }

    run2() {
        if (this.state.running) {
            this.fetchOrder()
            this.step()
            if (this.state.mode === "ONE-OP") {
                this.state.running = false
            }
        }
    }

    run() {
        if (this.state.running == true) {
            return //Break if the machine is already in a running state
        }
        this.state.running = true //Mark us as running
        //Loop until we are kicked from the running state, by either Z or I
        while (this.state.running == true) {
            if (this.state.mode == "NORMAL") {
                this.fetchOrder() //Fetch ins into R
                this.step()
            }
            if (this.state.mode == "ONE-OP") {
                this.fetchOrder()
                this.step()
                this.state.running = false //STOP IT!
            }

            /*if(this.state.mode == "MANUAL"){ //This works... but data has to be pre-buffered
                if(this.state.rxBuffer.length > 0){ //We have buffer to process
                    let b = this.state.rxBuffer.shift() //Get the first entry

                    while(b && binToDec(b) != 32){ //Do until COND-STOP
                        this.state.registers.a.shiftIn(b.slice(0, this.state.inputBits))
                        b = this.state.rxBuffer.shift()
                    }
                }

                this.state.mode = "NORMAL"
            }*/
        }
    }

    fillIns() {
        this.state.registers.r.set(this.state.registers.a.get())
    }

    _rx(b: BitArray) {
        //Check mode
        //If manual: handle manual input to A
        //if(this.state.mode == "MANUAL"){
        this.state.rxBuffer.push(b) //Push into buffer, deal with it later
        //}
    }

    /**
     * I'm going to move the conversion stuff into here
     * It will put the data into the rxBuffer in this.state
     * Then the I 0000 instruction will read from the buffer until it reaches a COND-STOP or the end of the buffer
     *      Will I need to implement something like a loop for waiting?
     */

    rx(b: BitArray): BitArray {
        //Check mode
        //If manual: handle manual input to A
        if (this.state.mode == "MANUAL") {
            if (binToDec(b) == 32) { //Handle COND-STOP. This is the signal to process w/e was just shifted into A
                this.state.setMode("NORMAL") //Go into normal mode
                this.run() //Block and run
                return b
            } else {
                this.state.registers.a.shiftIn(b.slice(0, this.state.inputBits))
                return b
            }
        }

        return [0, 0, 0, 0, 0, 0]
    }

    rxChar(c: string) {
        const b = charToBits(c)
        this.rx(b)
    }

    toRxBuffer(s: string) { //Then I need a hook to process the next block in buffer
        const data = s.split("").map((c) => (charToBits(c)))
        this.state.rxBuffer = this.state.rxBuffer.concat(data)
    }

    //This will rx from buffer until it's empty
    rxFromBuffer() {
        while (this.state.rxBuffer.length > 0) {
            const b = this.state.rxBuffer.shift()
            if (b) {
                const res = this.rx(b)
                if (binToDec(res) == 32) {
                    //break; //I break for COND-STOP
                }
            } else {
                break;
            }
        }
    }

    tx(b: BitArray) {
        if (typeof this.config.onTx !== "undefined") {
            this.config.onTx(b)
        }
    }

    /**
     * Tricky debug/save state stuff
     */

    /**
     * Load memory image into current state
     * @param s string formatted as list of bit arrays
     */
    loadMemoryImage(s: string) {
        s.split("\n").forEach((d) => {
            const [id, val] = d.split(":")
            this.state.memory.data[id] = val.split("").map((n) => (parseInt(n, 2)))
        })
    }

    dumpMemoryImage() {
        const dump: string[] = []
        this.state.memory.data.forEach((d, i) => {
            if (binToDec(d) != 0) {
                dump.push(i + ":" + d.join(""))
            }
        })
        return dump.join("\n")
    }
}
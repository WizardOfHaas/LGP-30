import { State } from "./state"
import { decodeOrder, orderIdMap } from "./orders/orderMap"
import { binToDec, delay, dumpRegs } from "./util"
import { BitArray } from "./types"

type TConfig = {
    onStep?: () => void
    onTx?: (b: BitArray) => Promise<void>
}

export class LGP30{
    state: State
    
    config: TConfig

    constructor(config?: TConfig){
        this.state = new State()

        if(typeof config !== "undefined"){
            this.config = config
        }else{
            this.config = {}
        }
    }

    fetchOrder(){
        this.state.registers.r.set(this.state.memory.get(this.state.registers.c.getHexTrack(), this.state.registers.c.getHexSector()))
    }

    async executeOrder(){
        //Extract and compose order bit id
        const orderId = this.state.registers.r.getOrder().join("")
        const track = this.state.registers.r.getHexTrack()
        const sector = this.state.registers.r.getHexSector()

        if(orderId in orderIdMap){
            const nextState = await orderIdMap[orderId].eval(this.state, track, sector)
            this.state = nextState

            if(typeof this.config.onStep !== "undefined"){
                this.config.onStep()
            }

            await delay(100)
        }
    }

    async step(){
        await this.executeOrder() //Execute order in R, transition to new state

        dumpRegs(this.state) //Show it
    }

    async run(){
        if(this.state.running == true){
            return //Break if the machine is already in a running state
        }

        this.state.running = true //Mark us as running

        //Loop until we are kicked from the running state, by either Z or I
        while(this.state.running == true){
            if(this.state.mode == "NORMAL"){
                this.fetchOrder() //Fetch ins into R

                await this.step()

                //Do I have anything in the tx buffer? Then we better send it out!
                while(this.state.txBuffer.length > 0){
                    //It's a FIFO buffer, so grab the first entry
                    const txBits = this.state.txBuffer.shift()

                    if(txBits){ //Make sure we get a return, since shift is (T | undefined)
                        await this.tx(txBits) //Handle transmit logic
                    }
                }
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

    fillIns(){
        this.state.registers.r.set(this.state.registers.a.get())
    }

    async _rx(b: BitArray){
        //Check mode
        //If manual: handle manual input to A
        //if(this.state.mode == "MANUAL"){
            this.state.rxBuffer.push(b) //Push into buffer, deal with it later
        //}
    }

    async rx(b: BitArray): Promise<BitArray>{
        //Check mode
        //If manual: handle manual input to A
        if(this.state.mode == "MANUAL"){
            if(binToDec(b) == 32){ //Handle COND-STOP. This is the signal to process w/e was just shifted into A
                this.state.setMode("NORMAL") //Go into normal mode
                await this.run() //Block and run
                return b
            }else{
                this.state.registers.a.shiftIn(b.slice(0, this.state.inputBits))
                return b
            }
        }

        return [0, 0, 0, 0, 0, 0]
    }

    async tx(b: BitArray){
        if(typeof this.config.onTx !== "undefined"){
            await this.config.onTx(b)
        }
    }
}
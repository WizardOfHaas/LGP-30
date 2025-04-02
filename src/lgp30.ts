import { State } from "./state"
import { orderIdMap } from "./orders/orderMap"
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

    async run(){
        this.state.running = true

        while(this.state.running == true){
            this.fetchOrder() //Fetch ins into R
            await this.executeOrder() //Execute order in R, transition to new state

            dumpRegs(this.state) //Show it

            //Do I have anything in the tx buffer?
            while(this.state.txBuffer.length > 0){
                const txBits = this.state.txBuffer.shift()

                if(txBits){
                    await this.tx(txBits)
                }
            }
        }
    }

    fillIns(){
        this.state.registers.r.set(this.state.registers.a.get())
    }

    async rx(b: BitArray){
        //Check mode
        //If manual: handle manual input to A
        if(this.state.mode == "MANUAL"){
            if(binToDec(b) == 32){ //Handle COND-STOP
                this.state.setMode("NORMAL")
                await this.run()
            }else{
                this.state.registers.a.shiftIn(b.slice(0, this.state.inputBits))
            }
        }
    }

    async tx(b: BitArray){
        if(typeof this.config.onTx !== "undefined"){
            await this.config.onTx(b)
        }
    }
}
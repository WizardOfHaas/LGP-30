import { State } from "./state"
import { orderIdMap } from "./orders/orderMap"
import { binToDec, dumpRegs } from "./util"
import { BitArray } from "./types"

export class LGP30{
    state: State
    
    constructor(){
        this.state = new State()
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
        }
    }

    async run(){
        while(this.state.running == true){
            this.fetchOrder()
            await this.executeOrder()

            dumpRegs(this.state)
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

    tx(){}
}
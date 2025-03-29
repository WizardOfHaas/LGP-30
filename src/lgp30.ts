import { State } from "./state"
import { orderIdMap } from "./orders/orderMap"

export class LGP30{
    state: State
    
    constructor(){
        this.state = new State()
    }

    fetchOrder(){
        this.state.registers.r.set(this.state.memory.get(this.state.registers.c.getHexTrack(), this.state.registers.c.getHexSector()))
    }

    executeOrder(){
        //Extract and compose order bit id
        const orderId = this.state.registers.r.getOrder().join("")
        const track = this.state.registers.r.getHexTrack()
        const sector = this.state.registers.r.getHexSector()

        console.log(orderId)

        if(orderId in orderIdMap){
            console.log(orderIdMap[orderId].name)
            const nextState = orderIdMap[orderId].eval(this.state, track, sector)
        }
    }

    rx(){}

    tx(){}
}
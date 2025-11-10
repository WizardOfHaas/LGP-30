import type { BitArray, SectorNumber, IState, TrackNumber } from "../types";
import { hexToBin } from "../util";
import { IOrder } from "./order";

//Print: tx(TT)
export class OrderP implements IOrder{
    name = "p"
    orderNumber = [1, 0, 0, 0] as BitArray

    async eval(state: IState, track: TrackNumber, sector: SectorNumber) {
        if(track != "00"){ //Ignore p 0000
            state.txBuffer.push(hexToBin(track, 6))
        }

        state.registers.c.inc()
        return state
    }
}
import type { BitArray, IState } from "../types";
import type { TrackNumber } from "../types/numbers";
import { asTrack, toBits } from "../types/numbers";
import { IOrder } from "./order";

//Print: tx(TT)
export class OrderP implements IOrder {
    name = "p"
    orderNumber = [1, 0, 0, 0] as BitArray

    async eval(state: IState, track: TrackNumber) {
        if (track != asTrack("00")) { //Ignore p 0000
            state.txBuffer.push(toBits(track))
        }
        state.registers.c.inc()
        return state
    }
}
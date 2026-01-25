import type { BitArray, IState } from "../types";
import type { TrackNumber, SectorNumber } from "../types/numbers";
import { asTrack, asSector } from "../types/numbers";
import { IOrder } from "./order";

//Stop
export class OrderZ implements IOrder {
    name = "z"
    orderNumber = [0, 0, 0, 0] as BitArray

    eval(state: IState, track: TrackNumber, sector: SectorNumber) {
        //Breakpoints not currently implemented, so treat breaking-stop as a NOP
        if (track === asTrack('00') && sector === asSector('00')) {
            state.running = false
        }
        state.registers.c.inc()
        return state
    }
}
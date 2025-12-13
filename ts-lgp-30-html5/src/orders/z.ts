import type { BitArray, SectorNumber, IState, TrackNumber } from "../types";
import { IOrder } from "./order";

//Stop
export class OrderZ implements IOrder{
    name = "z"
    orderNumber = [0, 0, 0, 0] as BitArray

    async eval(state: IState, track: TrackNumber, sector: SectorNumber) {
        //Breakpoints not currently implemented, so treat breaking-stop as a NOP
        if(track == "00" && sector == "00"){
            state.running = false
        }

        state.registers.c.inc()

        return state
    }
}
import type { BitArray, SectorNumber, IState, TrackNumber } from "../types";
import { IOrder } from "./order";

//Input: ...please just read the docs...
export class OrderI implements IOrder{
    name = "i"
    orderNumber = [0, 1, 0, 0] as BitArray

    async eval(state: IState, track: TrackNumber, sector: SectorNumber) {
        state.txBuffer.push([0, 0, 0, 0, 0, 0]) //We need to send out the input signal for the flexo
        state.mode = "MANUAL" //Switch to manual mode
        state.running = false //...and stop execution

        state.registers.c.inc()
        return state
    }
}
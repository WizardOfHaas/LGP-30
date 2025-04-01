import type { BitArray, SectorNumber, IState, TrackNumber } from "../types";
import { hexToBin } from "../util";
import { IOrder } from "./order";

//Stop
export class OrderZ implements IOrder{
    name = "z"
    orderNumber = [0, 0, 0, 0] as BitArray

    async eval(state: IState, track: TrackNumber, sector: SectorNumber) {
        state.running = false
        return state
    }
}
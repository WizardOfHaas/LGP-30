import type { BitArray, SectorNumber, IState, TrackNumber } from "../types";
import { IOrder } from "./order";

//Hold and Store: mem[track:sector] = regs.a
export class OrderH implements IOrder{
    name = "h"
    orderNumber = [1, 1, 0, 0] as BitArray

    async eval(state: IState, track: TrackNumber, sector: SectorNumber) {
        state.memory.set(track, sector, state.registers.a.get())
        state.registers.c.inc()
        return state
    }
}
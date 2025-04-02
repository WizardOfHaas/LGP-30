import type { BitArray, SectorNumber, IState, TrackNumber } from "../types";
import { IOrder } from "./order";

//Clear and Store: mem[track:sector] = regs.a, regs.a = 0
export class OrderC implements IOrder{
    name = "c"
    orderNumber = [1, 1, 0, 1] as BitArray

    async eval(state: IState, track: TrackNumber, sector: SectorNumber) {
        state.memory.set(track, sector, state.registers.a.get()) //Set memory
        state.registers.a.clear() //Clear register
        state.registers.c.inc()
        return state
    }
}
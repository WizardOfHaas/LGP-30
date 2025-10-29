import type { BitArray, SectorNumber, IState, TrackNumber } from "../types";
import { IOrder } from "./order";

//Bring: regs.a = mem[track:sector]
export class OrderB implements IOrder{
    name = "b"
    orderNumber = [0, 0, 0, 1] as BitArray

    async eval(state: IState, track: TrackNumber, sector: SectorNumber) {
        state.registers.a.set(state.memory.get(track, sector))
        state.registers.c.inc()
        return state
    }
}
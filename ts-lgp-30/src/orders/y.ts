import type { BitArray, SectorNumber, IState, TrackNumber } from "../types";
import { IOrder } from "./order";

//Set Address Part:  mem[track:sector].addr = regs.a.addr
export class OrderY implements IOrder{
    name = "y"
    orderNumber = [0, 0, 1, 0] as BitArray

    async eval(state: IState, track: TrackNumber, sector: SectorNumber) {
        const addr = state.registers.a.get(18, 31)

        state.memory.set(track, sector, addr, 18)
        
        state.registers.c.inc()
        return state
    }
}
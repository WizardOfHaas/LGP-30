import type { BitArray, SectorNumber, IState, TrackNumber } from "../types";
import { IOrder } from "./order";

//Extract: regs.a &= mem[TTSS]
export class OrderE implements IOrder{
    name = "e"
    orderNumber = [1, 0, 0, 1] as BitArray

    async eval(state: IState, track: TrackNumber, sector: SectorNumber) {
        const arg = state.memory.get(track, sector)
        state.registers.a.set(
            state.registers.a.get().map((v, i) => v * arg[i]) as BitArray
        )

        state.registers.c.inc()
        return state
    }
}
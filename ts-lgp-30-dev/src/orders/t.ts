import type { BitArray, IState } from "../types";
import type { TrackNumber, SectorNumber } from "../types/numbers";
import  { toBits } from "../types/numbers";
import { IOrder } from "./order";

//Test: if regs.a < 0, regs.c = track:sector
export class OrderT implements IOrder {
    name = "t"
    orderNumber = [1, 0, 1, 1] as BitArray

    async eval(state: IState, track: TrackNumber, sector: SectorNumber) {
        const trackBits = toBits(track)
        const sectorBits = toBits(sector)
        if (state.registers.a.get()[0] == 1) { //Test sign bit
            state.registers.c.set(trackBits.concat(sectorBits))
        } else {
            state.registers.c.inc()
        }
        return state
    }
}
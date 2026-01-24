import type { BitArray, IState } from "../types";
import type { TrackNumber, SectorNumber } from "../types/numbers";
import { toBits } from "../types/numbers";
import { IOrder } from "./order";

//Unconditional Jump: regs.c = track:sector
export class OrderU implements IOrder {
    name = "u"
    orderNumber = [1, 0, 1, 0] as BitArray

    async eval(state: IState, track: TrackNumber, sector: SectorNumber) {
        const trackBits = toBits(track)
        const sectorBits = toBits(sector)
        const newBits = trackBits.concat(sectorBits)
        state.registers.c.set(newBits)
        return state
    }
}
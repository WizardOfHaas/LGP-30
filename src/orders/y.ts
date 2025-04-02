import type { BitArray, SectorNumber, IState, TrackNumber } from "../types";
import { hexToBin } from "../util";
import { IOrder } from "./order";

//Store Address: regs.a = mem[track:sector]
export class OrderY implements IOrder{
    name = "y"
    orderNumber = [0, 0, 1, 0] as BitArray

    async eval(state: IState, track: TrackNumber, sector: SectorNumber) {
        const binTrack = hexToBin(track, 6)
        const binSector = hexToBin(sector, 6)

        state.memory.set(track, sector, binTrack.concat(binSector), 18)
        
        state.registers.c.inc()
        return state
    }
}
import type { BitArray, SectorNumber, IState, TrackNumber } from "../types";
import { hexToBin } from "../util";
import { IOrder } from "./order";

//Test: if regs.a < 0, regs.c = track:sector
export class OrderT implements IOrder{
    name = "t"
    orderNumber = [1, 0, 1, 1] as BitArray

    async eval(state: IState, track: TrackNumber, sector: SectorNumber) {
        const binTrack = hexToBin(track, 6)
        const binSector = hexToBin(sector, 6)
        
        if(state.registers.a.get()[0] == 1){ //Test sign bit
            state.registers.c.set(binTrack.concat(binSector))
        }else{
            state.registers.c.inc()
        }

        return state
    }
}
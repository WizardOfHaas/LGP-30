import type { BitArray, SectorNumber, IState, TrackNumber } from "../types";
import { hexToBin } from "../util";
import { IOrder } from "./order";

//Unconditional Jump: regs.c = track:sector
export class OrderU implements IOrder{
    name = "u"
    orderNumber = [1, 0, 1, 0] as BitArray

    eval(state: IState, track: TrackNumber, sector: SectorNumber): IState {
        const binTrack = hexToBin(track, 6)
        const binSector = hexToBin(sector, 6)
        
        state.registers.c.set(binTrack.concat(binSector))
        return state
    }
}
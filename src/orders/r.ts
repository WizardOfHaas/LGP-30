import type { BitArray, SectorNumber, IState, TrackNumber } from "../types";
import { hexToBin } from "../util";
import { IOrder } from "./order";

//Return: regs.c++, mem[track:sector].addrPart = regs.c
export class OrderR implements IOrder{
    name = "r"
    orderNumber = [1, 0, 1, 0] as BitArray

    async eval(state: IState, track: TrackNumber, sector: SectorNumber) {
        const binTrack = hexToBin(track, 6)
        const binSector = hexToBin(sector, 6)

        state.registers.c.inc()
        state.memory.set(track, sector, binTrack.concat(binSector), 18)

        return state
    }
}
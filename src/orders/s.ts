import type { BitArray, SectorNumber, IState, TrackNumber } from "../types";
import { packNum, unpackNum } from "../util";
import { IOrder } from "./order";

//Subtract: regs.a -= mem[track:sector]
export class OrderS implements IOrder{
    name = "s"
    orderNumber = [1, 1, 1, 1] as BitArray

    async eval(state: IState, track: TrackNumber, sector: SectorNumber) {
        state.registers.a.set(this.sub(state.registers.a.get(), state.memory.get(track, sector)))

        state.registers.c.inc()
        return state
    }

    sub(a: BitArray, b: BitArray): BitArray{
        const x = unpackNum(a)
        const y = unpackNum(b)

        return packNum(x - y)
    }
}
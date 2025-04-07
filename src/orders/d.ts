import type { BitArray, SectorNumber, IState, TrackNumber } from "../types";
import { packNum, unpackNum } from "../util";
import { IOrder } from "./order";

//Divide: regs.a = regs.a / mem[track:sector]
export class OrderD implements IOrder{
    name = "d"
    orderNumber = [0, 1, 0, 1] as BitArray

    async eval(state: IState, track: TrackNumber, sector: SectorNumber) {
        state.registers.a.set(this.divide(state.registers.a.get(), state.memory.get(track, sector)))

        state.registers.c.inc()
        return state
    }

    divide(a: BitArray, b: BitArray): BitArray{
        const x = unpackNum(a)
        const y = unpackNum(b)

        return packNum(Math.round(x / y))
    }
}
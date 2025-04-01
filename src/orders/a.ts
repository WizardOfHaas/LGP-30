import type { BitArray, SectorNumber, IState, TrackNumber } from "../types";
import { packNum, unpackNum } from "../util";
import { IOrder } from "./order";

//Add: regs.a += mem[track:sector]
export class OrderA implements IOrder{
    name = "a"
    orderNumber = [1, 1, 1, 0] as BitArray

    async eval(state: IState, track: TrackNumber, sector: SectorNumber) {
        state.registers.a.set(this.add(state.registers.a.get(), state.memory.get(track, sector)))

        state.registers.c.inc()
        return state
    }

    add(a: BitArray, b: BitArray): BitArray{
        const x = unpackNum(a)
        const y = unpackNum(b)

        return packNum(x + y)
    }
}
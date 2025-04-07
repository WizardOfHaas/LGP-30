import type { BitArray, SectorNumber, IState, TrackNumber } from "../types";
import { binToDec, decToBin, packNum, unpackNum } from "../util";
import { IOrder } from "./order";

//Multiply Upper: regs.a = regs.a / mem[track:sector]
export class OrderM implements IOrder{
    name = "m"
    orderNumber = [0, 1, 1, 1] as BitArray

    async eval(state: IState, track: TrackNumber, sector: SectorNumber) {
        state.registers.a.set(this.multiply(state.registers.a.get(), state.memory.get(track, sector)))

        state.registers.c.inc()
        return state
    }

    multiply(a: BitArray, b: BitArray): BitArray{
        const x = unpackNum(a)
        const y = unpackNum(b)

        const res = Math.round(x * y)
        const resBin = decToBin(res, 64)

        return packNum(binToDec(resBin.slice(0, 31)))
    }
}
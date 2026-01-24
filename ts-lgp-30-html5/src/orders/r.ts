import { RegisterC } from "../regs/c";
import type { BitArray, IState } from "../types";
import type { TrackNumber, SectorNumber } from "../types/numbers";
import { IOrder } from "./order";

//Return: regs.c++, mem[track:sector].addrPart = regs.c
export class OrderR implements IOrder {
    name = "r"
    orderNumber = [0, 0, 1, 1] as BitArray

    async eval(state: IState, track: TrackNumber, sector: SectorNumber) {
        //I need to break the ref here...
        const c = new RegisterC()
        c.set(state.registers.c.get())
        //Double-increment, to get address to return to
        c.inc()
        c.inc()
        state.memory.set(track, sector, c.get(), 18)
        state.registers.c.inc()
        return state
    }
}
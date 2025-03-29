import type { Memory } from "./mem/mem"
import type { RegisterA } from "./regs/a"
import type { RegisterC } from "./regs/c"
import type { RegisterR } from "./regs/r"

export type BitArray = Array<1 | 0>
export type HexVal = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "f" | "g" | "j" | "k" | "q" | "w" | "l"
export type TrackNumber = `${HexVal}${HexVal}`
export type SectorNumber = TrackNumber

export interface IState{
    memory: Memory

    registers: {
        a: RegisterA
        r: RegisterR
        c: RegisterC
    }

    running: boolean
}
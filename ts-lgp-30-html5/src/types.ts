import type { Memory } from "./mem/mem"
import type { RegisterA } from "./regs/a"
import type { RegisterC } from "./regs/c"
import type { RegisterR } from "./regs/r"

export type BitArray = Array<1 | 0>
// export type HexVal = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "f" | "g" | "j" | "k" | "q" | "w" | "l"
// export type TrackNumber = `${HexVal}${HexVal}`
// export type SectorNumber = TrackNumber
// export type SixBitNumber = number & { readonly __brand: "SixBitNumber" };
// export type TrackNumber = SixBitNumber & { readonly __brand2: "TrackNumber" };
// export type SectorNumber = SixBitNumber & { readonly __brand2: "SectorNumber" };
export type ExecMode = "NORMAL" | "ONE-OP" | "MANUAL"
export type Char = string & {length: 1}

// export function asSixBit(n: number): SixBitNumber {
//     if (n < 0 || n > 0b111111) {
//         throw new Error("Not a 6‑bit number");
//     }
//     return n as SixBitNumber;
// }

// export function asTrack(n: number): TrackNumber {
//     return asSixBit(n) as TrackNumber;
// }

// export function asSector(n: number): SectorNumber {
//     return asSixBit(n) as SectorNumber;
// }

export interface IState{
    memory: Memory

    registers: {
        a: RegisterA
        r: RegisterR
        c: RegisterC
    }

    running: boolean

    mode: ExecMode

    inputBits: 4 | 6

    txBuffer: Array<BitArray>
    rxBuffer: Array<BitArray>

    setMode(m: ExecMode): void
}
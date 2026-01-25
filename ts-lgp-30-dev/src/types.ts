import type { Memory } from "./mem/mem"
import type { RegisterA } from "./regs/a"
import type { RegisterC } from "./regs/c"
import type { RegisterR } from "./regs/r"

export type BitArray = Array<1 | 0>
export type ExecMode = "NORMAL" | "ONE-OP" | "MANUAL"
export type Char = string & { length: 1 }

export interface IState {
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
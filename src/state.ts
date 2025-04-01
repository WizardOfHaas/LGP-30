import { Memory } from "./mem/mem";
import { RegisterA } from "./regs/a";
import { RegisterC } from "./regs/c";
import { RegisterR } from "./regs/r";
import type { ExecMode, IState } from "./types";

export class State implements IState{
    memory: Memory

    registers: {
        a: RegisterA
        r: RegisterR
        c: RegisterC
    }

    running: boolean

    mode: ExecMode

    inputBits: 4 | 6

    //Initialize state, see ops manual for details
    constructor(){
        this.memory = new Memory()
        
        this.registers = {
            a: new RegisterA(),
            r: new RegisterR(),
            c: new RegisterC()
        }

        this.running = false

        this.mode = "NORMAL"

        this.inputBits = 4
    }

    setMode(m: ExecMode){
        this.mode = m
    }
}
import { Memory } from "./mem/mem";
import { RegisterA } from "./regs/a";
import { RegisterC } from "./regs/c";
import { RegisterR } from "./regs/r";
import type { IState } from "./types";

export class State implements IState{
    memory: Memory

    registers: {
        a: RegisterA
        r: RegisterR
        c: RegisterC
    }

    running: boolean

    constructor(){
        this.memory = new Memory()
        
        this.registers = {
            a: new RegisterA(),
            r: new RegisterR(),
            c: new RegisterC()
        }

        this.running = false
    }

    apply(){}
}
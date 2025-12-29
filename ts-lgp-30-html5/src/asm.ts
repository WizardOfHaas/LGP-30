import { asTrack, asSector, toBits } from "./types/numbers";
import { charToBits } from "./chars";
import { Memory } from "./mem/mem";
import { decToHex, hexToBin } from "./util";

//I want to change this to be more... dumb
//It should just take an address followed by a hexidecimal value to shift into that address
//This will be closer to how LGP-30 programming sheets are laid out

/**
 * Assemble a line of source code into object code and place the result 
 * into the provided memory object.
 * * @remarks
 * The source code line is assembled based on one of the following formats:
 * 1. Opcode format: `TTSS Ord TTSS`
 * 2. Constant format: `TTSS Const`
 * * Where:
 * * `TTSS`: Target Tag and Source Size/Type (addressing mode info).
 * * `Ord`: The instruction mnemonic or opcode.
 * * `Const`: A numerical constant value.
 *
 * @param memory The memory object where the resulting object code will be stored.
 * @param l The line of source code (string) to assemble.
 */
export function assembleLine(memory: Memory, l: string) {
    const assembleCode = (memory: Memory, tokens: string[]) => {
        const track = asTrack(tokens[1])
        const sector = asSector(tokens[2])
        const order = tokens[3]
        const trackArg = asTrack(tokens[4])
        const sectorArg = asSector(tokens[5])
        // make a switch for hex/dec later. For now, hard code to dec
        // const hexTrack = decToHex(track)
        // const hexSector = decToHex(sector)
        //Go char by char, and drop any comments
        //  I need to debug the packing here...
        const orderVal = order.split("").map((c) => { //This DOES   need to do address conversion to avoid tape style packing
            const v = charToBits(c.toLowerCase()).slice(0, 4)
            return v
        }).flat()
        const ins = orderVal
            .concat([0, 0]) //Spacer between order/junk and address args
            .concat(toBits(trackArg)) //Track arg
            .concat(toBits(sectorArg)) //Sector arg
            .concat([0, 0]) //Spacer
        memory.set(track, sector, ins)
    }

    const assembleConstant = (memory: Memory, tokens: string[]) => {
        const track = asTrack(tokens[1])
        const sector = asSector(tokens[2])
        const constant = tokens[3]
        // make a switch for hex/dec later. For now, hard code to dec
        // const hexTrack = decToHex(track)
        // const hexSector = decToHex(sector)
        const hexConstant = decToHex(constant)
        const val = hexToBin(hexConstant, 32)
        memory.set(track, sector, val)
    }
    // empty lines are valid, ignore them.
    if (!l || l.trim().length === 0) {
        return
    }
    const insTokens = [...l.matchAll(/^([0-9fgjkqwl]{2})([0-9fgjkqwl]{2}) ([a-z])([0-9fgjkqwl]{2})([0-9fgjkqwl]{2})/g)]
    const constTokens = [...l.matchAll(/^([0-9fgjkqwl]{2})([0-9fgjkqwl]{2}) ([0-9fgjkqwl]+)/g)]
    //This is an instruction
    if (typeof insTokens[0] !== "undefined" && insTokens[0].length == 6) {
        assembleCode(memory, insTokens[0])
        return
    }
    if (typeof constTokens[0] !== "undefined" && constTokens[0].length == 4) {
        assembleConstant(memory, constTokens[0])
        return
    }
    throw new Error(`Invalid source / tokens while assembling ${l}`)
}

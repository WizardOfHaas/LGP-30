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
        const track = tokens[1]
        const sector = tokens[2]
        const order = tokens[3]
        const trackArg = tokens[4]
        const sectorArg = tokens[5]
        // make a switch for hex/dec later. For now, hard code to dec
        const hexTrack = decToHex(track)
        const hexSector = decToHex(sector)
        const hexTrackArg = decToHex(trackArg)
        const hexSectorArg = decToHex(sectorArg)
        //Go char by char, and drop any comments
        //  I need to debug the packing here...
        const orderVal = order.split("").map((c) => { //This DOES   need to do address conversion to avoid tape style packing
            const v = charToBits(c.toLowerCase()).slice(0, 4)
            return v
        }).flat()
        const ins = orderVal
            .concat([0, 0]) //Spacer between order/junk and address args
            .concat(hexToBin(hexTrackArg, 6)) //Track arg
            .concat(hexToBin(hexSectorArg, 6)) //Sector arg
            .concat([0, 0]) //Spacer
        memory.set(hexTrack, hexSector, ins)
    }

    const assembleConstant = (memory: Memory, tokens: string[]) => {
        const track = tokens[1]
        const sector = tokens[2]
        const constant = tokens[3]
        // make a switch for hex/dec later. For now, hard code to dec
        const hexTrack = decToHex(track)
        const hexSector = decToHex(sector)
        const hexConstant = decToHex(constant)
        const val = hexToBin(hexConstant, 32)
        memory.set(hexTrack, hexSector, val)
    }

    // empty lines are valid, ignore them.
    if (!l || l.trim().length === 0){
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

// export function _assembleLine(memory: Memory, l) {
//     const parts = l.split(" ") //Break into parts

//     if (parts.length < 2) {
//         return
//     }

//     const track = parts[0].substring(0, 2)
//     const sector = parts[0].substring(2, 4)

//     if (parts[1] in orderNameMap && parts.length > 2) { //This is an order

//         //This part is interpreted wring(IE: 10 -> 0f instead of 10)
//         const trackArg = hexToBin(parts[2].substring(0, 2), 6)
//         const sectorArg = hexToBin(parts[2].substring(2, 4), 6)

//         //console.debug(trackArg, sectorArg)

//         const ins = orderNameMap[parts[1]].orderNumber
//             .concat([0, 0])     //Spacer
//             .concat(trackArg)   //Trac
//             .concat(sectorArg)  //Sector
//             .concat([0, 0])     //Spacer
//         memory.set(track, sector, ins)
//     } else if (track != "" && sector != "") { //This is a constant
//         const chars = parts[1].split("")
//         if (chars[0] == "b") {
//             chars.shift()
//             memory.set(track, sector, chars)
//         } else {
//             const w = hexToBin(parts[1], 31)

//             memory.set(track, sector, w)
//         }
//     }
// }
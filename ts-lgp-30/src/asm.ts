import { charToBits } from "./chars";
import { Memory } from "./mem/mem";
import { orderNameMap } from "./orders/orderMap";
import { decToBin, decToHex, hexToBin } from "./util";

/**
 * Assembles code in the format:
 *  TTSS Ord TTSS
 *  TTSS Const
 * 
 * Places results into memory class provided
 */

//I want to change this to be more... dumb
//It should just take an address followed by a hexidecimal value to shift into that address
//This will be closer to how LGP-30 programming sheets are laid out

export function assembleLine(memory: Memory, l){
    const insTokens = [...l.matchAll(/^([0-9fgjkqwl]{2})([0-9fgjkqwl]{2}) ([a-z]+)([0-9fgjkqwl]{2})([0-9fgjkqwl]{2})/g)]
    const constTokens = [...l.matchAll(/^([0-9fgjkqwl]{2})([0-9fgjkqwl]{2}) ([0-9fgjkqwl]+)/g)]

    //This is an instruction
    if(typeof insTokens[0] !== "undefined" && insTokens[0].length == 6){
        let [line, track, sector, order, trackArg, sectorArg] = insTokens[0]

        if(true){ //make a switch for hex/dec later. For now, hard code to dec
            track = decToHex(track)
            sector = decToHex(sector)
            trackArg = decToHex(trackArg)
            sectorArg = decToHex(sectorArg)
        }

        //Go char by char, and drop any comments
        //  I need to debug the packing here...
        const orderVal = order.split("").map((c) => { //This DOES   need to do address conversion to avoid tape style packing
            const v = charToBits(c.toLowerCase()).slice(0, 4)
            return v
        }).flat()

        const ins = orderVal
            .concat([0, 0]) //Spacer between order/junk and address args
            .concat(hexToBin(trackArg, 6)) //Track arg
            .concat(hexToBin(sectorArg, 6)) //Sector arg
            .concat([0, 0]) //Spacer

        memory.set(track, sector, ins)
    }else if(typeof constTokens[0] !== "undefined" && constTokens[0].length == 4){
        let [line, track, sector, constant] = constTokens[0]

        if(true){ //make a switch for hex/dec later. For now, hard code to dec
            track = decToHex(track)
            sector = decToHex(sector)
            constant = decToHex(constant)
        }

        const val = hexToBin(constant, 32)

        console.log(constant, val)

        memory.set(track, sector, val)
    }
}

export function _assembleLine(memory: Memory, l){
    const parts = l.split(" ") //Break into parts

    if(parts.length < 2){
        return
    }

    const track = parts[0].substring(0, 2)
    const sector = parts[0].substring(2, 4)

    if(parts[1] in orderNameMap && parts.length > 2){ //This is an order

        //This part is interpreted wring(IE: 10 -> 0f instead of 10)
        const trackArg = hexToBin(parts[2].substring(0, 2), 6)
        const sectorArg = hexToBin(parts[2].substring(2, 4), 6)

        //console.log(trackArg, sectorArg)

        const ins = orderNameMap[parts[1]].orderNumber
            .concat([0, 0])     //Spacer
            .concat(trackArg)   //Trac
            .concat(sectorArg)  //Sector
            .concat([0, 0])     //Spacer
        memory.set(track, sector, ins)
    }else if(track != "" && sector != ""){ //This is a constant
        const chars = parts[1].split("")
        if(chars[0] == "b"){
            chars.shift()
            memory.set(track, sector, chars)
        }else{
            const w = hexToBin(parts[1], 31)
            
            memory.set(track, sector, w)
        }
    }
}
import { Memory } from "./mem/mem";
import { orderNameMap } from "./orders/orderMap";
import { hexToBin } from "./util";

/**
 * Assembles code in the format:
 *  TTSS Ord TTSS
 *  TTSS Const
 * 
 * Places results into memory class provided
 */

export function assembleLine(memory: Memory, l){
    const parts = l.split(" ") //Break into parts

    if(parts.length < 2){
        return
    }

    const track = parts[0].substring(0, 2)
    const sector = parts[0].substring(2, 4)

    if(parts[1] in orderNameMap){ //This is an order
        const trackArg = hexToBin(parts[2].substring(0, 2), 6)
        const sectorArg = hexToBin(parts[2].substring(2, 4), 6)

        const ins = orderNameMap[parts[1]].orderNumber
            .concat([0, 0])     //Spacer
            .concat(trackArg)   //Trac
            .concat(sectorArg)  //Sector
            .concat([0, 0])     //Spacer
        memory.set(track, sector, ins)
    }else{ //This is a constant
        //Decode as 4-bit hex
        const w = parts[1].split("").map((h) => {
            return hexToBin(h, 4)
        }).flat()//.concat([0, 0]) //Add spacer?

        memory.set(track, sector, w)
    }
}
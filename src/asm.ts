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

    const track = parts[0].substring(0, 2)
    const sector = parts[0].substring(2, 4)

    if(parts[1] in orderNameMap){
        const trackArg = hexToBin(parts[2].substring(0, 2), 6)
        const sectorArg = hexToBin(parts[2].substring(2, 4), 6)

        const ins = orderNameMap[parts[1]].orderNumber
            .concat([0, 0])     //Spacer
            .concat(trackArg)   //Trac
            .concat(sectorArg)  //Sector
            .concat([0, 0])     //Spacer
        memory.set(track, sector, ins)
    }
}
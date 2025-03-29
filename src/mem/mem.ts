import type { BitArray, TrackNumber, SectorNumber } from "../types"
import { binToDec, hexToDec } from "../util"

/**
 * Memory emulation class
 *  Internally data is stored as a big array
 *  Access is exposed in terms of track and sector numbers, not integer addresses
 */

export class Memory{
    data: Array<BitArray>
    locations : number = 6363 //Wastes space, but makes TTSS addressing easier

    constructor(){
        //Initiate memory
        this.data = Array(6363).fill(
            Array(32).fill(0)
        )
    }

    get(track: TrackNumber, sector: SectorNumber, start = 0, end = 32){
        const i = this.composeIndex(track, sector)
        
        return this.data[i].slice(start, end)
    }

    set(track: TrackNumber, sector: SectorNumber, val: BitArray, start = 0){
        const i = this.composeIndex(track, sector)

        this.data[i].splice(32 - val.length, val.length, ...val)
    }

    composeIndex(track: TrackNumber, sector: SectorNumber): number{
        return parseInt(hexToDec(track) + "" + (hexToDec(sector) < 10 ? "0" + hexToDec(sector) : hexToDec(sector)))
    }
}
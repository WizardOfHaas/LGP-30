import type { BitArray } from "../types";
import type { TrackNumber, SectorNumber } from "../types/numbers";
import { hexToDec } from "../util"

/**
 * Memory emulation class
 *  Internally data is stored as a big array
 *  Access is exposed in terms of track and sector numbers, not integer addresses
 */
export class Memory {

    /**
     * The internal array representing the memory storage.
     */
    data: Array<BitArray>

    /**
     * The internal size of the memory.
     * @private
     */
    private locations: number = 6363 //Wastes space, but makes TTSS addressing easier

    /**
     * Construct and initialise an instance of Memory
     */
    constructor() {
        //Initiate memory
        this.clear()
    }

    /**
     * Clear the memory back to all 0
     */
    clear() {
        this.data = Array(this.locations).fill(Array(32).fill(0))
    }

    /**
     * Get the memory at a specific track and sector
     * @param track The track number, expected as a hexadecimal string (TrackNumber).
     * @param sector The sector number, expected as a hexadecimal string (SectorNumber).
     * @param start 
     * @param end 
     * @returns 
     */
    get(track: TrackNumber, sector: SectorNumber, start = 0, end = 32): BitArray {
        const i = this.composeIndex(track, sector)
        return this.data[i].slice(start, end)
    }

    /**
     * Store data at a specific track and sector
     * @param track The track number, expected as a hexadecimal string (TrackNumber).
     * @param sector The sector number, expected as a hexadecimal string (SectorNumber).
     * @param val The value to store
     * @param start 
     */
    set(track: TrackNumber, sector: SectorNumber, val: BitArray, start?: number) {
        const i = this.composeIndex(track, sector)
        //I need to do the copy thing here
        const w = this.data[i].slice()
        w.splice(typeof start !== "undefined" ? start : 32 - val.length, val.length, ...val)
        this.data[i] = w
    }

    /**
     * Calculate a location in memory for a specfic track and sector
     * @param track The track number, expected as a hexadecimal string (TrackNumber).
     * @param sector The sector number, expected as a hexadecimal string (SectorNumber).
     * @returns The composed linear index as a numerical value (number).
     */
    private composeIndex(track: TrackNumber, sector: SectorNumber): number {
        return track * 100 + sector

        //        return parseInt(hexToDec(track) + "" + (hexToDec(sector) < 10 ? "0" + hexToDec(sector) : hexToDec(sector)))
    }
}
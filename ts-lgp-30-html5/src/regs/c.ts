import { halfToHex, hexToDec } from "../util"
import { Register } from "./register"
import type { BitArray } from "../types"
import { asSector, asTrack, toBits } from "../types/numbers"

export class RegisterC extends Register {
    constructor() {
        super(12)
    }

    inc() {
        //Increment, respectinv TTSS addressing
        let track = asTrack(this.getTrack())
        let sector = asSector(this.getSector())
        sector++
        if (sector > 63) {
            sector = asSector(0)
            track++
        }
        // TODO what happens if track > 63?
        const trackBits = toBits(track)
        const sectorBits = toBits(sector)
        const newBits = trackBits.concat(sectorBits)
        this.data = newBits
    }

    getTrack(): BitArray {
        return this.get(0, 6)
    }

    getSector(): BitArray {
        return this.get(6, 13)
    }

    getHexTrack() {
        return halfToHex(this.data.slice(0, 6))
    }

    getHexSector() {
        return halfToHex(this.data.slice(6, 13))
    }

    toDec() {
        // const track = hexToDec(this.getHexTrack())
        // const sector = hexToDec(this.getHexSector())
        // return parseInt(track.toString() + (sector < 10 ? "0" : "") + sector.toString())
    return asTrack(this.getTrack()) * 64 + asSector(this.getSector())
    }
}

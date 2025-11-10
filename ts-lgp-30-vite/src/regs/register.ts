/**
 * Register - abstract class for bit registers
 */

import type { BitArray, HexVal } from "../types"
import { halfToHex } from "../util"

export abstract class Register{
	bits: number
	data: BitArray

	constructor(bits){
		this.bits = bits
		this.data = new Array<1 | 0>(this.bits).fill(0)
	}

	get(start = 0, end = 0){
		if(end == 0){
			end = this.bits
		}

		return this.data.slice(start, end)
	}

	set(val: BitArray){
		this.data = val
	}

	clear(){
		this.data = new Array<1 | 0>(this.bits).fill(0)
	}

	getOrder(){
        return this.get(12, 16)
    }

    getTrack(){
        return this.get(18, 24)
    }

    getSector(){
        return this.get(24, 30)
    }

	getHexTrack(){
		return halfToHex(this.getTrack())
	}

	getHexSector(){
		return halfToHex(this.getSector())
	}
}

/**
 * Register - abstract class for bit registers
 */

import type { BitArray, HexVal } from "../types"

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
}

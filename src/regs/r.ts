import { halfToHex } from "../util"
import { Register} from "./register"

/**
 * Instruction Register class
 */
export class RegisterR extends Register{
	bits = 32
	constructor(){
		super(32)
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

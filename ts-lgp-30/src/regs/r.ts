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
}

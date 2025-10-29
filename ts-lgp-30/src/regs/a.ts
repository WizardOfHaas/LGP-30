import { BitArray } from "../types"
import { insertArrayAt } from "../util"
import { Register} from "./register"

export class RegisterA extends Register{
	constructor(){
		super(32)
	}

	shiftIn(b: BitArray){
        this.data = this.data.concat(this.data.splice(0, b.length))
        this.data = insertArrayAt(this.data, this.data.length - b.length, b)
	}
}

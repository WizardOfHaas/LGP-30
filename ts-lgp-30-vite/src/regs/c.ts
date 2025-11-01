import { binToDec, halfToHex, decToBin, hexToDec } from "../util"
import { Register} from "./register"

export class RegisterC extends Register{
	constructor(){
		super(12)
	}

	inc(){
		//Increment, respectinv TTSS addressing
		var track = binToDec(this.data.slice(0, 6))
        var sector = binToDec(this.data.slice(6, 13))

        sector++

        if(sector > 63){
            sector = 0
            track++
        }

        this.data = decToBin(track, 6).concat(decToBin(sector, 6))
	}

    getHexTrack(){
        return halfToHex(this.data.slice(0, 6))
    }

    getHexSector(){
        return halfToHex(this.data.slice(6, 13))
    }

    toDec(){
        const track = hexToDec(this.getHexTrack())
        const sector = hexToDec(this.getHexSector())

        return parseInt(track.toString() + (sector < 10 ? "0" : "") + sector.toString())
    }
}

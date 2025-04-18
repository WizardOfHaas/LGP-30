import { BitArray } from "./types"
import { binToDec } from "./util"

type TConfig = {
    onTx?: (b: BitArray) => Promise<BitArray>
    onRx?: () => Promise<void>
}

export class Flexowriter{
    codeToChar = [ //Thanks SIMH!
        -1  , 'z', '0', ' ', '>', 'b', '1', '-',
        '<' , 'y', '2', '+', '|', 'r', '3', ';',
        '\r', 'i', '4', '/','\\', 'd', '5', '.',
        '\t', 'n', '6', ',', -1 , 'm', '7', 'v',
        '\'', 'p', '8', 'o', -1 , 'e', '9', 'x',
        -1  , 'u', 'f', -1 , -1 , 't', 'g', -1 ,
        -1  , 'h', 'j', -1 , -1 , 'c', 'k', -1 ,
        -1  , 'a', 'q', -1 , -1 , 's', 'w', 0  ,

        -1  , 'Z', ')', ' ', -1 , 'B', 'L', '_',
        -1  , 'Y', '*', '=', '|', 'R', '"', ':',
        '\r', 'I', '^', '?','\\', 'D', '%', ']',
        '\t', 'N', '$', '[', -1 , 'M', '~', 'V',
        '\'', 'P', '#', 'O', -1 , 'E', '(', 'X',
        -1  , 'U', 'F', -1 , -1 , 'T', 'G', -1 ,
        -1  , 'H', 'J', -1 , -1 , 'C', 'K', -1 ,
        -1  , 'A', 'Q', -1 , -1 , 'S', 'W', 0
    ]

    charMapLC = {
        //Numerical
        "0": [0, 0, 0, 0, 1, 0],
        "l": [0, 0, 0, 1, 1, 0],
        "1": [0, 0, 0, 1, 1, 0], //Patch for 1 == l
        "2": [0, 0, 1, 0, 1, 0],
        "3": [0, 0, 1, 1, 1, 0],
        "4": [0, 1, 0, 0, 1, 0],
        "5": [0, 1, 0, 1, 1, 0],
        "6": [0, 1, 1, 0, 1, 0],
        "7": [0, 1, 1, 1, 1, 0],
        "8": [1, 0, 0, 0, 1, 0],
        "9": [1, 0, 0, 1, 1, 0],
        "f": [1, 0, 1, 0, 1, 0],
        "g": [1, 0, 1, 1, 1, 0],
        "j": [1, 1, 0, 0, 1, 0],
        "k": [1, 1, 0, 1, 1, 0],
        "q": [1, 1, 1, 0, 1, 0],
        "w": [1, 1, 1, 1, 1, 0],

        //Commands
        "z": [0, 0, 0, 0, 0, 1],
        "b": [0, 0, 0, 1, 0, 1],
        "y": [0, 0, 1, 0, 0, 1],
        "r": [0, 0, 1, 1, 0, 1],
        "i": [0, 1, 0, 0, 0, 1],
        "d": [0, 1, 0, 1, 0, 1],
        "n": [0, 1, 1, 0, 0, 1],
        "m": [0, 1, 1, 1, 0, 1],
        "p": [1, 0, 0, 0, 0, 1],
        "e": [1, 0, 0, 1, 0, 1],
        "u": [1, 0, 1, 0, 0, 1],
        "t": [1, 0, 1, 1, 0, 1],
        "h": [1, 1, 0, 0, 0, 1],
        "c": [1, 1, 0, 1, 0, 1],
        "a": [1, 1, 1, 0, 0, 1],
        "s": [1, 1, 1, 1, 0, 1],

        //Controls
        "'": [1, 0, 0, 0, 0, 0],
        " ": [0, 0, 0, 0, 1, 1],

        //The rest
        ";": [0, 0, 1, 1, 1, 1],
        "/": [0, 1, 0, 0, 1, 1],
        ".": [0, 1, 0, 1, 1, 1],
        "v": [0, 1, 1, 1, 1, 1],
        "o": [1, 0, 0, 0, 1, 1],
        "x": [1, 0, 0, 1, 1, 1]
    }

    config: TConfig

    tapeBuffer: string[]
    tapeRunning: boolean

    constructor(config?: TConfig){
        if(typeof config !== "undefined"){
            this.config = config
        }else{
            this.config = {}
        }

        this.tapeBuffer = []
        this.tapeRunning = false
    }

    convert(c: string){
        if(c in this.charMapLC){
            console.log("FLEXO:", c, this.charMapLC[c])
            return this.charMapLC[c]
        }else{
            return [0, 0, 0, 0, 0, 0]
        }
    }

    //Send a character(to LGP-30)
    async tx(s: string){
        s.split("").forEach(async (c) => {
            const bits = this.convert(c)

            if(typeof this.config.onTx !== "undefined"){
                await this.config.onTx(bits)
            }
        })
    }

    //Recieve a character(from LGP-30)
    async rx(b: BitArray){
        console.log("FLEXO", b)

        if(binToDec(b) == 0){ //i 0000
            await this.sendTape()
        }
    }

    async sendTape(){
        //This needs to send out until COND-STOP, then terminate and send run signal to LGP-30
        /*while(this.tapeBuffer.length > 0){
            const c = this.tapeBuffer.shift()

            if(c){
                await this.tx(c)
            }
        }*/

        const n = this.tapeBuffer.findIndex((d) => (d == "'")) //Find next COND-STOP
        
        if(n){
            //Slice it off
            //Send it
        }
    }

    loadTape(t: string){
        this.tapeBuffer = this.tapeBuffer.concat(t.split(""))
    }
}
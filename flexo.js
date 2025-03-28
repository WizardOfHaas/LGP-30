class Flexo{
    constructor(config){
        this.config = config

        this.tapeBuffer = []

        this.codeToChar = [ //Thanks SIMH!
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

        this.charMapUC = {
            ")": [0, 0, 0, 0, 1, 0]
        }        

        this.charMapLC = {
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

        this.term = new Terminal({cols: 40});
        this.term.open(document.getElementById(this.config.target))

        this.term.onKey(async (d) => {
            await this.keybdIn(d.key)
        })
    }

    async print(code){
        console.log(code)
        
        const char = this.codeToChar[code]
        this.term.write(char)

        if(code == 0){
            console.log("START READ")
            await this.sendTapeBuffer()
        }
    }

    async keybdIn(code){
        this.term.write(code)

        if(Object.hasOwn(this.charMapLC, code)){
            const bits = this.charMapLC[code]

            if(this.sendToTarget != undefined){
                await this.sendToTarget(bits)
            }
        }
    }

    connectOutput(targetCb){
        this.sendToTarget = targetCb
    }

    tapeIn(tape){
        //console.log(tape)

        this.tapeBuffer = tape.split("")

        //this.sendTapeBuffer() //Start the process?
    }

    async sendTapeBuffer(){
        if(this.tapeBuffer.length > 0){
            console.log(this.tapeBuffer.length)
            let c = this.tapeBuffer.shift()

            while(c != "'"){ //Do it until we get a COND-STOP
                await this.keybdIn(c) //Press the "key" on the "keyboard"
                c = this.tapeBuffer.shift() //Shift out the next char
            }

            if(c == "'"){ //This is janky, but idk if I want a do/while
                await this.keybdIn(c)
            }
        }
    }
    
    punch(code){

    }

    hexToDec(h){
        if(Number(h) || h == 0){
            return Number(h)
        }

        const chars = {"f": 10, "g": 11, "j": 12, "k": 13, "q": 14, "w": 15}

        return chars[h]
    }

    hexToBin(h, n = 4){
        const dec = this.hexToDec(h)
        return this.decToBin(dec, n)
    }

    decToBin(d, n = 6){
        const bits = d.toString(2).split("").map(Number)

        if(n == undefined){
            return bits
        }

        if(n > bits.length){
            return Array(n - bits.length).fill(0).concat(bits)
        }else{
            return bits//.slice(0, n)
        }
    }
}
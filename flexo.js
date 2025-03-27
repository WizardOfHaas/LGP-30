class Flexo{
    constructor(config){
        this.config = config

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

        this.charTo6Bit = {}
        this.charTo4Bit = {}


        this.codeToChar.forEach((c, i )=> {
            if(c != -1){
                this.charTo6Bit[c] = this.decToBin(i, 6)
                this.charTo4Bit[c] = this.decToBin(i, 6).slice(0, 4)
            }
        })

        this.term = new Terminal({cols: 40});
        this.term.open(document.getElementById(this.config.target))

        this.term.onKey((d) => {
            this.keybdIn(d.key)
        })
    }

    print(code){
        const char = this.codeToChar[code]
        this.term.write(char)
    }

    keybdIn(code){
        console.log(code)

        if(Object.hasOwn(this.charTo4Bit, code)){
            console.log(this.charTo4Bit[code])
        }
    }

    tapeIn(code){

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

    decToBin(d, n){
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
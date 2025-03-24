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

        this.term = new Terminal({cols: 40});
        this.term.open(document.getElementById(this.config.target));
    }

    print(code){
        const char = this.codeToChar[code]
        this.term.write(char)
    }

}
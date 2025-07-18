import { BitArray } from "./types"
import { binToDec } from "./util"

const codeToChar = [ //Thanks SIMH!
    -1  , 'z', '0', ' ', '>', 'b', 'l', '-',
    '<' , 'y', '2', '+', '|', 'r', '3', ';',
    '\r\n', 'i', '4', '/','\\', 'd', '5', '.',
    '\t', 'n', '6', ',', -1 , 'm', '7', 'v',
    '\'', 'p', '8', 'o', -1 , 'e', '9', 'x',
    -1  , 'u', 'f', -1 , -1 , 't', 'g', -1 ,
    -1  , 'h', 'j', -1 , -1 , 'c', 'k', -1 ,
    -1  , 'a', 'q', -1 , -1 , 's', 'w', 0  ,

    -1  , 'Z', ')', ' ', -1 , 'B', 'L', '_',
    -1  , 'Y', '*', '=', '|', 'R', '"', ':',
    '\r\n', 'I', '^', '?','\\', 'D', '%', ']',
    '\t', 'N', '$', '[', -1 , 'M', '~', 'V',
    '\'', 'P', '#', 'O', -1 , 'E', '(', 'X',
    -1  , 'U', 'F', -1 , -1 , 'T', 'G', -1 ,
    -1  , 'H', 'J', -1 , -1 , 'C', 'K', -1 ,
    -1  , 'A', 'Q', -1 , -1 , 'S', 'W', 0
]

const codeMapLC = [
    null,
    "z",
    "0",
    " ",
    null,
    "b",
    "l",
    null,
    null,
    "y",
    "2",
    null,
    null,
    "r",
    "3",
    ";",
    null,
    "i",
    "4",
    "/",
    null,
    "d",
    "5",
    ".",
    null,
    "n",
    "6",
    null,
    null,
    "m",
    "7",
    "v",
    "'",
    "p",
    "8",
    "o",
    null,
    "e",
    "9",
    "x",
    null,
    "u",
    "f",
    null,
    null,
    "t",
    "g",
    null,
    null,
    "h",
    "j",
    null,
    null,
    "c",
    "k",
    null,
    null,
    "a",
    "q",
    null,
    null,
    "s",
    "w"
]

export const charMapLC = {
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

export function charToBits(c: string){
    if(c in charMapLC){
        //console.log(c, charMapLC[c])
        return charMapLC[c]
    }else{
        return [0, 0, 0, 0, 0, 0]
    }
}

export function bitsToChar(b: BitArray){
    const code = binToDec(b)
    
    if(typeof codeMapLC[code] !== "undefined" && codeMapLC[code] != null){
        return codeMapLC[code]
    }

    return ""
}
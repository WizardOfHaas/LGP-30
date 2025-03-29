/**
 * Number encoding/decoding stuff
 */
export function binToDec(b){
    return parseInt(b.join(""), 2);
}

export function decToBin(d, n){
    const bits = d.toString(2).split("").map(Number)

    if(n == undefined){
        return bits
    }

    return Array(n - bits.length).fill(0).concat(bits)
}

export function hexToDec(h){
    if(Number(h) || h == 0){
        return Number(h)
    }

    const chars = {"f": "a", "g": "b", "j": "c", "k": "d", "q": "e", "w": "f", "l": "1"}

    const realHex = h.split("").map((c) => (Object.hasOwn(chars, c) ? chars[c] : c)).join("")

    return parseInt(realHex, 16)
}

export function toLGPHex(s){
    const chars = {"a": "f", "b": "g", "c": "j", "d": "k", "e": "q", "f": "w"}

    const lgpHex = s.split("").map((c) => (Object.hasOwn(chars, c) ? chars[c] : c)).join("")

    return lgpHex
}

export function hexToBin(h, n = 4){
    const dec = hexToDec(h)
    return decToBin(dec, n)
}

export function binToHex(b){
    const d = parseInt(b.join(""), 2).toString(16).toLowerCase()
    return toLGPHex(d)
}

export function halfToHex(b){
    const upper = b.slice(0, 2)
    const lower = b.slice(2, 6)

    return binToHex(upper) + binToHex(lower)
}

export function isHex(c){
    return c == 0 || Number(c)|| ["f", "g", "j", "k", "q", "w", "l"].includes(c)
}
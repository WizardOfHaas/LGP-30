// numbers.ts
import { BitArray } from "types";

export type SixBitNumber = number & { readonly __brand: "SixBitNumber" };
export type TrackNumber = SixBitNumber & { readonly __brand2: "TrackNumber" };
export type SectorNumber = SixBitNumber & { readonly __brand2: "SectorNumber" };

// Overload signatures
export function asSixBit(n: number): SixBitNumber;
export function asSixBit(str: string): SixBitNumber;
export function asSixBit(bits: BitArray): SixBitNumber;

// Implementation
export function asSixBit(n: number | string | BitArray): SixBitNumber {
    if (typeof n === 'object' && Array.isArray(n)) {
        // convert 6 bits → number
        let value = 0;
        for (const bit of n) {
            value = (value << 1) | bit;
        }
        return asSixBit(value);
    }
    if (typeof n === "string") {
        // convert flexidecimal string → number
        // const value = parseFlexi(n) // parseInt(n, 16);
        const value = parseInt(n) // parseInt(n, 16);

        return asSixBit(value); // validate here
    }
    // n will only ever be 6 bits
    return (n & 0b111111) as SixBitNumber;
}

// Overload signatures
export function asTrack(n: number): TrackNumber;
export function asTrack(str: string): TrackNumber;
export function asTrack(bits: BitArray): TrackNumber;

// Implementation
export function asTrack(n: number | string | BitArray): TrackNumber {
    if (typeof n === 'object' && Array.isArray(n)) {
        return asSixBit(n) as TrackNumber;
    }
    // flexidecimal string
    if (typeof n === 'string') {
        return asSixBit(n) as TrackNumber;
    }
    // number
    return asSixBit(n) as TrackNumber;
}

// Overload signatures
export function asSector(n: number): SectorNumber;
export function asSector(str: string): SectorNumber;
export function asSector(bits: BitArray): SectorNumber;

// Implementation
export function asSector(n: number | string | BitArray): SectorNumber {
    if (typeof n === 'object' && Array.isArray(n)) {
        return asSixBit(n) as SectorNumber;
    }
    // flexidecimal string
    if (typeof n === 'string') {
        return asSixBit(n) as SectorNumber;
    }
    // number
    return asSixBit(n) as SectorNumber;
}

export type Bit = 0 | 1;
export type SixBits = [Bit, Bit, Bit, Bit, Bit, Bit];

export function toBits(n: SixBitNumber): SixBits {
    const bin = toBinary(n);
    return bin.split("").map(b => (b === "1" ? 1 : 0)) as SixBits;
}

export function toBinary(n: SixBitNumber): string {
    return n.toString(2).padStart(6, "0");
}

const flexiMap: Record<string, number> = { f: 10, g: 11, j: 12, k: 13, q: 14, w: 15, };

function decodeFlexiDigit(ch: string): number {
    const lower = ch.toLowerCase();
    if (lower >= "0" && lower <= "9") {
        return lower.charCodeAt(0) - 48; // '0' → 0
    }
    if (lower in flexiMap) {
        return flexiMap[lower];
    }
    throw new Error(`Invalid flexidecimal digit: ${ch}`);
}

function parseFlexi(n: string): number {
    let value = 0;
    for (const ch of n) {
        const digit = decodeFlexiDigit(ch);
        value = (value << 4) | digit; // base‑16 shift
    }
    return value;
}

// export function sixBitFromBits(bits: BitArray): SixBitNumber {
//     // Convert 6 bits → number
//     let value = 0;
//     for (const bit of bits) {
//         value = (value << 1) | bit;
//     }

//     return asSixBit(value);
// }

// numbers.ts
import { BitArray } from "types";

export type SixBitNumber = number & { readonly __brand: "SixBitNumber" };
export type TrackNumber = SixBitNumber & { readonly __brand2: "TrackNumber" };
export type SectorNumber = SixBitNumber & { readonly __brand2: "SectorNumber" };

export function asSixBit(n: number): SixBitNumber {
    if (n < 0 || n > 0b111111) {
        throw new Error("Not a 6‑bit number");
    }
    return n as SixBitNumber;
}

export function toBinary(n: SixBitNumber): string {
    return n.toString(2).padStart(6, "0");
}

export type Bit = 0 | 1;
export type SixBits = [Bit, Bit, Bit, Bit, Bit, Bit];

export function toBits(n: SixBitNumber): SixBits {
    const bin = toBinary(n);
    return bin.split("").map(b => (b === "1" ? 1 : 0)) as SixBits;
}

export type HexVal = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "f" | "g" | "j" | "k" | "q" | "w" | "l"

export type TrackHex = `${HexVal}${HexVal}`;
export type SectorHex = `${HexVal}${HexVal}`;

// Overload signatures
export function asTrack(hex: TrackHex): TrackNumber;
export function asTrack(n: number): TrackNumber;
export function asTrack(n: SixBitNumber): TrackNumber;
export function asTrack(bits: BitArray): TrackNumber;

// Implementation
export function asTrack(
    n: number | string | BitArray
): TrackNumber {
    // Bit array → number
    if (Array.isArray(n)) {
        if (n.length !== 6) {
            throw new Error("BitArray must contain exactly 6 bits");
        }
        let value = 0;
        for (const bit of n) {
            value = (value << 1) | bit;
        }
        return asSixBit(value) as TrackNumber;
    }

    // Hex string → number
    if (typeof n === "string") {
        return asSixBit(parseInt(n, 16)) as TrackNumber;
    }

    // number or SixBitNumber
    return asSixBit(n) as TrackNumber;
}

// Overload signatures
export function asSector(hex: TrackHex): SectorNumber;
export function asSector(n: number): SectorNumber;
export function asSector(n: SixBitNumber): SectorNumber;
export function asSector(bits: BitArray): SectorNumber;

// Implementation
export function asSector(
    n: number | string | BitArray
): SectorNumber {
    // Bit array → number
    if (Array.isArray(n)) {
        if (n.length !== 6) {
            throw new Error("BitArray must contain exactly 6 bits");
        }
        let value = 0;
        for (const bit of n) {
            value = (value << 1) | bit;
        }
        return asSixBit(value) as SectorNumber;
    }

    // Hex string → number
    if (typeof n === "string") {
        return asSixBit(parseInt(n, 16)) as SectorNumber;
    }

    // number or SixBitNumber
    return asSixBit(n) as SectorNumber;
}

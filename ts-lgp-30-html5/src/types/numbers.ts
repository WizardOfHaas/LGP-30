// numbers.ts
export type SixBitNumber = number & { readonly __brand: "SixBitNumber" };
export type TrackNumber = SixBitNumber & { readonly __brand2: "TrackNumber" };
export type SectorNumber = SixBitNumber & { readonly __brand2: "SectorNumber" };

export function asSixBit(n: number): SixBitNumber {
    if (n < 0 || n > 0b111111) {
        throw new Error("Not a 6‑bit number");
    }
    return n as SixBitNumber;
}

export type HexVal = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "f" | "g" | "j" | "k" | "q" | "w" | "l"

export type TrackHex = `${HexVal}${HexVal}`;
export type SectorHex = `${HexVal}${HexVal}`;

// Overload signatures
export function asTrack(hex: TrackHex): TrackNumber;
export function asTrack(n: number): TrackNumber;
export function asTrack(n: SixBitNumber): TrackNumber;

// Implementation
export function asTrack(n: number | SixBitNumber | TrackHex): TrackNumber {
    if (typeof n === "string") {
        return asSixBit(parseInt(n, 16)) as TrackNumber;
    }
    return asSixBit(n) as TrackNumber;
}

// Overload signatures
export function asSector(n: number): SectorNumber;
export function asSector(n: SixBitNumber): SectorNumber;
export function asSector(hex: SectorHex): SectorNumber;

// Implementation
export function asSector(
    n: number | SixBitNumber | SectorHex
): SectorNumber {
    if (typeof n === "string") {
        return asSixBit(parseInt(n, 16)) as SectorNumber;
    }
    return asSixBit(n) as SectorNumber;
}
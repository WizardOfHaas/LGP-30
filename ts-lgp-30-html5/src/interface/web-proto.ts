/**
 * Pure HTML binding between UI and Machine
 */
import { BitArray } from "types";

/**
 * Display the bits of a BitArray in a table row
 * @param row The name of the row to display the bits in
 * @param bits The array of bits
 * @param offset The offset into the array of bits
 * @param skipChild If true, skip the first child element, skip colspan cells
 */
export function bitsToRow(row: string, bits: BitArray, offset: number, skipChild: boolean) {
    const tr = document.getElementById(row);
    if (!tr) {
        const msg = `${row} not found.`
        console.error(msg)
        return
        // throw new Error(msg)
    }
    let idx = offset
    let skip = skipChild
    const tds = Array.from(tr.children);
    for (const td of tds) {
        if (skip) {
            skip = false;
            continue;
        }
        if (bits[idx] === 1) {
            td.classList.remove('bit-off')
            td.classList.add('bit-on')
        } else {
            td.classList.remove('bit-on')
            td.classList.add('bit-off')
        }
        idx++
    }
}

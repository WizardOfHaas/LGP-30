import { OrderA } from "./a"
import { OrderB } from "./b"
import { OrderC } from "./c"
import { OrderH } from "./h"
import { IOrder } from "./order"
import { OrderR } from "./r"
import { OrderS } from "./s"
import { OrderT } from "./t"
import { OrderU } from "./u"
import { OrderY } from "./y"
import { OrderZ } from "./z"
import { OrderP } from "./p"
import { OrderI } from "./i"
import { BitArray } from "../types"
// import { halfToHex } from "../util"
import { OrderE } from "./e"
import { OrderD } from "./d"
import { OrderM } from "./m"
import { OrderN } from "./n"
import { asTrack, asSector } from '../types/numbers'

const orders = [
    new OrderB(),
    new OrderC(),
    new OrderH(),
    new OrderR(),
    new OrderT(),
    new OrderU(),
    new OrderY(),
    new OrderZ(),
    new OrderA(),
    new OrderS(),
    new OrderP(),
    new OrderI(),
    new OrderE(),
    new OrderD(),
    new OrderM(),
    new OrderN()
]

export const orderIdMap: { [id: string]: IOrder } = {}
export const orderNameMap: { [id: string]: IOrder } = {}

orders.forEach((o) => {
    const bitId = o.orderNumber.map((b) => b.toString()).join("")
    orderIdMap[bitId] = o
    orderNameMap[o.name] = o
})

/** 
 * Decode an array of bits to an order and it's operand.
 * The operand is in the format TTSS with leading zero
 * @param r the bits to decode
 * @returns the order and operand as a string
 * @todo I suspect this could be somewhere else
 */
export function decodeOrder(r: BitArray): string {
    const orderId = r.slice(12, 16).join("")
    const track = asTrack(r.slice(18, 24))
    const sector = asSector(r.slice(24, 30))
    if (orderId in orderIdMap) {
        const result: string = track.toString().padStart(2, '0') + sector.toString().padStart(2, '0')
        return orderIdMap[orderId].name + result
    }
    return "        " //Spacer, since this is for pretty printing
}

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
import { Register } from "../regs/register"
import { BitArray } from "../types"
import { addrToHex, binToDec, halfToHex } from "../util"
import { OrderE } from "./e"
import { OrderD } from "./d"
import { OrderM } from "./m"
import { OrderN } from "./n"

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

export const orderIdMap: {[id: string]: IOrder} = {}
export const orderNameMap: {[id: string]: IOrder} = {}

orders.forEach((o) => {
    const bitId = o.orderNumber.map((b) => b.toString()).join("")

    orderIdMap[bitId] = o
    orderNameMap[o.name] = o
})

export function decodeOrder(r: BitArray){
    const orderId = r.slice(12, 16).join("")
    const track = halfToHex(r.slice(18, 24))
    const sector = halfToHex(r.slice(24, 30))

    const addr = r.slice(18, 30)

    if(orderId in orderIdMap){
        return orderIdMap[orderId].name + " " + track + sector
    }

    return "        " //Spacer, sicne this is for pretty printing
}
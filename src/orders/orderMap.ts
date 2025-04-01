import { RegisterR } from "../regs/r";
import { halfToHex } from "../util";
import { OrderA } from "./a";

import { OrderB } from "./b";
import { OrderC } from "./c";
import { OrderH } from "./h";
import { IOrder } from "./order";
import { OrderR } from "./r";
import { OrderS } from "./s";
import { OrderT } from "./t";
import { OrderU } from "./u";
import { OrderY } from "./y";
import { OrderZ } from "./z";

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
    new OrderS()
]

export const orderIdMap: {[id: string]: IOrder} = {}
export const orderNameMap: {[id: string]: IOrder} = {}

orders.forEach((o) => {
    const bitId = o.orderNumber.map((b) => b.toString()).join("")

    orderIdMap[bitId] = o
    orderNameMap[o.name] = o
})

export function decodeOrder(r: RegisterR){
    const orderId = r.getOrder().join("")
    const track = r.getHexTrack()
    const sector = r.getHexSector()

    if(orderId in orderIdMap){
        return orderIdMap[orderId].name + " " + track + sector
    }

    return "        " //Spacer, sicne this is for pretty printing
}
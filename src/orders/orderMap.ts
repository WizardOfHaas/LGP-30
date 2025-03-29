import { OrderB } from "./b";
import { OrderC } from "./c";
import { OrderH } from "./h";
import { IOrder } from "./order";
import { OrderR } from "./r";
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
    new OrderZ()
]

export const orderIdMap: {[id: string]: IOrder} = {}
export const orderNameMap: {[id: string]: IOrder} = {}

orders.forEach((o) => {
    const bitId = o.orderNumber.map((b) => b.toString()).join("")

    orderIdMap[bitId] = o
    orderNameMap[o.name] = o
})
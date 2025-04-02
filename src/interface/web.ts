import { decodeOrder } from "../orders/orderMap"
import { State } from "../state"
import { BitArray } from "../types"
import { binToDec } from "../util"

export function displayRegs(state: State){
    $("#c").text(state.registers.c.get().join(""))
    $("#r").text(state.registers.r.get().join(""))
    $("#a").text(state.registers.a.get().join(""))

    //$("#c-dec").text(decodeAddr())
    //$("#r-dec").text(binToDec(regs.r))
    //$("#a-dec").text(unpackNum(state.registers.a))
    //$("#a-ins").text(decodeOrder(state.registers.a))

    $("#c-bin").html(bitsToSpans(state.registers.c.get()))
    $("#r-bin").html(bitsToSpans(state.registers.r.get()))
    $("#a-bin").html(bitsToSpans(state.registers.a.get()))
}

export function displayMem(state: State){
    $("#mem").html("")
    const ip = binToDec(state.registers.c.get())

    state.memory.data.forEach((m, i) => {
        if(
            binToDec(m) != 0
        ){
            $("#mem").append($(
                "<tr" + (i == ip ? " class='ip'" : "") + "><td>" + i + "</td>" +
                "<td>" + m.join("") + "</td>" +
                "<td>(" + binToDec(m) + ")</td>" +
                "<td>" + decodeOrder(m) + "</td>" +
                "</tr>"
            ))
        }
    })
}

function bitsToSpans(b: BitArray){
    return b.map((b, i) => ("<span class='bit-" + i + " bit-" + (b == 0 ? "off" : "on") + "'></span>")).join("")
}
import { assembleLine } from "./asm"
import { LGP30 } from "./lgp30"

import $ from "jquery"
import { State } from "./state"
import { unpackNum } from "./util"
import { decodeOrder } from "./orders/orderMap"

window.jQuery = window.$ = $
window.LGP30 = LGP30

const lgp30 = new LGP30({
    onStep: () => {
        displayRegs(lgp30.state)
    }
})

window.lgp30 = lgp30

assembleLine(lgp30.state.memory, "0000 u 0002")
assembleLine(lgp30.state.memory, "0002 b 0001")
assembleLine(lgp30.state.memory, "0003 a 0010")
assembleLine(lgp30.state.memory, "0004 h 0001")
assembleLine(lgp30.state.memory, "0005 s 0009")
assembleLine(lgp30.state.memory, "0006 t 0002")

assembleLine(lgp30.state.memory, "0009 5")
assembleLine(lgp30.state.memory, "0010 1")

$(window).bind('load', () => {
    $("#start").on("click", async () => {
        console.log("RUN!")
        lgp30.state.mode = "NORMAL"
        await lgp30.run()
    })

    displayRegs(lgp30.state)
})

function displayRegs(state: State){
    $("#c").text(state.registers.c.get().join(""))
    $("#r").text(state.registers.r.get().join(""))
    $("#a").text(state.registers.a.get().join(""))

    //$("#c-dec").text(decodeAddr())
    //$("#r-dec").text(binToDec(regs.r))
    //$("#a-dec").text(unpackNum(state.registers.a))
    //$("#a-ins").text(decodeOrder(state.registers.a))

    $("#c-bin").html(state.registers.c.get().map((b, i) => ("<span class='bit-" + i + " bit-" + (b == 0 ? "off" : "on") + "'></span>")))
    $("#r-bin").html(state.registers.r.get().map((b, i) => ("<span class='bit-" + i + " bit-" + (b == 0 ? "off" : "on") + "'></span>")))
    $("#a-bin").html(state.registers.a.get().map((b, i) => ("<span class='bit-" + i + " bit-" + (b == 0 ? "off" : "on") + "'></span>")))
}
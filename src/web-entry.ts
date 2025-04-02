import { assembleLine } from "./asm"
import { LGP30 } from "./lgp30"
import { displayMem, displayRegs } from "./interface/web"

import $ from "jquery"

window.jQuery = window.$ = $
window.LGP30 = LGP30

const lgp30 = new LGP30({
    onStep: () => {
        displayRegs(lgp30.state)
        displayMem(lgp30.state)
    },
    onTx: async (b) => {
        console.log(b)
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
        lgp30.state.mode = "NORMAL"
        await lgp30.run()
    })

    displayRegs(lgp30.state)
    displayMem(lgp30.state)
})
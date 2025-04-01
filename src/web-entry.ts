import { assembleLine } from "./asm"
import { LGP30 } from "./lgp30"

import $ from "jquery"

window.LGP30 = LGP30

const lgp30 = new LGP30()

assembleLine(lgp30.state.memory, "0000 b 0000")
assembleLine(lgp30.state.memory, "0001 b 0003")
assembleLine(lgp30.state.memory, "0003 3w")

$(window).bind('load', () => {
    $("#run").on("click", async () => {
        console.log("RUN!")
        await lgp30.run()
    })
})

window.lgp30 = lgp30
import { LGP30 } from "../lgp30"
import { decodeOrder } from "../orders/orderMap"
import { State } from "../state"
import { BitArray, ExecMode } from "../types"
import { binToDec, unpackNum } from "../util"

export function displayRegs(state: State) {
    // TODO - group the order | track | sector
    $("#c").text(state.registers.c.get().join(""))
    $("#r").text(state.registers.r.get().join(""))
    $("#a").text(state.registers.a.get().join(""))

    $("#c-dec").text(state.registers.c.toTTSS())
    $("#r-dec").text(decodeOrder(state.registers.r.get()))
    $("#a-dec").text(unpackNum(state.registers.a.get()))
    // $("#a-ins").text(decodeOrder(state.registers.a.get()))
    // display to the scope
    $("#c-bin").html(bitsToSpans(state.registers.c.get()))
    $("#r-bin").html(bitsToSpans(state.registers.r.get()))
    $("#a-bin").html(bitsToSpans(state.registers.a.get()))
}

export function displayMem(state: State) {
    $("#mem").html("")
    const ip = state.registers.c.toDec()
    state.memory.data.forEach((m, i) => {
        if (binToDec(m) != 0) {
            const i4: string = (i).toString().padStart(4, '0');
            const trackStr = Math.floor(i / 64).toString().padStart(2, '0')
            const sectorStr = (i % 64).toString().padStart(2, '0')
            $("#mem").append($(
                "<tr" + (i == ip ? " class='ip'" : "") + "><td>" + trackStr + sectorStr + ":</td>" +
                "<td>" +
                m.slice(0, 12).join("") + "|" +
                m.slice(12, 16).join("") + "|" +
                m.slice(16, 18).join("") + "|" +
                m.slice(18, 24).join("") + "|" +
                m.slice(24, 30).join("") + "|" +
                m.slice(30, 32).join("") +
                "</td>" +
                "<td>&nbsp;" + decodeOrder(m) + "</td>" +
                "<td></td>" + // if the order is a constant, show the constant
                "</tr>"
            ))
        }
    })
}

export function displayMode(state: State) {
    if (state.running) {
        $("#compute").addClass("btn-green")
        $("#stop").removeClass("btn-on")
    } else {
        $("#compute").removeClass("btn-green")
        $("#stop").addClass("btn-on")
    }

    $("#mode-btns button").removeClass("btn-on")
    $("#" + state.mode.toLowerCase()).addClass("btn-on")
}

export function bindModeButtons(state: State) {
    $("#mode-btns button").on("click", (e) => {
        state.setMode(e.target.id.toUpperCase() as ExecMode)
        displayMode(state)
    })
}

export function bindKeybd(lgp30: LGP30) {
    const keyMapping = { //These are functions to handle shifts
        "COND STOP": () => "'",
        "TAB": () => "\t",
        "CAR RET": () => "\r",
        "BACK SPACE": () => ""
    }

    $(".keybd td").on("click", (e) => {
        const vals = e.target.innerHTML.split("<br>")

        const id = vals.join(" ")

        let key = ""

        if (typeof keyMapping[id] !== "undefined") { //Handle special keys
            key = keyMapping[id]()
        } else if (vals.length == 2) { //Handle upper/lower case keys
            key = vals[1]
        } else { //Handle normal keys
            key = vals[0]
        }

        // console.debug(key)
    })
}

export function bindOpButtons(lgp30: LGP30) {
    $("#start").on("click", () => {
        // lgp30.run()
        lgp30.state.running = true
    })

    $("#stop").on("click", () => {
        lgp30.state.running = false
    })

    $("#fill-ins").on("click", () => {
        lgp30.fillIns()
        displayRegs(lgp30.state)
    })

    $("#ex-ins").on("click", () => {
        lgp30.executeOrder().then(() => {
            console.debug("Order executed successfully")
        }).catch((e) => {
            console.error("Error executing order:", e)
        })
    })

    $("#clear-counter").on("click", () => {
        lgp30.state.registers.c.clear()
        displayRegs(lgp30.state)
    })

    $("#start-read").on("click", () => {
        lgp30.rxFromBuffer()
    })
}

function bitsToSpans(b: BitArray): string {
    return b.map((b, i) => ("<span class='bit-" + i + " bit-" + (b == 0 ? "off" : "on") + "'></span>")).join("")
}

import { LGP30 } from "../lgp30"
import { decodeOrder } from "../orders/orderMap"
import { State } from "../state"
import { BitArray, ExecMode } from "../types"
import { addrToHex, binToDec, halfToHex, unpackNum } from "../util"

export function displayRegs(state: State){
    $("#c").text(state.registers.c.get().join(""))
    $("#r").text(state.registers.r.get().join(""))
    $("#a").text(state.registers.a.get().join(""))

    $("#c-dec").text(state.registers.c.toDec())
    $("#r-dec").text(decodeOrder(state.registers.r.get()))
    $("#a-dec").text(unpackNum(state.registers.a.get()))
    $("#a-ins").text(decodeOrder(state.registers.a.get()))

    $("#c-bin").html(bitsToSpans(state.registers.c.get()))
    $("#r-bin").html(bitsToSpans(state.registers.r.get()))
    $("#a-bin").html(bitsToSpans(state.registers.a.get()))
}

export function displayMem(state: State){
    $("#mem").html("")
    const ip = state.registers.c.toDec()

    state.memory.data.forEach((m, i) => {
        if(
            binToDec(m) != 0
        ){
            $("#mem").append($(
                "<tr" + (i == ip ? " class='ip'" : "") + "><td>" + addrToHex(i) + ":</td>" +
                //"<td>" + m.join("") + "</td>" +
                "<td>" + 
                    m.slice(0, 12).join("") + "|" +
                    m.slice(12, 16).join("") + "|" +
                    m.slice(16, 18).join("") + "|" +
                    m.slice(18, 24).join("") + "|" +
                    m.slice(24, 30).join("") + "|" +
                    m.slice(30, 32).join("") +
                "</td>" +
                "<td>(" + binToDec(m) + ")</td>" +
                "<td>" + decodeOrder(m) + "</td>" +
                "</tr>"
            ))
        }
    })
}

export function displayMode(state: State){
    if(state.running){
        $("#compute").addClass("btn-green")
        $("#stop").removeClass("btn-on")
    }else{
        $("#compute").removeClass("btn-green")
        $("#stop").addClass("btn-on")
    }

    $("#mode-btns button").removeClass("btn-on")
    $("#" + state.mode.toLowerCase()).addClass("btn-on")
}

export function bindModeButtons(state: State){
    $("#mode-btns button").on("click", (e) => {
        state.setMode(e.target.id.toUpperCase() as ExecMode)
        displayMode(state)
    })
}

export function bindKeybd(lgp30: LGP30){
    const keyMapping = { //These are functions to handle shifts
        "COND STOP": () => "'",
        "TAB": () => "\t",
        "CAR RET": () => "\r",
        "BACK SPACE": () => ""
    }

    $(".keybd td").on("click", async (e) => {
        const vals = e.target.innerHTML.split("<br>")

        const id = vals.join(" ")

        let key = ""

        if(typeof keyMapping[id] !== "undefined"){ //Handle special keys
            key = keyMapping[id]()
        }else if(vals.length == 2){ //Handle upper/lower case keys
            key = vals[1]
        }else{ //Handle normal keys
            key = vals[0]
        }

        console.log(key)
    })
}

export function bindOpButtons(lgp30: LGP30){
    $("#start").on("click", async () => {
        await lgp30.run()
    })

    $("#stop").on("click", async () => {
        lgp30.state.running = false
    })

    $("#fill-ins").on("click", () => {
        lgp30.fillIns()
        displayRegs(lgp30.state)
    })

    $("#ex-ins").on("click", () => {
        lgp30.executeOrder()
    })

    $("#clear-counter").on("click", () => {
        lgp30.state.registers.c.clear()
        displayRegs(lgp30.state)
    })

    $("#start-read").on("click", async () => {
        await lgp30.rxFromBuffer()
    })
}

function bitsToSpans(b: BitArray){
    return b.map((b, i) => ("<span class='bit-" + i + " bit-" + (b == 0 ? "off" : "on") + "'></span>")).join("")
}
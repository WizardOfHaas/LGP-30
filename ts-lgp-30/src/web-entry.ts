import { assembleLine } from "./asm"
import { LGP30 } from "./lgp30"
import { bindKeybd, bindModeButtons, bindOpButtons, displayMem, displayMode, displayRegs } from "./interface/web"

import $ from "jquery"
import { decodeOrder } from "./orders/orderMap"
import { binToDec, dumpRegs } from "./util"
import { Flexowriter } from "./flexo"
import { Terminal } from "@xterm/xterm"
import { bitsToChar, charMapLC } from "./chars"

window.jQuery = window.$ = $
window.LGP30 = LGP30

/*
assembleLine(lgp30.state.memory, "0000 u 0002")
assembleLine(lgp30.state.memory, "0002 b 0001")
assembleLine(lgp30.state.memory, "0003 a 0010")
assembleLine(lgp30.state.memory, "0004 h 0001")
assembleLine(lgp30.state.memory, "0005 s 0009")
assembleLine(lgp30.state.memory, "0006 t 0002")

assembleLine(lgp30.state.memory, "0009 5")
assembleLine(lgp30.state.memory, "0010 1")
*/

$(window).bind('load', async () => {
    const term = new Terminal({cols: 40, rows: 25})
    term.open(document.getElementById('terminal'));

    const lgp30 = new LGP30({
        onStep: () => {
            displayRegs(lgp30.state)
            displayMem(lgp30.state)
            displayMode(lgp30.state)
        },
        onTx: async (b) => {
            console.log(b, bitsToChar(b))
            term.write(bitsToChar(b))
        }
    })

    term.onKey(async (d) => {
        term.write(d.key)

        //This is where I need to show depressed keys

        await lgp30.rxChar(d.key)
        displayRegs(lgp30.state)
    })

    //Ok. I'm starting to see the issue. The code is never able to go back to running as normal
    //  ...because the sendTape function just loops
    //  ...the function needs to run into COND then stop

    window.lgp30 = lgp30

    bindModeButtons(lgp30.state)
    bindOpButtons(lgp30)
    bindKeybd(lgp30)

    $("#vis-mode").on("click", () => {
        $("#dev-scope, #mem-holder, #asm-holder, #logo").toggleClass("hidden");
    })

    $("#asm").val().split("\n").forEach((l) => {
        assembleLine(lgp30.state.memory, l)
    })

    $("#assemble").on("click", () => {
        lgp30.state.memory.clear()
        $("#asm").val().split("\n").forEach((l) => {
            assembleLine(lgp30.state.memory, l)
        })

        displayMem(lgp30.state)
    })

    $("#upload").on("click", async (e) => {
        var input = document.createElement('input')
        input.type = 'file'

        input.addEventListener("change", function(){
            var reader = new FileReader();

            reader.onload = async (e) => {
                lgp30.toRxBuffer(reader.result as string)
            };

            if(this.files != null && this.files.length > 0){
                reader.readAsText(this.files[0], "UTF-8");
            }
        }, true);                
        
        input.click()
    })

    $("#load-image").on("click", async (e) => {
        var input = document.createElement('input')
        input.type = 'file'

        input.addEventListener("change", function(){
            var reader = new FileReader();

            reader.onload = async (e) => {
                lgp30.loadMemoryImage(reader.result as string)
                displayMem(lgp30.state)
            };

            if(this.files != null && this.files.length > 0){
                reader.readAsText(this.files[0], "UTF-8");
            }
        }, true);                
        
        input.click()
    })

    displayRegs(lgp30.state)
    displayMem(lgp30.state)
    displayMem(lgp30.state)
})

async function manualScript(s: string){
    const ins = s.split("\n")

    lgp30.state.mode = "MANUAL"

    for(const i in ins){
        const [sto, ord] = ins[i].split("'")

            await flexo.tx(sto) //Send over storage part
            //console.log(sto, '->', decodeOrder(lgp30.state.registers.a.get()))

            lgp30.fillIns() //Setup to run sto

        if(ord && ord.length > 0){ //We have a store order, and an instruction order

            await flexo.tx(ord) //Load in next part
            //console.log(ord, '->', decodeOrder(lgp30.state.registers.a.get()))
            //dumpRegs(lgp30.state)
        }

        await lgp30.step() //Run the ins
    }
}
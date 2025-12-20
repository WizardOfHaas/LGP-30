import { assembleLine } from "./asm"
import { LGP30 } from "./lgp30"
import { bindKeybd, bindModeButtons, bindOpButtons, displayMem, displayMode, displayRegs } from "./interface/web"

import { Terminal } from "@xterm/xterm"
import { bitsToChar } from "./chars"

window.LGP30 = LGP30

$(window).bind('load', async () => {
    const term = new Terminal({cols: 40, rows: 25})
    // Check if the element was successfully found (i.e., it is NOT null)
    const terminalElement = document.getElementById('terminal');
    if (terminalElement) {
        term.open(terminalElement);
    } else {
        const msg = "The element with ID 'terminal' was not found in the DOM."
        console.error(msg);
        throw new Error(msg)
    }

    const lgp30 = new LGP30({
        onStep: () => {
            displayRegs(lgp30.state)
            displayMem(lgp30.state)
            displayMode(lgp30.state)
        },
        onTx: async (b) => {
            // console.debug(b, bitsToChar(b))
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

    
    const rawVal = $("#asm").val() ?? ""
    const asmVal = rawVal as string
    asmVal.split("\n").forEach((l) => {
        assembleLine(lgp30.state.memory, l)
    })

    $("#assemble").on("click", () => {
        lgp30.state.memory.clear()
        const rawVal = $("#asm").val() ?? ""
        const asmVal = rawVal as string
        asmVal.split("\n").forEach((l) => {
            assembleLine(lgp30.state.memory, l)
        })

        displayMem(lgp30.state)
    })

    $("#upload").on("click", async (e) => {
        const input = document.createElement('input')
        input.type = 'file'

        input.addEventListener("change", function(){
            const reader = new FileReader();

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
        const input = document.createElement('input')
        input.type = 'file'

        input.addEventListener("change", function(){
            const reader = new FileReader();

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

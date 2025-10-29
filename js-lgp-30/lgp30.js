class LGP30{
    /**
     * 
     * Config will need IDs for display elements, and an instance of Flexowriter
     */
    constructor(config){
        this.config = config

        this.WORD_SIZE = 32
        this.ADDR_SIZE = 12

        this.mode = "NORMAL" //Enum: NORMAL | STEP | MANUAL

        this.orders = {
            "0001": { //Bring
                name: "b",
                eval: async(order, track, sector) => {
                    const i = this.composeAddr(track, sector)
                    this.regs.a = this.mem[i]
                    return this.incAddr()
                }
            },
            "1100": { //Hold and Store
                name: "h",
                eval: async(order, track, sector) => {
                    const i = this.composeAddr(track, sector)
                    this.mem[i] = this.regs.a
                    this.coolAddresses.push(i)
                    return this.incAddr()
                }
            },
            "1101": { //Clear and Store
                name: "c",
                eval: async(order, track, sector) => {
                    const i = this.composeAddr(track, sector)
                    this.mem[i] = this.regs.a
                    this.regs.a = Array(32).fill(0)
                    return this.incAddr()
                }
            },
            "0010": { //Store Address
                //Moves address part of A into address part of ARG
                name: "y",
                eval: async(order, track, sector) => {
                    const i = this.composeAddr(track, sector)
    
                    //a[18:28] -> mem[i][18:29]
                    const addr = this.regs.a.slice(18, 30)

                    this.mem[i] = this.insertArrayAt(this.mem[i], 18, addr)
    
                    return this.incAddr()
                }
            },
            "1010": { //Unconditional transfer
                name: "u",
                eval: async(order, track, sector) => {
                    const i = this.composeAddr(track, sector)
    
                    return track.concat(sector)
                }
            },
            "0011": { //Return address
                name: "r",
                eval: async(order, track, sector) => {
                    const i = this.composeAddr(track, sector)
    
                    const addr = this.incAddr()
                    this.mem[i] = this.insertArrayAt(mem[i], 19, addr)
    
                    return addr
                }
            },
            "1011": { //Test
                name: "t",
                eval: async(order, track, sector) => {
                    const i = this.composeAddr(track, sector)
    
                    if(this.regs.a[0] == 1){
                        return track.concat(sector)
                    }
    
                    return this.incAddr()
                }
            },
            "0000": { //Stop
                name: "z",
                eval: async() => {
                    this.running = false
                    return this.regs.c
                }
            },
            "1000": { //Print
                name: "p",
                eval: async(order, track, sector) => {
                    const c = this.binToDec(track)

                    if(c != 0){
                        await this.print(c)
                    }

                    return this.incAddr()
                }
            },
            "0100": { //Input
                //This is supposed to enter keyboard data into A "in same manner as from tape"
                name: "i",
                eval: async(order, track, sector) => {
                    const i = this.composeAddr(track, sector)
                    this.mode = "MANUAL"
                    this.running = false

                    //This seems to cause an infinite loop right now
                    await this.print(0) //Send START READ
                    return this.incAddr()
                }
            },
            "1110": { //Add
                name: "a",
                eval: async(order, track, sector) => {
                    const i = this.composeAddr(track, sector)

                    this.regs.a = this.add(this.regs.a, this.mem[i])
    
                    return this.incAddr()
                }
            },
            "1111": { //Subtract
                name: "s",
                eval: async(order, track, sector) => {
                    const i = this.composeAddr(track, sector)
    
                    this.regs.a = this.sub(this.regs.a, this.mem[i])
    
                    return this.incAddr()
                }
            },
            "0111": { //Multiply Upper
                name: "m",
                eval: async(order, track, sector) => {
                    const i = this.composeAddr(track, sector)
    
                    return this.incAddr()
                }
            },
            "0110": { //Multiply Lower
                name: "n",
                eval: async(order, track, sector) => {
                    const i = this.composeAddr(track, sector)
    
                    return this.incAddr()
                }
            },
            "0101": { //Divide
                name: "d",
                eval: async(order, track, sector) => {
                    const i = this.composeAddr(track, sector)
    
                    return this.incAddr()
                }
            },
            "1001": { //Extract(AND)
                name: "e",
                eval: async(order, track, sector) => {
                    const i = this.composeAddr(track, sector)
    
                    return this.incAddr()
                }
            },
        }

        this.running = false //Global machine state

        //Our "drum". 6363 locations, but only 4096 are used.
        //  This is a hack to dela with the LGP-30's TTSS addressing
        this.mem = Array(6363).fill(
            Array(this.WORD_SIZE).fill(0)
        )

        //This is used for the concise memory dump
        this.coolAddresses = []

        this.regs = {
            c: Array(this.ADDR_SIZE).fill(0),   //Counter - Instruction Pointer
                //C is encoded as TRACK|SECTOR
                //  ...so I need to treat it... specially
            r: Array(this.WORD_SIZE).fill(0),    //Instruction
            a: Array(this.WORD_SIZE).fill(0)    //Accumulator
        }

        //Create reverse mapping for assembly mode
        this.orderMap = {}

        Object.keys(this.orders).forEach((o) => {
            this.orderMap[this.orders[o].name] = o
        })

        if(this.config.initialAsm){
            this.assembleCode($(this.config.initialAsm).val())
        }

        //Fire up the display
        this.showMem()
        this.showRegs()

        return this
    }

     async run(){
        this.running = true

        if(this.mode == "NORMAL"){
            while(this.running){
                await this.step()
                await this.delay()
            }

            if(this.config.onStep){
                this.config.onStep()
            }
        }else if(this.mode == "STEP"){
            await this.step()
        }
    }

    stop(){
        this.running = false

        if(this.config.onStep){
            this.config.onStep()
        }
    }

    async step(){
        if(this.config.onStep){
            this.config.onStep()
        }
        
        const track = this.regs.c.slice(0, 6)
        const sector = this.regs.c.slice(6, 13)
        const addr = this.composeAddr(track, sector)

        this.regs.r = this.mem[addr] //Fetch
        this.regs.c = await this.runIns(this.regs.r)

        this.showRegs()
        this.showMem()
    }

    async runIns(word){
        //Extract fields
        const order = word.slice(12, 16)
        const track = word.slice(18, 24)
        const sector = word.slice(24, 30)
        
        const orderId = order.join("")

        console.log(this.orders[orderId].name, order, track, sector)

        $("#r-dec").text(this.orders[orderId].name + ":" + this.composeAddr(track, sector))

        const ret = await this.orders[orderId].eval(order, track, sector)
        this.showRegs()
        this.showMem()

        return ret
    }

    incAddr(){
        var track = this.binToDec(this.regs.c.slice(0, 6))
        var sector = this.binToDec(this.regs.c.slice(6, 13))

        sector++

        if(sector > 63){
            sector = 0
            track++
        }

        return this.decToBin(track, 6).concat(this.decToBin(sector, 6))
    }

    assembleCode(asm){
        asm.split("\n").forEach((l) => {this.assembleLine(l)})
    }

    assembleLine(l){
        const parts = l.split(" ")

        //Get address
        const addr = parseInt(parts[0])
        this.coolAddresses.push(addr)

        //Test if this is an order
        if(Object.hasOwn(this.orderMap, parts[1])){
            const order = this.orderMap[parts[1]].split("").map(Number)

            this.mem[addr] = this.insertArrayAt(this.mem[addr], 12, order)

            //Do we have an argument?
            if(parts.length > 2){
                const track = this.hexToBin(parts[2].slice(0, 2), 6)
                const sector = this.hexToBin(parts[2].slice(2, 4), 6)

                this.coolAddresses.push(this.composeAddr(track, sector))

                this.mem[addr] = this.insertArrayAt(this.mem[addr], 18, track.concat(sector))
            }
        }else{
            //Otherwise, this is a constant
            this.mem[addr] = this.decToBin(Number(parts[1]), 32)
        }
    }

    insertArrayAt(array, index, arrayToInsert) {
        var arr = array.slice() //Break the ref
        for(var i = index; i < index + arrayToInsert.length; i++){
            arr[i] = arrayToInsert[i - index]
        }

        return arr
    }

    decode(word){
        const order = word.slice(12, 16)
        const track = word.slice(18, 24)
        const sector = word.slice(24, 30)
        
        const orderId = order.join("")

        return this.orders[orderId].name + " " + this.binToDec(track) + ":" + this.binToDec(sector) //composeAddr(track, sector)
    }

    /**
     * Cused math helper functions
     */

    //This is where I have to care about numeric representation
    add(x, y){
        //Break refs
        const a = this.unpackNum(x)
        const b = this.unpackNum(y)

        const ret = this.packNum(a + b)

        return ret
    }

    sub(x, y){
        const a = this.unpackNum(x)
        const b = this.unpackNum(y)

        const ret = this.packNum(a - b)

        return ret
    }
    
    //I can make this "realistic" using drum delay calculations
    async delay(){ ///UUUGGGHHH THIS NEEDS TO BE ASYNC.... :(
        return new Promise(resolve => setTimeout(resolve, 100))
    }
    
    hexToDec(h){
        if(Number(h) || h == 0){
            return Number(h)
        }

        const chars = {"f": "a", "g": "b", "j": "c", "k": "d", "q": "e", "w": "f", "l": "1"}

        const realHex = h.split("").map((c) => (Object.hasOwn(chars, c) ? chars[c] : c)).join("")

        return parseInt(realHex, 16)
    }

    hexToBin(h, n = 4){
        const dec = this.hexToDec(h)
        return this.decToBin(dec, n)
    }

    isHex(c){
        return c == 0 || Number(c)|| ["f", "g", "j", "k", "q", "w"].includes(c)
    }

    /**
     * Main I/O
     */

    //This is the main connection point.
    //  It takes a 6-bit code (in LGP-30 hex) as input, composes it to a bit array...
    //  ...and then acts according to this.mode
    //  ...in 4-bit mode it slices, in 6-bit mode it does not
    async recv(bits){
        if(this.mode == "MANUAL"){
            //Read into accumulator (this chares about the spacer bit :/)
            //In 6-bit mode into a[26:31]
            //In 4-bit mode into a[28:31]
            //Then shift
            //It rotates once full
            //When COND-STOP is read computer moves on to next op
            //  What is the char code for a cond stop? (100000)

            //console.log(bits)
            
            if(this.binToDec(bits) == 32){
                console.log("COND-STOP")
                this.mode = "NORMAL"
                await this.run()
            }else{
                this.shiftIntoA(bits.slice(0, 4))
                this.showRegs()
            }
        }
    }

    shiftIntoA(c){
        this.regs.a = this.regs.a.concat(this.regs.a.splice(0, c.length))
        this.regs.a = this.insertArrayAt(this.regs.a, this.regs.a.length - c.length, c)
    }

    setMode(mode){}

    setA(v){}

    setR(v){}

    setC(v){}

    /**
     * Number encoding/decoding stuff
     */

    binToDec(b){
        return parseInt(b.join(""), 2);
    }

    decToBin(d, n){
        const bits = d.toString(2).split("").map(Number)

        if(n == undefined){
            return bits
        }

        return Array(n - bits.length).fill(0).concat(bits)
    }

    //These need to be updated to ignore the spacer bit (w[31])
    //Encode literal number
    packNum(d){
        const w = this.decToBin(Math.abs(d), 32)
        if(d < 0){
            w[0] = 1
        }
        
        return w
    }
    
    //Decode literal number
    unpackNum(w){
        return (w[0] == 1 ? -1 : 1) * this.binToDec(w.slice(1))
    }

    //I love JS sometimes...
    composeAddr(track, sector){
        return parseInt(this.binToDec(track) + "" + (this.binToDec(sector) < 10 ? "0" + this.binToDec(sector) : this.binToDec(sector)))
    }

    decodeAddr(){
        const track = this.regs.c.slice(0, 6)
        const sector = this.regs.c.slice(6, 13)
        const addr = this.composeAddr(track, sector)
        return addr
    }

    /**
     * Display/Debug Functions
     */

    showMem(){
        $(this.config.memTarget).html("")
        const addr = this.decodeAddr()

        this.mem.forEach((m, i) => {
            if(
                this.coolAddresses.includes(i)
            ){
                $(this.config.memTarget).append($(
                    "<tr" + (i == addr ? " class='ip'" : "") + "><td>" + i + "</td>" +
                    "<td>" + m.join("") + "</td>" +
                    "<td>(" + this.binToDec(m) + ")</td>" +
                    "<td>" + this.decode(m) + "</td>" +
                    "</tr>"
                ))
            }
        })
    }
    
    showRegs(){
        $("#c").text(this.regs.c.join(""))
        $("#r").text(this.regs.r.join(""))
        $("#a").text(this.regs.a.join(""))

        $("#c-dec").text(this.decodeAddr())
        //$("#r-dec").text(binToDec(regs.r))
        $("#a-dec").text(this.unpackNum(this.regs.a))
        $("#a-ins").text(this.decode(this.regs.a))

        $("#c-bin").html(this.regs.c.map((b, i) => ("<span class='bit-" + i + " bit-" + (b == 0 ? "off" : "on") + "'></span>")))
        $("#r-bin").html(this.regs.r.map((b, i) => ("<span class='bit-" + i + " bit-" + (b == 0 ? "off" : "on") + "'></span>")))
        $("#a-bin").html(this.regs.a.map((b, i) => ("<span class='bit-" + i + " bit-" + (b == 0 ? "off" : "on") + "'></span>")))
    }

    async print(c){
        //console.log(c)
        //this.flexo.print(c)

        if(this.config.print){
            await this.config.print(c)
        }
    }
}
class LGP30{
    /**
     * 
     * Config will need IDs for display elements, and an instance of Flexowriter
     */
    constructor(config){
        this.config = config

        this.WORD_SIZE = 31
        this.ADDR_SIZE = 12

        this.orders = {
            "0001": { //Bring
                name: "b",
                eval: (order, track, sector) => {
                    const i = this.composeAddr(track, sector)
                    this.regs.a = this.mem[i]
                    return this.incAddr()
                }
            },
            "1100": { //Hold and Store
                name: "h",
                eval: (order, track, sector) => {
                    const i = this.composeAddr(track, sector)
                    this.mem[i] = this.regs.a
                    return this.incAddr()
                }
            },
            "1101": { //Clear and Store
                name: "c",
                eval: (order, track, sector) => {
                    const i = this.composeAddr(track, sector)
                    this.mem[i] = this.regs.a
                    this.regs.a = Array(31).fill(0)
                    return this.incAddr()
                }
            },
            "0010": { //Store Address
                //Moves address part of A into address part of ARG
                name: "y",
                eval: (order, track, sector) => {
                    const i = this.composeAddr(track, sector)
    
                    //a[18:28] -> mem[i][18:29]
                    const addr = this.regs.a.slice(18, 30)

                    this.mem[i] = this.insertArrayAt(this.mem[i], 18, addr)
    
                    return this.incAddr()
                }
            },
            "1010": { //Unconditional transfer
                name: "u",
                eval: (order, track, sector) => {
                    const i = this.composeAddr(track, sector)
    
                    return track.concat(sector)
                }
            },
            "0011": { //Return address
                name: "r",
                eval: (order, track, sector) => {
                    const i = this.composeAddr(track, sector)
    
                    const addr = this.incAddr()
                    this.mem[i] = this.insertArrayAt(mem[i], 19, addr)
    
                    return addr
                }
            },
            "1011": { //Test
                name: "t",
                eval: (order, track, sector) => {
                    const i = this.composeAddr(track, sector)
    
                    if(this.regs.a[0] == 1){
                        return track.concat(sector)
                    }
    
                    return this.incAddr()
                }
            },
            "0000": { //Stop
                name: "z",
                eval: () => {
                    this.running = false
                    return this.regs.c
                }
            },
            "1000": { //Print
                name: "p",
                eval: (order, track, sector) => {
                    //I'll need to convert track -> character
                    //  ...I'll need a map
                    //onst c = chars[this.binToDec(track)]
                    this.print(this.binToDec(track))
                    return this.incAddr()
                }
            },
            "1110": { //Add
                name: "a",
                eval: (order, track, sector) => {
                    const i = this.composeAddr(track, sector)

                    this.regs.a = this.add(this.regs.a, this.mem[i])
    
                    return this.incAddr()
                }
            },
            "1111": { //Subtract
                name: "s",
                eval: (order, track, sector) => {
                    const i = this.composeAddr(track, sector)
    
                    this.regs.a = this.sub(this.regs.a, this.mem[i])
    
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

        while(this.running){
            this.step()
            await this.delay()
        }
    }

    step(){
        const track = this.regs.c.slice(0, 6)
        const sector = this.regs.c.slice(6, 13)
        const addr = this.composeAddr(track, sector)

        this.regs.r = this.mem[addr] //Fetch
        this.regs.c = this.runIns(this.regs.r)
    }

    runIns(word){
        //Extract fields
        const order = word.slice(12, 16)
        const track = word.slice(18, 24)
        const sector = word.slice(24, 30)
        
        const orderId = order.join("")

        console.log(this.orders[orderId].name, order, track, sector)

        $("#r-dec").text(this.orders[orderId].name + ":" + this.composeAddr(track, sector))

        const ret = this.orders[orderId].eval(order, track, sector)
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
            if(parts.length > 2 && !isNaN(Number(parts[2]))){
                const track = this.decToBin(Number(parts[2].slice(0, 2)), 6)
                const sector = this.decToBin(Number(parts[2].slice(2, 4)), 6)

                this.coolAddresses.push(this.composeAddr(track, sector))

                this.mem[addr] = this.insertArrayAt(this.mem[addr], 18, track.concat(sector))
            }
        }else{
            //Otherwise, this is a constant
            this.mem[addr] = this.decToBin(Number(parts[1]), 31)
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
    delay(){
        return new Promise(resolve => setTimeout(resolve, 100))
    }
    
    /**
     * Number encoding/decoding stuff
     */

    binToDec(b){
        return parseInt(b.join(""), 2);
    }

    decToBin(d, n){ //I'll need a hex equiv eventually
        const bits = d.toString(2).split("").map(Number)

        if(n == undefined){
            return bits
        }

        return Array(n - bits.length).fill(0).concat(bits)
    }

    //Encode literal number
    packNum(d){
        const w = this.decToBin(Math.abs(d), 31)
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
    }

    print(c){
        //console.log(c)
        //this.flexo.print(c)

        if(this.config.print){
            this.config.print(c)
        }
    }
}
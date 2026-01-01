import { describe, test, expect, beforeEach } from 'vitest'


import { RegisterC } from "./c"

describe("Register C", () => {
    let c: RegisterC
    beforeEach(() => {
        c = new RegisterC()
        c.clear()
    })

    test("Initial value is zeroed", () => {
        expect(c.data).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        expect(c.toDec()).toBe(0)
    })

    test("Increment the initial value", () => {
        c.inc()
        expect(c.data).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
        expect(c.toDec()).toBe(1)
    })

    test('test toDec', () => {
        // the math is screwy
        // I would think 1000 as track and sector would be
        // 
        expect(c.data).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        // 10|00
        // 001010|000000
        // [0,0,1,0,1,0,0,0,0,0,0,0]
        c.set([0,0,1,0,1,0,0,0,0,0,0,0])
        // console.debug(c.toDec())
        expect(c.toDec()).toBe(10 * 64 + 0)
    })

})

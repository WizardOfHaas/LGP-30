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
        // 10|10
        // 001010|001010
        c.set([0,0,1,0,1,0,0,0,1,0,1,0])
        expect(c.toDec()).toBe(10 * 64 + 10)
    })

    test('test toTTSS', () => {
        // 10|10
        // 001010|001010
        c.set([0,0,1,0,1,0,0,0,1,0,1,0])
        expect(c.toTTSS()).toBe('1010')
    })
})

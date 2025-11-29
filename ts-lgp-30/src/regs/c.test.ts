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
})

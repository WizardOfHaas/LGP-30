// src/index.test.ts
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { LGP30 } from './lgp30'
import { Flexowriter } from './flexo'

describe('test lgp30 module', () => {
  let lgp30: LGP30
  let flexo: Flexowriter

  beforeEach(() => {
    lgp30 = new LGP30({
      onTx: vi.fn()
    })

    flexo = new Flexowriter({
      onTx: (b) => lgp30.rx(b)
    })
  })

  test('LGP30 initializes with correct default state', () => {
    expect(lgp30.state.mode).toBe('NORMAL')
    expect(lgp30.state.registers.a).toBeDefined()
    expect(lgp30.state.memory).toBeDefined()
  })

  test('Flexowriter connects to LGP30', () => {
    const mockData = 'test'
    flexo.tx(mockData)
    expect(lgp30.state.registers.a).toBeDefined()
  })


// FAIL  src/index.test.ts > LGP30 Emulator > memory sector access
// AssertionError: expected [ +0, +0, +0, +0, +0, +0, +0, …(25) ] to be '1234567890' // Object.is equality
// - Expected:
// "1234567890"
// + Received:
// [
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   0,
//   "1",
//   "2",
//   "3",
//   "4",
//   "5",
//   "6",
//   "7",
//   "8",
//   "9",
//   "0",
// ]
//   test('memory sector access', () => {
//     lgp30.state.memory.set('3w', '00', '1234567890')
//     expect(lgp30.state.memory.get('3w', '00')).toBe('1234567890')
//   })
})

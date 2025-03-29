import type { SectorNumber, TrackNumber, IState, BitArray } from "../types";

export interface IOrder{
    name: string
    orderNumber: BitArray
    
    //Takes a state, adjust the state, then returns the new state
    eval(state: IState, track: TrackNumber, sector: SectorNumber) : IState
}
import type { BitArray, IState } from "../types";
import type { TrackNumber, SectorNumber } from "../types/numbers";

export interface IOrder {
    name: string
    orderNumber: BitArray

    //Takes a state, adjust the state, then returns the new state
    eval(state: IState, track?: TrackNumber, sector?: SectorNumber): Promise<IState>
}
import { Boat } from "../models/Boat"
export class BoatService {
    private boatArray: Array<Boat> = [];
    constructor() {}
    private async updateBoats(): Promise<void> {
        this.boatArray = await Boat.findAll();
    }
    public async returnAllBoats(): Promise<Array<Boat>> {
        await this.updateBoats();
        return this.boatArray;
    }
}
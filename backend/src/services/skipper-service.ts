import { Skipper } from "../models/Skipper"
export class SkipperService {
    private skipperArray: Array<Skipper> = [];
    constructor() {}
    private async updateSkippers(): Promise<void> {
        this.skipperArray = await Skipper.findAll();
    }
    public async returnAllSkippers(): Promise<Array<Skipper>> {
        await this.updateSkippers();
        return this.skipperArray;
    }
}
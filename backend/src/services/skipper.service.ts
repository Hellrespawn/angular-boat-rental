import { Skipper } from '../model/skipper.model';
export class SkipperService {
  private skipperArray: Array<Skipper> = [];

  private async updateSkippers(): Promise<void> {
    this.skipperArray = await Skipper.findAll();
  }

  public async returnAllSkippers(): Promise<Array<Skipper>> {
    await this.updateSkippers();
    return this.skipperArray;
  }
}

export class Fine {
  constructor(
    public userId: number,
    public amount: number,
    public paid: boolean,
    public id?: number
  ) {}
}

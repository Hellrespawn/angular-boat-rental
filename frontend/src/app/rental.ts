export interface Rental {
  id: number;
  dateStart: Date;
  dateEnd: Date;
  paid: boolean;
  boat: {
    id: number;
    name: string;
    imageRoute: string;
  };
  skipper?: {
    name: string;
  };
}

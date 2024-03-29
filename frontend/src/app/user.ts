import { Fine } from './fine';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  licence: boolean;
  //   dateOfBirth: Date;
  emailAddress: string;
  password: string;
  blocked: boolean;
  arrayOfFines: Fine[];
}

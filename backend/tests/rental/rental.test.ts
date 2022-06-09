import { expect } from 'chai';
import { Rental } from '../../src/model/rental';
import sinon from 'ts-sinon';
import { Boat } from '../../src/model/boat';
import { User } from '../../src/model/user';

describe('Test rental.model.ts', () => {
  let rental: Rental;

  beforeEach(() => {
    const dateStart = new Date('2022-01-10');
    const dateEnd = new Date('2022-01-15');
    const boat = sinon.createStubInstance(Boat);
    const user = sinon.createStubInstance(User);
    rental = new Rental(-1, boat, user, dateStart, dateEnd, false);
  });

  describe('Test Rental.days()', () => {
    it('Correctly handles the inclusivity of the rental period', () => {
      const expected = 6;
      const actual = Rental.days(rental.dateStart, rental.dateEnd);
      expect(actual).to.equal(expected);
    });
  });

  describe('Test Rental.areDatesOverlapping(dateStart, dateEnd)', () => {
    it('Returns true for a date ending during the rental.', () => {
      const dateStart = new Date('2022-01-01');
      const dateEnd = new Date('2022-01-12');
      const expected = true;
      const actual = rental.areDatesOverlapping(dateStart, dateEnd);

      expect(actual).to.equal(expected);
    });

    it('Returns true for a date ending on the first day of the rental.', () => {
      const dateStart = new Date('2022-01-01');
      const dateEnd = new Date('2022-01-10');
      const expected = true;
      const actual = rental.areDatesOverlapping(dateStart, dateEnd);

      expect(actual).to.equal(expected);
    });

    it('Returns true for a date starting during the rental.', () => {
      const dateStart = new Date('2022-01-12');
      const dateEnd = new Date('2022-01-20');
      const expected = true;
      const actual = rental.areDatesOverlapping(dateStart, dateEnd);

      expect(actual).to.equal(expected);
    });

    it('Returns true for a date starting on the last day of the rental.', () => {
      const dateStart = new Date('2022-01-15');
      const dateEnd = new Date('2022-01-20');
      const expected = true;
      const actual = rental.areDatesOverlapping(dateStart, dateEnd);

      expect(actual).to.equal(expected);
    });

    it('Returns true for a date enclosed by the rental.', () => {
      const dateStart = new Date('2022-01-11');
      const dateEnd = new Date('2022-01-14');
      const expected = true;
      const actual = rental.areDatesOverlapping(dateStart, dateEnd);

      expect(actual).to.equal(expected);
    });

    it('Returns true for two dates with a rental between them.', () => {
      const dateStart = new Date('2022-01-01');
      const dateEnd = new Date('2022-01-20');
      const expected = true;
      const actual = rental.areDatesOverlapping(dateStart, dateEnd);

      expect(actual).to.equal(expected);
    });

    it('Returns true for the same dates as the rental.', () => {
      const dateStart = new Date('2022-01-10');
      const dateEnd = new Date('2022-01-15');
      const expected = true;
      const actual = rental.areDatesOverlapping(dateStart, dateEnd);

      expect(actual).to.equal(expected);
    });

    it('Returns false for a date starting after the last day of a rental.', () => {
      const dateStart = new Date('2022-01-16');
      const dateEnd = new Date('2022-01-20');
      const expected = false;
      const actual = rental.areDatesOverlapping(dateStart, dateEnd);

      expect(actual).to.equal(expected);
    });

    it('Returns false for a date ending before the first day of a rental.', () => {
      const dateStart = new Date('2022-01-01');
      const dateEnd = new Date('2022-01-09');
      const expected = false;
      const actual = rental.areDatesOverlapping(dateStart, dateEnd);

      expect(actual).to.equal(expected);
    });

    it('Returns false for unrelated dates.', () => {
      const dateStart = new Date('2022-02-01');
      const dateEnd = new Date('2022-02-10');
      const expected = false;
      const actual = rental.areDatesOverlapping(dateStart, dateEnd);

      expect(actual).to.equal(expected);
    });
  });
});

import { Rental } from '../../src/model/rental.model';
import { MODELS } from '../../src/model';
import { expect } from 'chai';
import { Sequelize } from 'sequelize-typescript';

describe('Test Rental.isAvailable', () => {
  before(() => {
    new Sequelize({
      validateOnly: true,
      models: MODELS,
    });
  });

  let rental: Rental;

  beforeEach(() => {
    rental = new Rental();
    rental.date_start = new Date('2022-01-10');
    rental.date_end = new Date('2022-01-15');
  });

  it('Fails for a date ending during the rental.', () => {
    const date_start = new Date('2022-01-01');
    const date_end = new Date('2022-01-12');
    const expected = false;
    const actual = rental.isAvailable(date_start, date_end);

    expect(expected).to.equal(actual);
  });

  it('Fails for a date starting during the rental.', () => {
    const date_start = new Date('2022-01-12');
    const date_end = new Date('2022-01-20');
    const expected = false;
    const actual = rental.isAvailable(date_start, date_end);

    expect(expected).to.equal(actual);
  });

  it('Fails for dates with a rental between them.', () => {
    const date_start = new Date('2022-01-01');
    const date_end = new Date('2022-01-20');
    const expected = false;
    const actual = rental.isAvailable(date_start, date_end);

    expect(expected).to.equal(actual);
  });

  it('Succeeds for unrelated dates.', () => {
    const date_start = new Date('2022-01-16');
    const date_end = new Date('2022-01-20');
    const expected = true;
    const actual = rental.isAvailable(date_start, date_end);

    expect(expected).to.equal(actual);
  });
});

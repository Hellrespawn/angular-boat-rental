import request from 'supertest';
import { Skipper } from '../../src/model/skipper.model';
import { app } from '../../src/server';
import { expect } from 'chai';
import { initDatabase } from '../mocha-setup';
import { dropDatabase } from '../../src/util/database';

describe('Test Skipper insertion into database', () => {
  before(async () => {
    await initDatabase();
    await Skipper.create({
      name: 'Kees',
      pricePerDay: 250,
      birthDate: new Date('05-15-1996'),
      leave: false,
    });
  });

  after(async () => {
    await dropDatabase();
  });

  describe('Skipper creation test', () => {
    it('Test if name is correct of created skipper', async () => {
      const res = await request(app).get('/skippers');
      expect(res.status).to.equal(200);
      expect(res.body[0].name).to.equal('Kees');
    });

    it('Test if pricePerDay is correct of created skipper', async () => {
      const res = await request(app).get('/skippers');
      expect(res.status).to.equal(200);
      expect(res.body[0].pricePerDay).to.equal(250);
    });

    it('Test if birthDay is correct of created skipper', async () => {
      const res = await request(app).get('/skippers');
      expect(res.status).to.equal(200);
      expect(new Date(res.body[0].birthDate)).to.deep.equal(
        new Date('05-15-1996')
      );
    });

    it('Test if leave boolean is correct of created skipper', async () => {
      const res = await request(app).get('/skippers');
      expect(res.status).to.equal(200);
      expect(res.body[0].leave).to.equal(false);
    });
  });
});

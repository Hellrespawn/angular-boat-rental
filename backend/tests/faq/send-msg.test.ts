import { expect } from 'chai';
import { closeDatabase, initDatabase } from '../mocha-setup';
import { Message } from '../../src/model/message.model';
import request from 'supertest';
import { app } from '../../src/server';

// test to check if messages go to DB
describe('Test Message', () => {
  let message: Message;
  before(async () => {
    await initDatabase();

    message = await Message.create({
      name: 'Testgebruiker1',
      email: 'Testgebruiker@hotmail.com',
      text: 'Lorem Ipsum',
    });
  });
  after(closeDatabase);

  it('Check DB connection', async () => {
    const res = await request(app).get(`/faq`);
    expect(res.status).to.equal(200);
  });

  it('Check if fields are same as DB fields', async () => {
    const res = await request(app).get(`/faq`);
    console.log(res.body.message[0]);
    // console.log(message.name)
    // expect(res.status).to.equal(200);
    expect(res.body.message[0].name).to.equal('Testgebruiker1');
    expect(res.body.message[0].email).to.equal('Testgebruiker@hotmail.com');
    expect(res.body.message[0].text).to.equal('Lorem Ipsum');
  });

});

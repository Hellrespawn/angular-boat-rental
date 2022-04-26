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

  it('Responds `{ send: true }` when message is equal to DB message', async () => {
    const res = await request(app).get(`/faq/`);
    // console.log(res.body.message[0].name)
    expect(res.status).to.equal(200);
    expect(message.name).to.deep.equal('Testgebruiker1');

    expect(res.status).to.equal(200);
    expect(message.email).to.deep.equal('Testgebruiker@hotmail.com');

    expect(res.status).to.equal(200);
    expect(message.text).to.deep.equal('Lorem Ipsum');
  });
});

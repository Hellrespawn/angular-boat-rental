import { expect } from 'chai';
import { User } from '../../src/model/user';

describe('Test User', () => {
  it('Hashes passwords', async () => {
    const password = '1234ab';

    const user = await User.create(
      'a',
      'b',
      false,
      'a@b.c',
      password,
      false,
      false
    );

    expect(user.password).to.not.equal(password);
  });

  it('Verifies passwords', async () => {
    const password = '1234ab';

    const user = await User.create(
      'a',
      'b',
      false,
      'a@b.c',
      password,
      false,
      false
    );

    expect(await user.verifyPassword(password)).to.be.true;
  });
});

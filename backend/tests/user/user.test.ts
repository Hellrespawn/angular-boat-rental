import { expect } from 'chai';
import { TEST_USER } from '..';
import { User } from '../../src/model/user';

describe('Test User', () => {
  describe('Password requirements', () => {
    it('Accepts password meeting requirements', async () => {
      try {
        const password = 'abcdef1A';

        await User.create('a', 'b', false, 'a@b.c', password, false, false);
      } catch {
        expect.fail('Valid password was rejected by User.create');
      }
    });

    it('Rejects password with too few capital letters', async () => {
      try {
        const password = 'abcdef1';

        await User.create('a', 'b', false, 'a@b.c', password, false, false);
      } catch (error) {
        expect((error as Error).message).to.contain('uppercase');
        return;
      }

      expect.fail('Invalid password was accepted by User.create');
    });

    it('Rejects password with too few numbers', async () => {
      try {
        const password = 'abcdefA';

        await User.create('a', 'b', false, 'a@b.c', password, false, false);
      } catch (error) {
        expect((error as Error).message).to.contain('numbers');
        return;
      }

      expect.fail('Invalid password was accepted by User.create');
    });

    it('Rejects password with too few characters', async () => {
      try {
        const password = 'a1A';

        await User.create('a', 'b', false, 'a@b.c', password, false, false);
      } catch (error) {
        expect((error as Error).message).to.contain('characters');
        return;
      }

      expect.fail('Invalid password was accepted by User.create');
    });
  });

  it('Hashes passwords', async () => {
    const { password } = TEST_USER;

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
    const { password } = TEST_USER;

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

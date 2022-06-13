import { expect } from 'chai';
import { SessionService } from '../../src/services/session.service';
import { Session } from '../../src/model/session';
import { User } from '../../src/model/user';

describe('Test Session', () => {
  describe('Test Session.isExpired()', () => {
    function testSessionExpiration(date: Date, expected: boolean): void {
      expect(
        new Session(-1, '', {} as unknown as User, date).isExpired()
      ).to.equal(expected);
    }

    it('Current date is not expired', () => {
      testSessionExpiration(new Date(), false);
    });

    it('MaxSessionAge + 10 is expired', () => {
      const expired = new Date();
      expired.setDate(expired.getDate() - SessionService.MaxSessionAge - 10);

      testSessionExpiration(expired, true);
    });

    it('Exactly MaxSessionAge is expired', () => {
      const exactlyExpired = new Date();
      exactlyExpired.setDate(
        exactlyExpired.getDate() - SessionService.MaxSessionAge
      );

      testSessionExpiration(exactlyExpired, true);
    });

    it('MaxSessionAge - 1 is not expired', () => {
      const exactlyValid = new Date();
      exactlyValid.setDate(
        exactlyValid.getDate() - SessionService.MaxSessionAge + 1
      );

      testSessionExpiration(exactlyValid, false);
    });
  });
});

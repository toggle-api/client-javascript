import { expect } from 'chai';
import { UserToggles } from '../src/user-toggles';

describe('UserToggles', () => {
  let user_toggles: UserToggles;

  describe('load', () => {
    it('promises itself', () => {
      user_toggles = new UserToggles('host', 'pub_key', 'user-id');
      return user_toggles.load().
        then((promised) => {
          expect(promised).to.equal(user_toggles);
        });
    });

    it('', () => {

    });
  });

  describe('getToggle', () => {
    beforeEach(() => {
      user_toggles = new UserToggles('host', 'pub_key', 'user-id');
    });

    it('defaults when data is not loaded', () => {
      expect(user_toggles.getToggle('my-id', true)).to.equal(true);
      expect(user_toggles.getToggle('my-id', false)).to.equal(false);
    });
    it('defaults for an undefined selection', () => {
      user_toggles['initialLoadComplete'] = true;
      user_toggles['toggleSelections'] = {};
      expect(user_toggles.getToggle('my-id', false)).to.equal(false);
      expect(user_toggles.getToggle('my-id', true)).to.equal(true);
    });
    it('returns the selection', () => {
      user_toggles['initialLoadComplete'] = true;
      user_toggles['toggleSelections'] = {'my-id': true};
      expect(user_toggles.getToggle('my-id', false)).to.equal(true);
    });
  });

  describe('getToggleFlag', () => {
    beforeEach(() => {
      user_toggles = new UserToggles('host', 'pub_key', 'user-id');
    });
    it('defaults when data is not loaded', () => {
      expect(user_toggles.getToggleFlag('my-id', 'blue')).to.equal('blue');
      expect(user_toggles.getToggleFlag('my-id', 'green')).to.equal('green');
    });
    it('defaults for an undefined selection', () => {
      user_toggles['initialLoadComplete'] = true;
      user_toggles['toggleSelections'] = {};
      expect(user_toggles.getToggleFlag('my-id', 'blue')).to.equal('blue');
      expect(user_toggles.getToggleFlag('my-id', 'green')).to.equal('green');
    });
    it('returns the selection', () => {
      user_toggles['initialLoadComplete'] = true;
      user_toggles['toggleSelections'] = {'my-id': 'green'};
      expect(user_toggles.getToggleFlag('my-id', 'blue')).to.equal('green');
    });
  });
});

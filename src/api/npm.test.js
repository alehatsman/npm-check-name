import { expect } from 'chai';
import checkName from './npm';

describe('checkName', () => {
  it('should throw error if name is not specified', () => {
    expect(() => checkName()).to.throw('name must be provided');
  });

  it('should return true if name is available', (done) => {
    checkName('component').then((isAvailable) => {
      expect(isAvailable).to.be.equal(false);
      done();
    });
  });

  it('should return false if name is not available', (done) => {
    return checkName('component404').then((isAvailable) => {
      expect(isAvailable).to.be.equal(true);
      done();
    });
  });
});

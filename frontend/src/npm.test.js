import { expect } from 'chai';
import checkName from '../src/api';

describe('checkName', () => {
  it('should throw error if name is not specified', () => {
    expect(() => checkName()).to.throw('name must be provided');
  });

  it('should return result', (done) => {
    checkName('component').then(({ result }) => {
      expect(result).to.be.equal(false);
      done();
    });
  });
});

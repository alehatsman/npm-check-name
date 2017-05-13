import { expect } from 'chai';
import assert from './assert';

describe('assert', () => {
  it('should throw if expression false', () => {
    expect(() => assert(false, 'test error')).to.throw('test error');
  });

  it('should not throw if exression is true', () => {
    expect(() => assert(true, 'test error')).to.not.throw('test error');
  });
});

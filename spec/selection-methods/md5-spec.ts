import { expect } from 'chai';
import { MD5 } from '../../src/selection-methods/md5';

describe('Root Module', () => {
  it('expects export to be function', () => {
    expect(MD5).to.be.a('function');
  });
  it('expects val', () => {
    let selection_method = new MD5('abc', 104743);
    expect(selection_method.CalculateSelection('123')).to.be.closeTo(0.583294, 0.0000009);
  });
});

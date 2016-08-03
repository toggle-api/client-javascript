import {expect} from 'chai';
import * as toggleApi from '../src/index';

describe('Root Module', () => {
  it('should contain exports from commonjs modules', () => {
    expect(toggleApi.APIClient).to.be.a('function');
    expect(toggleApi.UserToggles).to.be.a('function');
    expect(toggleApi.Toggle).to.be.a('function');

    expect(toggleApi.JWTAuthenticator).to.be.a('function');
    expect(toggleApi.PublicAuthenticator).to.be.a('function');
  });
});

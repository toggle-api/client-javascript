import { expect } from 'chai';
import { JWTAuthenticator } from '../../src/authentication/jwt-authenticator';

describe('JWTAuthenticator', () => {
  it('builds auth header with Token', () => {
    let authenticator = new JWTAuthenticator('my token');
    expect(authenticator.buildAuthorizationHeader()).to.equal('Bearer my token');
  });
});

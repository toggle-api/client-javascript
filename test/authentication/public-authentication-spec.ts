import { expect } from 'chai';
import { PublicAuthenticator } from '../../src/authentication/public-authenticator';

describe('PublicAuthenticator', () => {
  it('builds auth header with Token', () => {
    let authenticator = new PublicAuthenticator('my token');
    expect(authenticator.buildAuthorizationHeader()).to.equal('Token my token');
  });
});

import { expect } from 'chai';
import { APIClient } from '../src/clients/api-client';
import { PublicAuthenticator } from '../src/authentication/public-authenticator';

describe('APIClient', () => {
  it('to have toggles getter', () => {
    let client = new APIClient('host', new PublicAuthenticator('key'));
    expect(client.getToggles).to.be.a('function');
  });
});

import { Authenticator } from './authentication';

export class PublicAuthenticator implements Authenticator {
  constructor(private public_key: string) {
  }

  buildAuthorizationHeader(): string {
    return 'Token ' + this.public_key;
  }
}

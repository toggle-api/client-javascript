import { Authenticator } from './authentication';

export class JWTAuthenticator implements Authenticator {
  constructor(private jwt: string) {
  }

  buildAuthorizationHeader(): string {
    return 'Bearer ' + this.jwt;
  }
}
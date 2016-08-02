export interface Authenticator {
  buildAuthorizationHeader(): string
}

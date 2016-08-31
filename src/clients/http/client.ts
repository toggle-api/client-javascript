export interface HTTPClient {
  getJson(uri: string): Promise<{string: any}>;
  postJson(uri: string, body: {string: string}): Promise<{string: any}>;
  del(uri: string): Promise<{string: any}>;
}

export interface HTTPClientConstructor {
  new(baseUrl: string): HTTPClient;
}

export const GET = 'GET', POST = 'POST', DELETE = 'DELETE';

type Json = { [key: string]: any; };

export abstract class RequestHTTPClient implements HTTPClient {
  getJson(uri: string): Promise<Json> {
    return this.makeRequest(GET, uri, undefined);
  }

  postJson(uri: string, body: Json): Promise<Json> {
    return this.makeRequest(POST, uri, body);
  }

  del(uri: string): Promise<Json> {
    return this.makeRequest(DELETE, uri, undefined);
  }

  protected abstract makeRequest(method: string, uri: string, body?: Json): Promise<Json>;
}

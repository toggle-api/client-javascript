import { RequestHTTPClient } from './client';

export class BrowserHTTPClient extends RequestHTTPClient {
  private Request = XMLHttpRequest;

  constructor(private baseUrl: string) { super(); }

  protected makeRequest(method: string, uri: string, body?: { [key: string]: any; }): Promise<{ [key: string]: any; }> {
    return new Promise<{string: any}>((resolve, reject) => {
      let httpRequest = new this.Request();
      httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === this.Request.DONE) {
          if (httpRequest.status === 200) {
            resolve(JSON.parse(httpRequest.responseText));
          } else {
            reject(JSON.parse(httpRequest.responseText));
          }
        }
      };
      httpRequest.onerror = () => {
        reject(httpRequest.statusText);
      };
      httpRequest.open(method.toUpperCase(), this.baseUrl + uri);
      httpRequest.setRequestHeader('Accept', 'application/json');
      if (body === undefined) {
        httpRequest.send();
      } else {
        httpRequest.setRequestHeader('Content-Type', 'application/json');
        httpRequest.send(JSON.stringify(body));
      }
    });
  }
}

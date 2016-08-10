import { RequestHTTPClient } from './client';
import * as http from 'http';
import * as https from 'https';
import { parse as parseUrl, Url } from 'url';

let adapters = {
  'http:': http,
  'https:': https,
};

export class NodeHTTPClient extends RequestHTTPClient {
  private url: Url;
  private agent: http.Agent;
  private adapter: typeof http;

  constructor(private baseUrl: string) {
    super();
    this.url = parseUrl(this.baseUrl);
    this.adapter = adapters[this.url.protocol];
    this.agent = new this.adapter.Agent({keepAlive: true});
  }

  protected makeRequest(method: string, uri: string, body?: { [key: string]: any; }): Promise<{ [key: string]: any; }> {
    let data = body === undefined ? '' : JSON.stringify(body);
    let options = this.buildRequestOptions(method, uri);

    if (body !== undefined) {
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }

    return new Promise<{string: any}>((resolve, reject) => {
      let req = this.adapter.request(options, (response) => {
        response.setEncoding('utf8');

        let response_data = this.combineResponseBody(response);

        if (response.statusCode === 200) {
          resolve(response_data);
        } else {
          response_data.then(reject);
        }
      });
      req.on('error', (e) => {
        reject(e);
      });
      req.write(data);
      req.end();
    });
  }

  private buildRequestOptions(method, uri): http.RequestOptions {
    return <http.RequestOptions>{
      agent: this.agent,
      hostname: this.url.host,
      port: this.url.port ? parseInt(this.url.port, 10) : undefined,
      path: this.url.path + uri,
      method: method.toUpperCase(),
      headers: {
        'Accept': 'application/json',
      }
    };
  }

  private combineResponseBody(response): Promise<{[key: string]: any; }> {
    return new Promise<{[key: string]: any; }>((resolve) => {
      let data = new Array<string>();
      response.on('data', function (chunk) {
        data.push(chunk);
      });
      response.on('end', function () {
        resolve(JSON.parse(data.join('')));
      });
    });
  }
}

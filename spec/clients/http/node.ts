import { expect } from 'chai';
import { NodeHTTPClient } from '../../../src/clients/http/node';
import * as http from 'http';
import * as https from 'https';

describe('NodeHTTPClient', () => {
  describe('constructor', () => {
    it('parses url', () => {
      let client = new NodeHTTPClient('https://example.com/test');
      expect(client['url'].protocol).to.equal('https:');
      expect(client['url'].host).to.equal('example.com');
      expect(client['url'].path).to.equal('/test');
    });
    describe('http', () => {
      it('selects http adapter', () => {
        let client = new NodeHTTPClient('http://example.com');
        expect(client['adapter']).to.equal(http);
      });
    });
    describe('https', () => {
      it('selects https adapter', () => {
        let client = new NodeHTTPClient('https://example.com');
        expect(client['adapter']).to.equal(https);
      });
    });
  });

  describe('makeRequest', () => {
    let client: NodeHTTPClient;
    let chunks: Array<string>;
    let error: any;
    let options: http.RequestOptions;
    let encoding: string;
    let writeData: string;
    let statusCode: number;

    beforeEach(() => {
      client = new NodeHTTPClient('http://example.com/');
      chunks = undefined;
      error = undefined;
      options = undefined;
      encoding = undefined;
      writeData = undefined;
      statusCode = 200;
      client['adapter'] = <typeof http>{request: function (opts, cb) {
        options = opts;
        let response_events = {data: [], end: []};
        let request_events = {error: []};
        cb(<any>{
          statusCode: statusCode,
          on: function (event_name, cb) {
            response_events[event_name].push(cb);
          },
          setEncoding: function (e) {
            encoding = e;
          }
        });
        return {
          on: function (event_name, cb) {
            request_events[event_name].push(cb);
          },
          write: function (d) {
            writeData = d;
          },
          end: function () {
            setTimeout(() => {
              if (chunks) {
                response_events.data.map((f) => chunks.map(f));
                response_events.end.forEach((cb) => cb());
              } else if (error) {
                request_events.error.map((cb) => cb(error));
              } else {
                throw new Error('Test must provide chunks or error');
              }
            });
          }
        };
      }};
    });

    it('returns combined request data', () => {
      client['combineResponseBody'] = function () {
        return new Promise<any>((resolve) => {
          resolve({test: 'data'});
        });
      };

      return client['makeRequest']('GET', 'test').
      then((responseData) => {
        expect(responseData).to.eql({test: 'data'});
      });
    });

    it('returns data', () => {
      chunks = ['{"test":"data2"}'];

      return client['makeRequest']('GET', 'test').
        then((responseData) => {
          expect(responseData).to.eql({test: 'data2'});
        });
    });

    it('uses the provided options', () => {
      chunks = ['{}'];
      client['agent'] = <any>{};
      client['url'] = {
        host: 'example.com',
      };
      client['buildRequestOptions'] = function (method, url) {
        return {test: 'options', method, url, headers: {}};
      };
      client['makeRequest']('GET', 'url');

      expect(options['test']).to.equal('options');
      expect(options.method).to.equal('GET');
      expect(options['url']).to.equal('url');
    });

    describe('with body', () => {
      it('sets the Content-Length header', () => {
        chunks = ['{}'];
        return expect(client['makeRequest']('GET', 'url', { test: 'data' })).to.be.fulfilled.
          then(() => {
            expect(options.headers['Content-Length']).to.equal(15);
          });
      });
      it('sets the Content-Type header', () => {
        chunks = ['{}'];
        return expect(client['makeRequest']('GET', 'url', {test: 'data'})).to.be.fulfilled.
          then(() => {
            expect(options.headers['Content-Type']).to.equal('application/json');
          });
      });
    });

    describe('with no body', () => {
      it('does not set the Content-Length header', () => {
        chunks = ['{}'];
        return expect(client['makeRequest']('GET', 'url')).to.be.fulfilled.
          then(() => {
            expect(options.headers['Content-Length']).to.be.undefined;
          });
      });

      it('does not set the Content-Type header', () => {
        chunks = ['{}'];
        return expect(client['makeRequest']('GET', 'url')).to.be.fulfilled.
          then(() => {
            expect(options.headers['Content-Type']).to.be.undefined;
          });
      });
    });

    it('sets encoding to utf-8', () => {
      chunks = ['{}'];
      return expect(client['makeRequest']('GET', 'url')).to.be.fulfilled.
          then(() => {
            expect(encoding).to.equal('utf8');
          });
    });

    it('writes body data', () => {
      chunks = ['{}'];
      return expect(client['makeRequest']('POST', 'url', {my: 'awesome', json: 'data'})).to.be.fulfilled.
        then(() => {
          expect(writeData).to.equal('{"my":"awesome","json":"data"}');
        });
    });

    it.skip('rejects on network error', () => {
      error = 'Network error';
      return expect(client['makeRequest']('POST', 'url', {my: 'awesome', json: 'data'})).to.eventually.be.rejected.and.eventually.equal('Network error');
    });

    it('writes body data', () => {
      chunks = ['{"message":"error"}'];
      statusCode = 400;
      return expect(client['makeRequest']('POST', 'url', {my: 'awesome', json: 'data'})).to.be.rejected.and.eventually.eql({message: 'error'});
    });
  });

  describe('buildRequestOptions', () => {
    it('uses the same agent for each build', () => {
      let client = new NodeHTTPClient('http://example.com');
      let options1 = client['buildRequestOptions']('GET', 'uri1');
      let options2 = client['buildRequestOptions']('POST', 'uri2');

      expect(options1.agent).to.not.be.undefined;
      expect(options1.agent).to.be.equal(options2.agent);
    });
    it('sets the hostname', () => {
      let client = new NodeHTTPClient('http://test.example.com/abc/');
      let options = client['buildRequestOptions']('GET', 'uri1');

      expect(options.hostname).to.equal('test.example.com');
    });
    it('does not set the port when empty', () => {
      let client = new NodeHTTPClient('http://test.example.com/abc/');
      let options = client['buildRequestOptions']('GET', 'uri1');

      expect(options.port).to.equal(undefined);
    });
    it('sets the port', () => {
      let client = new NodeHTTPClient('http://test.example.com:8008/abc/');
      let options = client['buildRequestOptions']('GET', 'uri1');

      expect(options.port).to.equal(8008);
    });
    it('sets the path', () => {
      let client = new NodeHTTPClient('http://test.example.com/abc/');
      let options = client['buildRequestOptions']('GET', 'uri1');

      expect(options.path).to.equal('/abc/uri1');
    });
    it('sets the method', () => {
      let client = new NodeHTTPClient('http://test.example.com/abc/');
      let options = client['buildRequestOptions']('DeLeTE', 'uri1');

      expect(options.method).to.equal('DELETE');
    });
    it('sets Accept header to json', () => {
      let client = new NodeHTTPClient('http://test.example.com/abc/');
      let options = client['buildRequestOptions']('GET', 'uri1');

      expect(options.headers['Accept']).to.equal('application/json');
    });
  });

  describe('combineResponseBody', () => {
    it('combines data', () => {
      let client = new NodeHTTPClient('http://example.com/');

      let events: any = {};
      let response = {
        on: function (event_name, cb) {
          events[event_name] = cb;
        }
      };
      setTimeout(() => {
        ['{"test', '":', '"data"', '}'].map(events.data);
        events.end();
      });
      return client['combineResponseBody'](response).then((data) => {
        expect(data).to.eql({test: 'data'});
      });
    });
  });
});

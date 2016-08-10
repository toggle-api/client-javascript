import { expect } from 'chai';
import { BrowserHTTPClient } from '../../../src/clients/http/browser';

describe('BrowserHTTPClient', () => {
  let client: BrowserHTTPClient;
  let method: string;
  let url: string;
  let sendData: string;
  let headers: {[key: string]: string};
  let status: number;
  let error: any;
  let responseText: string;

  beforeEach(() => {
    method = undefined;
    url = undefined;
    sendData = undefined;
    headers = {};
    status = 200;
    error = undefined;
    responseText = undefined;


    client = new BrowserHTTPClient('http://example.com/');
    client['Request'] = <any>function () {
      return {
        open: function (m, u) {
          method = m;
          url = u;
        },
        setRequestHeader: function (name, value) {
          headers[name] = value;
        },
        send: function (data) {
          sendData = data;
          this.readyState = 1;
          this.status = status;
          this.responseText = responseText;
          if (error) {
            this.statusText = error;
            setTimeout(this.onerror);
          } else {
            setTimeout(this.onreadystatechange);
          }
        }
      };
    };
    client['Request'].DONE = 1;
  });

  it('parses the response', () => {
    responseText = '{"test":"data"}';

    return expect(client['makeRequest']('GET', 'path')).to.eventually.eql({test: 'data'});
  });

  it('sends the method', () => {
    responseText = '{"test":"data"}';

    return expect(client['makeRequest']('GET', 'path')).to.be.fulfilled.
      then(() => {
        expect(method).to.equal('GET');
      });
  });

  it('builds the correct url', () => {
    responseText = '{"test":"data"}';

    return expect(client['makeRequest']('GET', 'path')).to.be.fulfilled.
      then(() => {
        expect(url).to.equal('http://example.com/path');
      });
  });

  describe('without a body', () => {
    it('sends accept header', () => {
      responseText = '{"test":"data"}';

      return expect(client['makeRequest']('GET', 'path')).to.be.fulfilled.
        then(() => {
          expect(headers['Accept']).to.equal('application/json');
        });
    });

    it('sends an empty body', () => {
      responseText = '{"test":"data"}';

      return expect(client['makeRequest']('GET', 'path')).to.be.fulfilled.
      then(() => {
        expect(sendData).to.be.undefined;
      });
    });
  });

  describe('with a body', () => {
    it('sends content headers', () => {
      responseText = '{"test":"data"}';

      return expect(client['makeRequest']('POST', 'path', {data: 'test'})).to.be.fulfilled.
        then(() => {
          expect(headers['Accept']).to.equal('application/json');
          expect(headers['Content-Type']).to.equal('application/json');
        });
    });

    it('sends body as json', () => {
      responseText = '{"test":"data"}';

      return expect(client['makeRequest']('POST', 'path', {data: 'test'})).to.be.fulfilled.
        then(() => {
          expect(sendData).to.equal('{"data":"test"}');
        });
    });
  });

  it('rejects with errors', () => {
    error = 'Network error';

    return expect(client['makeRequest']('POST', 'path', {data: 'test'})).to.be.rejected.
      and.eventually.equal('Network error');
  });

  it('rejects with http errors', () => {
    status = 400;
    responseText = '{"message":"error"}';

    return expect(client['makeRequest']('POST', 'path', {data: 'test'})).to.be.rejected.
    and.eventually.eql({message: 'error'});
  });
});

import { expect } from 'chai';
import { BrowserHTTPClient } from '../../../src/clients/http/browser';

describe('BrowserHTTPClient', () => {
  let client: BrowserHTTPClient;
  let method: string | undefined;
  let url: string | undefined;
  let sendData: string | undefined;
  let headers: {[key: string]: string};
  let status: number;
  let error: any;
  let responseText: string | undefined;

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
        open: function (m: string, u: string) {
          method = m;
          url = u;
        },
        setRequestHeader: function (name: string, value: string) {
          headers[name] = value;
        },
        send: function (data: string) {
          sendData = data;
          this.readyState = client['Request'].DONE;
          this.status = status;
          this.responseText = responseText;
          if (error !== undefined) {
            this.statusText = error;
            setTimeout(this.onerror);
          } else {
            setTimeout(this.onreadystatechange);
          }
        }
      };
    };
  });

  it('parses the response', () => {
    responseText = '{"test":"data"}';

    return expect(client['makeRequest']('GET', 'path')).to.be.fulfilled.
      and.eventually.eql({test: 'data'});
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

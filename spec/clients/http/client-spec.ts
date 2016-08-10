import { expect } from 'chai';
import { RequestHTTPClient } from '../../../src/clients/http/client';

describe('RequestHTTPClient', () => {
  let calls: Array<any>;
  let client: MockHTTPClient;

  class MockHTTPClient extends RequestHTTPClient {
    protected makeRequest(method: string, uri: string, body: {string: string}): Promise<{string: any}> {
      calls.push({method, uri, body});
      return Promise.resolve({});
    };
  }

  beforeEach(() => {
    calls = [];
    client = new MockHTTPClient();
  });

  describe('getJson', () => {
    beforeEach(() => {
      client.getJson('myUri');
    });

    it('calls makeRequest with GET', () => {
      expect(calls[0].method).to.equal('GET');
    });

    it('calls makeRequest with supplied uri', () => {
      expect(calls[0].uri).to.equal('myUri');
    });

    it('calls makeRequest with no body', () => {
      expect(calls[0].body).to.be.undefined;
    });
  });

  describe('postJson', () => {
    beforeEach(() => {
      client.postJson('myPostUri', {test: 'data'});
    });

    it('calls makeRequest with GET', () => {
      expect(calls[0].method).to.equal('POST');
    });

    it('calls makeRequest with supplied uri', () => {
      expect(calls[0].uri).to.equal('myPostUri');
    });

    it('calls makeRequest with body', () => {
      expect(calls[0].body).to.eql({test: 'data'});
    });
  });

  describe('del', () => {
    beforeEach(() => {
      client.del('myDeleteUri');
    });

    it('calls makeRequest with DELETE', () => {
      expect(calls[0].method).to.equal('DELETE');
    });

    it('calls makeRequest with supplied uri', () => {
      expect(calls[0].uri).to.equal('myDeleteUri');
    });

    it('calls makeRequest with no body', () => {
      expect(calls[0].body).to.be.undefined;
    });
  });
});

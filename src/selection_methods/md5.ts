import md5 = require('crypto-js/md5');
import encodeHex = require('crypto-js/enc-hex');
import { SelectionMethod } from './selection_method';

export class MD5 implements SelectionMethod {
  constructor(private salt: string,
              private int: number) {
  }

  CalculateSelection(identifier: string): number {
    let toHash = this.salt + identifier;
    let hashedValue = this.hash(toHash);
    let remainder = parseInt(hashedValue, 16) % this.int;
    return remainder / this.int
  }

  private hash(value: string) {
    return md5(value).toString(encodeHex);
  }
}

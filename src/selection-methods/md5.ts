import md5 = require('crypto-js/md5');
import encodeHex = require('crypto-js/enc-hex');
import { SelectionMethod } from './selection-method';

export class MD5 implements SelectionMethod {
  private sliceSize = 8;

  constructor(private salt: string,
              private int: number) {
  }

  CalculateSelection(identifier: string): number {
    let toHash = this.salt + identifier;
    let hashedValue = this.hash(toHash);
    let value = Array.from<number>(Array(hashedValue.length / this.sliceSize).keys()).
        map((i) => hashedValue.substr(i * this.sliceSize, this.sliceSize)).
        map((i) => parseInt(i, 16)).
        reduce((a, b) => a + b, 0);
    let remainder = value % this.int;
    return remainder / this.int;
  }

  private hash(value: string) {
    return md5(value).toString(encodeHex);
  }
}

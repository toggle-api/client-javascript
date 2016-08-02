interface WordArray {}

interface Encoding {
  stringify(wordArray: WordArray): string;
  parse(hexStr: string): WordArray;
}

declare module 'crypto-js/md5' {
  interface Hash {
    toString(encoding: Encoding): string;
  }

  function md5(toHash: string): Hash;

  export = md5;
}

declare module 'crypto-js/enc-hex' {
  var encoding: Encoding;
  export = encoding;
}

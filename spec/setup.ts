import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

if (typeof XMLHttpRequest === 'undefined') {
  global['XMLHttpRequest'] = null;
}

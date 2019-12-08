/**
 * Created by nilptr on 16/2/29.
 */

function PKCS7(k) {
  if (!(this instanceof PKCS7)) return new PKCS7(k);
  if (k < 1 || k > 255) throw new TypeError("invalid k: k < 1 or k > 255");
  this.blockSize = k;
}

PKCS7.prototype.pad = function(buf) {
  var blockSize = this.blockSize;
  var bufLen = buf.length;
  var padLen = blockSize - (bufLen % blockSize);
  var padding = new Buffer(padLen).fill(padLen);
  return Buffer.concat([buf, padding]);
};

/**
 * returns a new Buffer without pkcs#7 padding
 *
 * @param {Buffer} buf
 * @throw Error: invalid pkcs#7 padded buffer
 * @returns {*}
 */
PKCS7.prototype.unpad = function(buf) {
  // check length
  var blockSize = this.blockSize;
  var bufLen = buf.length;
  if (bufLen % blockSize !== 0) throw new Error("invalid pkcs#7 padded buffer");

  // check padding
  var padLen = buf[bufLen - 1];
  var padding = buf.slice(bufLen - padLen);
  for (var i = 0; i < padLen; ++i)
    if (padding[i] !== padLen) throw new Error("invalid pkcs#7 padded buffer");

  return buf.slice(0, bufLen - padLen);
};

module.exports = new PKCS7(32);

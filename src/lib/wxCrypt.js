// signature & AES
var crypto = require("crypto");

var base64 = require("./base64");
var pkcs7 = require("./pkcs7");

function WXBizMsgCrypt(token, encodingAESKey, appId) {
  if (!(this instanceof WXBizMsgCrypt)) {
    return new WXBizMsgCrypt(token, encodingAESKey, appId);
  }

  if (encodingAESKey.length !== 43) throw new Error("Illegal encodingAESKey");

  this.token = token;
  this.encodingAESKey = encodingAESKey;
  this.appId = appId;

  this._AESKey = base64.decodeBase64(encodingAESKey + "=");
  this._iv = this._AESKey.slice(0, 16);
}

WXBizMsgCrypt.prototype.encrypt = function(text) {
  var raw = Buffer.concat([
    crypto.randomBytes(16),
    getByteSize(text),
    new Buffer(text),
    new Buffer(this.appId),
  ]);
  raw = pkcs7.pad(raw);

  var cipher = crypto.createCipheriv("aes-256-cbc", this._AESKey, this._iv);
  cipher.setAutoPadding(false);

  var bufs = [];
  bufs.push(cipher.update(raw));
  bufs.push(cipher.final());

  return Buffer.concat(bufs).toString("base64");
};

WXBizMsgCrypt.prototype.decrypt = function(ciphertext) {
  var decipher = crypto.createDecipheriv("aes-256-cbc", this._AESKey, this._iv);
  decipher.setAutoPadding(false);

  // may throw error:DecodeBase64Error
  var rawBuf = base64.decodeBase64(ciphertext);

  // decipher buffer
  var bufs = [];
  bufs.push(decipher.update(rawBuf));
  bufs.push(decipher.final());
  var buf = Buffer.concat(bufs);

  // unpad buffer
  buf = pkcs7.unpad(buf);

  // remove 16 bytes random buffer
  buf = buf.slice(16);

  // read msg byte length
  var msgLen = buf.readUInt32BE(0);
  buf = buf.slice(4);

  // appId 校验
  var devAppId = buf.slice(msgLen).toString("utf8");
  if (devAppId !== this.appId) throw new Error("Validate AppId Error");

  return buf.slice(0, msgLen).toString("utf8");
};

WXBizMsgCrypt.prototype.getSignature = function(timeStamp, nonce, encryptMsg) {
  var sha1 = crypto.createHash("sha1");
  sha1.update([this.token, timeStamp, nonce, encryptMsg].sort().join(""));
  return sha1.digest("hex");
};

WXBizMsgCrypt.prototype.encryptMsg = function(replyMsg, timeStamp, nonce) {
  var encryptMsg = this.encrypt(replyMsg);

  timeStamp = timeStamp || "" + parseInt(Date.now() / 1000, 10);
  nonce = nonce || randomStr(6);

  var msgSignature = this.getSignature(timeStamp, nonce, encryptMsg);

  return (
    "<xml>" +
    "<Encrypt><![CDATA[" +
    encryptMsg +
    "]]></Encrypt>" +
    "<MsgSignature><![CDATA[" +
    msgSignature +
    "]]></MsgSignature>" +
    "<TimeStamp>" +
    timeStamp +
    "</TimeStamp>" +
    "<Nonce><![CDATA[" +
    nonce +
    "]]></Nonce>" +
    "</xml>"
  );
};

WXBizMsgCrypt.prototype.decryptMsg = function(
  msgSignature,
  timeStamp,
  nonce,
  encryptMsg
) {
  var devMsgSignature = this.getSignature(timeStamp, nonce, encryptMsg);

  // signature fail
  if (devMsgSignature !== msgSignature)
    throw new Error("ValidateSignatureError");

  return this.decrypt(encryptMsg);
};

module.exports = WXBizMsgCrypt;

/**
 * 将字符串的字节长度换为4byte的大字节序buffer(网络字节序 字节 低 -> 高)
 * @param str
 * @returns {Buffer}
 * @private
 */
function getByteSize(str) {
  var buf = new Buffer(4);
  buf.writeUInt32BE(Buffer.byteLength(str), 0);
  return buf;
}

/**
 * 生成一定长度的随机字符串
 * @param len
 * @returns {string}
 * @private
 */
function randomStr(len) {
  var range = "abcdefghijklmnopqrstuvwxyz0123456789";
  var chars = [];

  for (var i = 0; i < len; ++i) {
    var idx = Math.floor(Math.random() * 36);
    chars.push(range[idx]);
  }

  return chars.join("");
}

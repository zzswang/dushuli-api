/**
 * 使用base64编码utf8字符串
 *
 * @param {string} str 待编码字符串
 * @return {string} 返回base64编码后的字符串
 */
exports.encodeBase64 = function encodeBase64(str) {
  return new Buffer(str, "utf8").toString("base64");
};

/**
 * 解码base64字符串
 *
 * @param {string} str base64编码的字符串
 * @throw error: Invalid base64 encoded string
 * @return {Buffer}
 */
exports.decodeBase64 = function decodeBase64(str) {
  if (!(str.length % 4 === 0 && /[\w\d\+\/]+={0,2}/.test(str)))
    throw new Error("Invalid base64 encoded string");
  return new Buffer(str, "base64");
};

const {Cc, Ci} = require('chrome');
const converter = Cc["@mozilla.org/intl/scriptableunicodeconverter"]
                  .createInstance(Components.interfaces.nsIScriptableUnicodeConverter),  
      crypto    = Cc["@mozilla.org/security/hash;1"]  
                  .createInstance(Components.interfaces.nsICryptoHash);  

converter.charset = "UTF-8";
var hash, md5, sha1;

hash = function (algo, str) {
  var data, hash, result = {};
  
  data = converter.convertToByteArray(str, result);
  crypto.init(crypto[algo]);
  crypto.update(data, data.length);
  hash = crypto.finish(false);
  
  function toHexStr(charCode) {
    return ("0" + charCode.toString(16)).slice(-2);
  }
  
  return [toHexStr(hash.charCodeAt(i)) for (i in hash)].join("");
}

md5  = function (str) { hash("MD5",  str); };
sha1 = function (str) { hash("SHA1", str); };

exports.hash = hash;
exports.md5  = md5;
exports.sha1 = sha1;

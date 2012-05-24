const {Cc, Ci} = require('chrome');
const converter = Cc["@mozilla.org/intl/scriptableunicodeconverter"]
                  .createInstance(Components.interfaces.nsIScriptableUnicodeConverter),  
      crypto    = Cc["@mozilla.org/security/hash;1"]  
                  .createInstance(Components.interfaces.nsICryptoHash);  

converter.charset = "UTF-8";

exports.hash = function (algo, str) {
  var data, hash, result = {};
  
  data = converter.convertToByteArray(str, result);
  crypto.initWithString(algo);
  crypto.update(data, data.length);
  hash = crypto.finish(false);
  
  function toHexStr(charCode) {
    return ("0" + charCode.toString(16)).slice(-2);
  }
  
  return [toHexStr(hash.charCodeAt(i)) for (i in hash)].join("");
}
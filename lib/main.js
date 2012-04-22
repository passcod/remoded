const {Cc, Ci} = require('chrome');
const data = require('self').data,
      coffeepot = require('coffeepot'),
      file = require('file'),
      dirSvc = Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties),
      homeDir = dirSvc.get('Home', Ci.nsIFile).path,
      remoDir = file.join(homeDir, homeDir.indexOf('/') === 0 ? '.remoded' : 'remoded');

var coffee = coffeepot.create();

// Make sure the directory exists
file.mkpath(remoDir);

exports.main = function (options, callbacks) {
  file.list(remoDir).forEach(function (dir) {
    var manifest = file.join(remoDir, dir, 'Manifest');

    if (file.exists(manifest)) {
      coffee.brew(file.read(manifest), function (fresh) {
        if (fresh.replace(/\n*\s*/,'').length > 0) {
          console.log("[script]: "+dir);
        }
      });
    }
  });
};

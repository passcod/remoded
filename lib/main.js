const {Cc, Ci} = require('chrome');
const data = require('self').data,
      brew = require('coffeepot').brew,
      file = require('file'),
      dirSvc = Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties),
      homeDir = dirSvc.get('Home', Ci.nsIFile).path,
      remoDir = file.join(homeDir, homeDir.indexOf('/') === 0 ? '.remoded' : 'remoded');

// Make sure the directory exists
file.mkpath(remoDir);

exports.main = function (options, callbacks) {
  
  file.list(remoDir).forEach(function (dir) {
    var manifest = file.join(remoDir, dir, 'Manifest');

    if (file.exists(manifest)) {
      console.log(brew(file.read));
    }
  });

};

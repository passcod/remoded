// Requires
const  {Cc, Ci} = require('chrome');
const      data = require('self').data,
         pubsub = require('observer-service'),
      coffeepot = require('coffeepot'),
           file = require('file'),

// Constants
         dirSvc = Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties),
        homeDir = dirSvc.get('Home', Ci.nsIFile).path,
        remoDir = file.join(homeDir, homeDir.indexOf('/') === 0 ? '.remoded' : 'remoded');

// Variables
var coffee = coffeepot.create(),

// Functions
  getScriptList,
  executeManifest;


exports.main = function (options, callbacks) {
  pubsub.add("remoded:getscripts", getScriptList);
  pubsub.add("remoded:manifests:nonnull", executeManifest);

  // Make sure the directory exists
  file.mkpath(remoDir);

  // Start up (dev)
  pubsub.notify("remoded:getscripts", "http://example.com/path");
};


/*
  Get the list of remoded scripts that have a non-null
  manifest, and publish on the remoded:manifests:nonnull
  topic each result and its brewed manifest.
*/
getScriptList = function (subject) {
  file.list(remoDir).forEach(function (dir) {
    var manifest = file.join(remoDir, dir, 'Manifest');

    if (file.exists(manifest)) {
      coffee.brew(file.read(manifest), function (fresh) {
        if (fresh.replace(/\n*\s*/,'').length > 0) {
          pubsub.notify("remoded:manifests:nonnull", {
            script: dir,
            manifest: fresh,
            location: subject
          });
        }
      });
    }
  });
};

/*
  Execute a brewed manifest and "return" either:
  - false, if the script should not run on this
    location, or
  - a list of files to be loaded into the page,
    in order.

  The "return" value is published to the script:load
  topic if it is not false, and discarded otherwise.
*/
executeManifest = function (subject) {
  console.log("[script]: "+subject.script);
};
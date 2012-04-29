// Requires
const  {Cc, Ci} = require('chrome');
const      data = require('self').data,
         pubsub = require('observer-service'),
      coffeepot = require('coffeepot'),
        remoded = require('remoded'),
           file = require('file'),

// Constants
         dirSvc = Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties),
        homeDir = dirSvc.get('Home', Ci.nsIFile).path,
        remoDir = file.join(homeDir, homeDir.indexOf('/') === 0 ? '.remoded' : 'remoded');

// Variables
var coffee = coffeepot.create(),
       dsl = remoded.create(),

// Functions
  getScriptList,
  executeManifest;


exports.main = function (options, callbacks) {
  pubsub.add("remoded:getscripts", getScriptList);
  pubsub.add("remoded:manifests:nonnull", executeManifest);

  // Make sure the directory exists
  file.mkpath(remoDir);

  // Start up (dev)
  pubsub.notify("remoded:getscripts", "http://sub.example.com/path?q=search#results");
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
  dsl.exec(subject.manifest, subject.location, function (result) {
    if (!!result) {
      pubsub.notify("remoded:script:load", {
        script: subject.script,
        manifest: result,
        location: subject.location
      });

      // DEBUG!
      require("windows").browserWindows.activeWindow.close()
    }
  });
};
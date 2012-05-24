// Requires
const  {Cc, Ci} = require('chrome');
const      data = require('self').data,
         pubsub = require('observer-service'),
        pagemod = require('page-mod'),
      coffeepot = require('coffeepot'),
        remoded = require('remoded'),
           hash = require('hash').hash,
           file = require('file'),

// Constants
         dirSvc = Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties),
        homeDir = dirSvc.get('Home', Ci.nsIFile).path,
        remoDir = file.join(homeDir, homeDir.indexOf('/') === 0 ? '.remoded' : 'remoded'),
       debugLog = true;

// Variables
var coffee = coffeepot.create(),
       dsl = remoded.create(),

// Functions
  rlog,
  debugLogging,
  getScriptList,
  executeManifest;


exports.main = function (options, callbacks) {
  pubsub.add("remoded:scripts:list", getScriptList);
  pubsub.add("remoded:manifests:nonnull", executeManifest);

  // Make sure the directory exists
  file.mkpath(remoDir);

  debugLogging(["scripts:list", "manifests:nonnull"]);
  
  pagemod.PageMod({
    include: "*",
    contentScriptFile: data.url("page-mod.js"),
    onAttach: function(worker) {
      worker.port.on("init", function (loc) {
        debugLogging("load:"+hash("SHA1", loc));
        pubsub.add("remoded:load:"+hash("SHA1", loc), function (subject) {
          var files = [], path;
          subject.instructions.load.forEach(function (f) {
            path = file.join( remoDir, subject.script, f );
            if (file.exists(path)) {
              files.push({
                  filename : f,
                scriptname : subject.script,
                  contents : file.read(path)
              });
            }
          });

          worker.port.emit("load-files", files);
          rlog(files);
        });

        pubsub.notify("remoded:scripts:list", loc);
      });
    }
  });

  require("tabs").open("http://dash.passcod.net");
};


rlog = function (msg) { console.log("[remoded]: "+msg); };

/*
  Subscribe to channels and log every message.
*/
debugLogging = function (channels) {
  if (!debugLog) { return; }
  if (typeof channels === "string") { channels = [channels]; }

  channels.forEach(function (chan) {
    (function (c) {
      pubsub.add("remoded:"+c, function (data) {
        rlog("Received message from channel "+c);
        rlog("^Data: "+JSON.stringify(data));
      });
    }(chan));
    rlog("Debugging channel "+chan);
  });
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
  - null, if the script should not run on this
    location, or
  - a list of files to be loaded into the page,
    in order.

  The "return" value is published to the :load
  topic if it is not false, and discarded otherwise.
*/
executeManifest = function (subject) {
  dsl.exec(subject.manifest, subject.location, function (result) {
    if (!!result) {
      pubsub.notify("remoded:load:"+hash("SHA1", subject.location), {
        script: subject.script,
        instructions: result,
        location: subject.location
      });
    }
  });
};
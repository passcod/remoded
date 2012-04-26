const data = require('self').data,
    worker = require('worker');
  
exports.create = function () {
  var ready = false,
      queue = [],
      done, exec, wrkr;

  done = function () {
    ready = true;
    queue.forEach(function (e) {
      exec(e.manifest, e.location, e.call)
    });
  };
  
  wrkr = worker.create(done, data.url("remoded-dsl.js"));
  
  exec = function (str, loc, callback) {
    if (ready) {
      wrkr.new(function (manifest, location) {
        return Remoded(manifest, location);
      }, [str, loc], callback);
    } else {
      queue.push({
        manifest: str,
        location: loc,
        call: callback
      });
    }
  };

  return {
    exec: exec
  };
};
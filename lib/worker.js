const data    = require('self').data,
  pageWorkers = require('page-worker');

exports.create = function (ready_callback, scripts) {
  var handlers = {},
      worker,
      request,
      reset,
      destroy,
      scache = scripts,
      setup,
      ready = ready_callback;
  
  // Only for internal use
  setup = function () {
    if (typeof scache === "string") {
      scache = [scache, data.url('worker.js')];
    } else {
      scache.push(data.url('worker.js'));
    }

    worker = pageWorkers.Page({
      contentURL: data.url("worker.html"),
      contentScriptFile: scache,
      contentScriptWhen: "ready",
      onMessage: function (msg) {
        if (msg.job) {
          if (msg.job === "ready") {
            ready();
          } else if (msg.job === "log") {
            console.log("[worker]: "+msg.data);
          } else {
            handlers[msg.job](msg.data);
            delete handlers[msg.job];
          }
        }
      }
    });
  };
  
  setup();
  
  // Actually used as .new()
  request = function (job, args, callback) {
    var msg, hash = '';
    "01234".split('').forEach(function(){hash+=(Math.random()*(10e15)).toString(36);});
    hash=hash.replace(/\./g,'');
    
    job = job.toString();
    msg = {
      func: job,
      job: hash,
      args: args
    };
    handlers[hash] = callback;
    
    try {
      worker.postMessage(msg);
    } catch (e) {
      scache.shift();
      setup();
      worker.postMessage(msg);
    }
  };
  
  // Resets the worker
  reset = function (ready_callback, scripts) {
    ready = ready_callback;
    scache = scripts;
    if (worker !== false) {
      destroy();
    }
        
    setup();
  };
  
  // After that, you can't use the
  // worker unless you reset it.
  destroy = function () {
    worker.destroy();
    worker = false;
  };
  
  return {
    "new"     : request,
    "reset"   : reset,
    "destroy" : destroy
  };
};

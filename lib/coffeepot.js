const data = require('self').data,
      worker = require('worker');
  
exports.create = function () {
  var ready = false,
      queue = [],
      done, brew, maker;

  done = function () {
    ready = true;
    queue.forEach(function (e) {
      brew(e.code, e.call)
    });
  };
  
  maker = worker.create(done, data.url("coffee-script.js"));
  
  brew = function (str, callback) {
    if (ready) {
      maker.new(function (s) {
        return CoffeeScript.compile(s,{bare:true});
      }, [str], callback);
    } else {
      queue.push({
        code: str,
        call: callback
      });
    }
  };

  return {
    brew: brew
  };
};
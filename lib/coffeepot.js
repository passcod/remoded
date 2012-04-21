const data = require('self').data,
      worker = require('worker');
  
var coffee = {};

coffee.ready = false;
coffee.queue = [];
coffee.done  = function () {
  coffee.brew  = coffee.maker.new;
  coffee.ready = true;
  coffee.queue.forEach(function (e) {
    coffee.make(e.code, e.call)
  });
};
coffee.maker = worker.create(coffee.done, data.url("coffee-script.js"));
coffee.make  = function (str, callback) {
  if (coffee.ready) {
    coffee.brew(function (s) {
      log(s);
      return CoffeeScript.compile(s,{bare:true});
    }, [str], callback);
  } else {
    coffee.queue.push({
      code: str,
      call: callback
    });
  }
};

exports.brew = coffee.make;
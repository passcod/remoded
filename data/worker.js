jobs = {};
postback = function (hash, data) {
  self.postMessage({
    job: hash,
    data: data
  });
};

log = function (data) {
  postback("log", JSON.stringify(data));
};

self.on('message', function (msg) {
  if (typeof msg === "string") {    
    msg = JSON.parse(msg);
  }
  
  msg.args.push(msg.hash);
  eval("jobs['"+msg.hash+"'] = "+msg.func+";");
  var result = jobs[msg.hash].apply({}, msg.args);
  if (result !== undefined || result !== null) {
    postback(msg.hash, result);
  }
});
self.postMessage('ready');
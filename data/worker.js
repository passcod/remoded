jobs = {};
postback = function (job, data) {
  self.postMessage({
    job: job,
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
  
  msg.args.push(msg.job);
  eval("jobs['"+msg.job+"'] = "+msg.func+";");
  var result = jobs[msg.job].apply({}, msg.args);
  if (result !== undefined || result !== null) {
    postback(msg.job, result);
  }
});
postback('ready');
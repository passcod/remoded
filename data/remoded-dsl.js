// Generated by CoffeeScript 1.3.1
(function() {
  var parseUri;

  window.Remoded = function(manifest, loc) {
    var current_scope, domain, load, match, port, result, scope;
    result = {
      scopes: [
        {
          matches: [],
          domains: [],
          ports: [],
          loads: [],
          children: []
        }
      ]
    };
    loc = log(parseUri(loc));
    current_scope = 0;
    match = function(expr) {
      return result.scopes[current_scope].matches.push(expr);
    };
    domain = function(expr) {
      return result.scopes[current_scope].domains.push(expr);
    };
    port = function(expr) {
      return result.scopes[current_scope].ports.push(expr);
    };
    load = function(files) {
      var file, _i, _len, _results;
      if (typeof files === 'string' || typeof files === 'number') {
        files = [files];
      }
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        _results.push(result.scopes[current_scope].loads.push(file));
      }
      return _results;
    };
    scope = function(call) {
      var length;
      length = result.scopes.push({
        contents: call,
        matches: [],
        domains: [],
        ports: [],
        loads: [],
        children: [],
        parent: current_scope
      });
      result.scopes[current_scope].children.push(length - 1);
      current_scope = length - 1;
      call();
      return current_scope = result.scopes[current_scope].parent;
    };
    eval(manifest);
    return log(result);
  };

  RegExp.prototype.toJSON = function() {
    return this.toString();
  };

  Function.prototype.toJSON = function() {
    return this.toString();
  };

  parseUri = function(uri) {
    var a, prop, props, protocols, result, _i, _len;
    result = {};
    a = document.createElement('a');
    props = 'protocol hostname host pathname port search hash href'.split(' ');
    a.href = uri;
    for (_i = 0, _len = props.length; _i < _len; _i++) {
      prop = props[_i];
      result[prop] = a[prop];
    }
    result.toString = function() {
      return a.href;
    };
    result.requestUri = a.pathname + a.search;
    result.protocol = a.protocol.replace(':', '');
    protocols = {
      http: 80,
      https: 443,
      ftp: 21
    };
    if (protocols[result.protocol] && !a.port) {
      result.port = +protocols[result.protocol];
    }
    return result;
  };

}).call(this);

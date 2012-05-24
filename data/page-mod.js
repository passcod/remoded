(function () {
  var headNode = document.querySelector("head"),

      addScript = function (file) {
        var script  = document.createElement("script");
        script.type = "text/javascript";
        script.innerHTML = file.contents;

        headNode.appendChild(script);

        script.setAttribute("data-remoded", '');
        script.setAttribute("data-remoded-filename",   file.filename);
        script.setAttribute("data-remoded-scriptname", file.scriptname);
      },
      addStyle  = function (file) {
        var style  = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = file.contents;

        headNode.appendChild(style);

        style.setAttribute("data-remoded", '');
        style.setAttribute("data-remoded-filename",   file.filename);
        style.setAttribute("data-remoded-scriptname", file.scriptname);
      },
      addFile   = function (file) {
        var script  = document.createElement("script");
        script.type = "text/plain";
        script.innerHTML = file.contents;

        headNode.appendChild(script);

        script.setAttribute("data-remoded", '');
        script.setAttribute("data-remoded-filename",   file.filename);
        script.setAttribute("data-remoded-scriptname", file.scriptname);
      };

  self.port.on("load-files", function (files) {
    files.forEach(function (file) {
      if (/\.js$/.test(file.filename)) {
        addScript(file); 
      } else if (/\.css$/.test(file.filename)) {
        addStyle(file);
      } else {
        addFile(file);
      }
    });
  });

  self.port.emit("init", document.URL);
}());
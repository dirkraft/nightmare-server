function Driver(reqId, n) {

  var _ = this;


  // For server
  _.reset = reset;
  _.runDriverScript = runDriverScript;
  _.finish = finish;

  function reset() {
    console.log(reqId, 'server.reset');
    return _;
  }

  function runDriverScript(driverScript) {
    console.log(reqId, 'server.runDriverScript');
    driverScript(_);
    return _;
  }

  function finish(serverFn) {
    console.log(reqId, 'server.finish');
    n.then(function (result) {
      serverFn(200, result);
    }).catch(function (error) {
      serverFn(500, error);
    });
    return _;
  }


  // For clients
  _.goto = goto;
  _.extract = extract;
  _.nightmare = nightmare;

  function goto(url) {
    console.log(reqId, 'client.goto', url);
    n = n.goto(url)
        .inject('js', 'node_modules/jquery/dist/jquery.min.js')
        .inject('js', 'jqextract.js');
    return _;
  }

  function extract(fn) {
    console.log(reqId, 'client.extract');
    n = n.evaluate(fn);
    return _;
  }

  function nightmare() {
    console.log(reqId, "client.nightmare() directly! (we won't have visibility)");
    return n;
  }

}

exports.Driver = Driver;

function Driver(nightmare) {

  var _ = this,
      n = nightmare;


  // For server
  _.reset = reset;
  _.runScript = runScript;
  _.finish = finish;

  function reset() {
    console.log('reset');
    return _;
  }

  function runScript(fn) {
    console.log('runScript');
    fn(_);
    return _;
  }

  function finish(res, serverFn) {
    console.log('finish');
    n.then(function (result) {
      serverFn();
      res.send(result);
      res.end();
    }).catch(function (error) {
      serverFn();
      console.error(error);
      res.sendStatus(500);
      res.end();
    });
    return _;
  }


  // For clients
  _.goto = goto;
  _.extract = extract;

  function goto(url) {
    console.log('goto', url);
    n = n.goto(url)
        .inject('js', 'node_modules/jquery/dist/jquery.min.js')
        .inject('js', 'jqextract.js');
    return _;
  }

  function extract(fn) {
    console.log('extract');
    n = n.evaluate(fn);
    return _;
  }

}

exports.Driver = Driver;

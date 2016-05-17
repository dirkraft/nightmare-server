var express = require('express'),
    bodyParser = require('body-parser'),
    Nightmare = require('nightmare'),
    Driver = require('./scriptDriver').Driver;

var app = express();
app.use(bodyParser.text({type: "*/*"}));
var nightmare = Nightmare({show: false}),
    driver = new Driver(nightmare);

// This is our poor request limiter. One electron, means 1 request at a time.
var requestCount = 0;

app.post('/', function (req, res) {

  console.log('Add 1 to count', requestCount);
  if (requestCount >= 1) {
    console.warn('My electron is busy. Responding with 503');
    res.sendStatus(503);
    res.end();
    return;
  }
  console.log('Dispatching driver script to electron.');
  ++requestCount;

  try {
    var fnStr = req.body.trim();
    var userScript = eval(fnStr);
    driver.reset()
        .runScript(userScript)
        .finish(res, function () {
          console.log('Remove 1 from count', requestCount);
          --requestCount;
        });
  } catch (e) {
    --requestCount;
    console.error(e);
    res.sendStatus(400);
    res.end();
  }

});

app.listen(3000, function () {
  console.log('server.js listening on port 3000!');
});

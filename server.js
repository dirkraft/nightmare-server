#!/usr/bin/env js

var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    sprintf = require('sprintf'),
    _ = require('lodash'),
    Nightmare = require('nightmare'),
    Driver = require('./scriptDriver').Driver;

var app = express();
app.use(bodyParser.text({type: "*/*"}));
var nightmare = Nightmare({show: false}),
    driver = new Driver(nightmare);

// This is our poor request limiter. One electron, means 1 request at a time.
var requestCount = 0;

app.post('/', function (req, res) {

  if (requestCount >= 1) {
    errorResponse(503, 'My electron is busy. Responding with 503');
    return;
  }

  console.log('Dispatching driver script to electron.');
  ++requestCount;

  try {

    if (req.params.template) {
      // TODO load all of these on startup
      fs.readFile('templates/' + req.params.template + '.js', 'utf8', function (err, template) {
        if (err) {
          errorResponse(400, err);
        }
        var fnStr = sprintf(template, req.params);
        driveRequest(fnStr);
      });
    } else {
      driveRequest(req.body.trim());
    }

  } catch (e) {
    --requestCount;
    errorResponse(500, e);
  }

  function driveRequest(fnStr) {
    var script = eval(fnStr);
    driver.reset()
        .runScript(script)
        .finish(res, function () {
          console.log('Releasing electron', requestCount);
          --requestCount;
        });
  }

  function errorResponse(status, error) {
    console.error(error);
    res.status(status).send(error.toString());
    res.end();
  }
});

app.listen(3000, function () {
  console.log('server.js listening on port 3000!');
});

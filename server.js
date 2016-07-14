#!/usr/bin/env node

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    sprintf = require('sprintf'),
    _ = require('lodash'),
    Nightmare = require('nightmare'),
    nightmare = new Nightmare({show: false}),
    Driver = require('./driver').Driver;

app.use(bodyParser.text({type: "*/*"}));

var queue = [];
// This must be limited to 1 (or boolean) as long as this process is limited to 1 nightmare/electron.
var dispatching = false;
var requestId = 0;

app.get('/*', handleExpressReq);

app.post('/*', handleExpressReq);

app.listen(3000, function () {
  console.log('server.js listening on port 3000!');
});


function handleExpressReq(req, res) {
  queue.push({req: req, res: res});
  dispatchNext();
}

function dispatchNext() {

  // TODO promises will probably help coalesce callbacks and exception handling

  try {
    if (dispatching) {
      console.log('I am too busy. Enqueued request. Queue:', queue.length, 'Dispatching:', dispatching);
      return;
    }

    if (!queue.length) {
      console.log('No more requests queued up. Queue:', queue.length, 'Dispatching:', dispatching);
      return;
    }

    var requestTuple = queue.shift(),
        req = requestTuple.req,
        res = requestTuple.res,
        reqId = ++requestId;

    dispatching = true;
    console.log(reqId, 'Dispatching request', req.path, '. Queue:', queue.length, 'Dispatching:', dispatching);

    if (req.query.template) {
      fs.readFile('templates/' + req.query.template + '.js', 'utf8', function (err, template) {
        if (err) {
          // Presumably template not found.
          errorResponse(400, err);
        }
        try {
          var fnStr = sprintf(template, req.query);

        } catch (e) {
          console.log(e);
          if (_.indexOf(e, 'does not exist')) {
            // Presumably missing formatter args.
            errorResponse(400, e);
          } else {
            errorResponse(500, e);
          }
        }

        return driveRequest(fnStr);
      });

    } else {
      return driveRequest(req.body);
    }

  } catch (e) {
    errorResponse(500, e);
  }

  function driveRequest(fnStr) {
    try {
      var userScript = eval(fnStr);
      if (!_.isFunction(userScript)) {
        return errorResponse(400, 'Request body is not a function. Should follow the form (function(driver|nightmare){ /* ... */ })')
      }
      var script;
      if (req.path.indexOf('/driver') == 0) {
        script = userScript;
      } else {
        // Wrap it up as a raw nightmare script
        script = (function (driver) {
          userScript(driver.nightmare());
        });
      }

      new Driver(reqId, nightmare)
          .reset()
          .runDriverScript(script)
          .finish(function (status, result) {
            res.status(status).send(result);
            res.end();
            dispatching = false;
            console.log(reqId, 'Finished positive response. Queue:', queue.length, 'Dispatching:', dispatching);
            dispatchNext();
          });

    } catch (e) {
      errorResponse(400, e);
    }
  }

  function errorResponse(status, error) {
    console.error(error);
    res.status(status).send(error.toString());
    res.end();
    dispatching = false;
    console.log(reqId, 'Finished error response. Queue:', queue.length, 'Dispatching:', dispatching);
    dispatchNext();
  }

}


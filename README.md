nightmare-server
================

A PoC which exposes [nightmare.js](https://github.com/segmentio/nightmare) 
over HTTP.

Note that only one browsing request is served at a time. There is a
request queue, but only a single nightmare-electron browser instance.
Requests are served sequentially in the order received.
The intention is that you run many docker containers which each process
a maximum of one virtual browsing session at a time. This way your
metrics per docker container correspond 1-1 with nightmare performance.



### Docker Usage ###

If you aren't familiar with docker (I wasn't when I did this),
it takes time and experimentation to get used to. Basically it involves
setting up: VirtualBox, then docker-machine, then issuing docker
commands to your docker-machine daemon thing (which is running in
VirtualBox). https://docs.docker.com/machine/get-started/

Retrieve and run the latest image from dockerhub. This will
start it in the current shell so you can watch any output.
Quit the container with ctrl-C.

    docker run -t -P -i dirkraft/nightmare-server

In a new terminal tab, get relevant connection points and put them
in some vars.

    eval $(docker-machine env)
    docker_addr=$(docker-machine ip)
    container_id=$(docker ps -f ancestor=dirkraft/nightmare-server -q)
    docker_port=$(docker port ${container_id} 3000 | cut -d ':' -f 2)
    nmserver=${docker_addr}:${docker_port}

So our nightmare-server is running in a docker container exposed to our
host machine, and we can reach it from the host as captured by

    echo ${nmserver}


### Usage ###

If you want to run plain nightmare scripts, make a request
to `/nightmare`. Pass an anonymous function expression in the request
body like in the following example. This navigates to
http://echo.dirkraft.com?echoFormat=application/json and returns the
contents of the `<pre>` element there.

    curl "${nmserver}/nightmare" -d '(function(nightmare){
        nightmare.goto("http://echo.dirkraft.com?echoFormat=application/json")
            .inject("js", "node_modules/jquery/dist/jquery.min.js")
            .evaluate(function() {
                return $("pre").text();
            })
    })'



#### Driver Scripts ####

There are also the beginnings of support for something I call
*driver script* via `/driver`. Like before, this script is given in
the body of the request.

    curl "${nmserver}/driver" -d '(function(driver){
      driver.goto("http://echo.dirkraft.com?echoFormat=application/json")
        .extract(function() {
          return $("pre").nmtext();
        });
    })'

This makes use of [driver.js](https://github.com/dirkraft/nightmare-server/blob/master/driver.js)
functions like `goto` and `extract` and also a jquery plugin
[jqextract.js](https://github.com/dirkraft/nightmare-server/blob/master/jqextract.js)
which provides `nmtext()`. The idea is to add higher-level functions
to these bindings and reduce the verbosity of client scripts.



#### Bundled Scripts ####

Whether using nightmare or driver scripts, the request can specify a
template to use in place of an explicitly provided script in the request
body.

This example opens a wikipedia page and returns the first article thumbnail 
image url. Instead of including the entire driver script in the request 
body, this request references a script bundled into nightmare-server and 
passes the formatter arguments which it requires. The bundled 
[wikipedia.firstimage](templates/wikipedia.firstimage.js) 
driver script requires only one formatter argument: **url**.

    curl "${nmserver}/driver?template=wikipedia.firstimage&url=https://en.wikipedia.org/wiki/Microlophus_albemarlensis"

outputs

    {"imageUrl":"//upload.wikimedia.org/wikipedia/commons/thumb/3/31/Male_Gal%C3%A1pagos_Santiago_lava_lizard.jpg/220px-Male_Gal%C3%A1pagos_Santiago_lava_lizard.jpg"}

Templates are [sprintf](https://www.npmjs.com/package/sprintf) format strings
placed in files in the [templates/](https://github.com/dirkraft/nightmare-server/tree/master/templates)
directory on the nightmare server.

The templates may be either driver or raw nightmare scripts, but
processing a template under the wrong '/driver' or '/nightmare' request
url will probably result in an error.



### Develop ###

Get any dependencies

    npm install

Run the server locally

    ./server.js



### Build ###

For me

    docker build -t dirkraft/nightmare-server .

and to publish to dockerhub

    docker push dirkraft/nightmare-server



### Why ###

Let me count the ways

  - A pet project to get exposure to docker and a bit of nodejs
  - Wanted nightmarejs isolated from my other processes. So turned it
    into a docker-based service.
  - Nightmare and electron don't *just work* on some commodity Linux
    instances. There is some system setup and dependencies to prepare.
  - Docker makes for great *appliances* and AWS ECS supports it well.



### License ###

```
The MIT License (MIT)
Copyright (c) 2016 Jason Dunkelberger (a.k.a. "dirkraft")

Permission is hereby granted, free of charge, to any person obtaining a 
copy of this software and associated documentation files (the 
"Software"), to deal in the Software without restriction, including 
without limitation the rights to use, copy, modify, merge, publish, 
distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject to 
the following conditions:

The above copyright notice and this permission notice shall be included 
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

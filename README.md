nightmare-server
================

A light express.js server that exposes nightmare.js over HTTP
oriented around extracting structured data from web pages.



### Docker Usage ###

Retrieve and run the latest image from dockerhub. This will
start it in the current shell so you can watch any output.
Quit the container with ctrl-C.

    docker run -t -P -i dirkraft/nightmare-server

Some docker commands to get relevant connection points.

    eval $(docker-machine env)
    docker_addr=$(docker-machine ip)
    container_id=$(docker ps -f ancestor=dirkraft/nightmare-server -q)
    docker_port=$(docker port ${container_id} 3000 | cut -d ':' -f 2)
    nmserver=${docker_addr}:${docker_port}

With curl

    curl -XPOST ${docker_addr}:${docker_port}  # params...


### Usage ###

nightmare-server expects a *driver script*. This can be given in
either in the body of the request or be bundled into the server and
referenced by a client.

Example in the request body:
This navigates to http://echo.dirkraft.com?echoFormat=application/json
and returns the contents of the `<pre>` element there.

    curl localhost:3000 -d '(function(driver){
      driver.goto("http://echo.dirkraft.com?echoFormat=application/json")
        .extract(function() {
          return $("pre").nmtext();
        });
    })'

Example referencing a bundled script:
This opens a wikipedia page and returns the first article thumbnail 
image url. Instead of including the entire driver script in the request 
body, this request references a script bundled into nightmare-server and 
passes the formatter arguments which it requires. The bundled 
[wikipedia.firstimage](templates/wikipedia.firstimage.js) 
driver script requires only one formatter argument: **url**.

    curl 'localhost:3000?template=wikipedia.firstimage&url=https://en.wikipedia.org/wiki/Microlophus_albemarlensis'

outputs

    {"imageUrl":"//upload.wikimedia.org/wikipedia/commons/thumb/3/31/Male_Gal%C3%A1pagos_Santiago_lava_lizard.jpg/220px-Male_Gal%C3%A1pagos_Santiago_lava_lizard.jpg"}



#### Driver Scripts ####



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



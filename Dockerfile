FROM debian
MAINTAINER dirkraft
RUN apt-get update
RUN apt-get install -y nodejs
RUN server.js
EXPOSE 3000

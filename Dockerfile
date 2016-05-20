FROM debian
MAINTAINER dirkraft
COPY . /opt/nightmare-server
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - && DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs
CMD /opt/nightmare-server/server.js
EXPOSE 3000

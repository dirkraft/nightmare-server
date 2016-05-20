#!/usr/bin/env bash

# Like interactive shell, from /etc/profile for root user
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y curl

curl -sL https://deb.nodesource.com/setup_6.x | bash
# apt-get update is part of node repo setup in previous RUN
DEBIAN_FRONTEND=noninteractive apt-get install -y libgtk2.0-0 libnotify4 libgconf-2-4 libnss3 nodejs xvfb

cd /opt/nightmare-server
npm install

#!/usr/bin/env bash

cd /opt/nightmare-server

# Sets PATH and some other expectations
curl -sL https://deb.nodesource.com/setup_6.x | bash
# apt-get update is part of node repo setup in previous RUN
DEBIAN_FRONTEND=noninteractive apt-get install -y curl libgtk2.0-0 libnotify4 libgconf-2-4 libnss3 nodejs xvfb
npm install

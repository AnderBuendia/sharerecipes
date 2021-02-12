#!/bin/bash

# Run server *
cd ~/sharerecipes/packages/server
/usr/bin/pm2 start /usr/bin/npm --name "back" -- start

cd ~/sharerecipes/packages/frontend
/usr/bin/pm2 start /usr/bin/npm --name "front" -- start


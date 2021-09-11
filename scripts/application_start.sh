#!/bin/bash

# Run server *
cd ~/sharerecipes
/usr/bin/pm2 start "npm run start:server" --name "back"

cd ~/sharerecipes/frontend
/usr/bin/pm2 start ecosystem.config.js --env production

# cd ~/sharerecipes/server
# /usr/bin/pm2 start /usr/bin/npm --name "back" -- start

